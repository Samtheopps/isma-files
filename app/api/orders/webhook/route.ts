import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { verifyWebhookSignature } from '@/lib/services/stripe.service';
import { sendOrderConfirmationEmail } from '@/lib/services/email.service';
import { generateLicenseContract } from '@/lib/services/pdf.service';
import { uploadToCloudinary } from '@/lib/services/cloudinary.service';
import dbConnect from '@/lib/db/mongodb';
import Order from '@/models/Order';
import Download from '@/models/Download';
import Beat from '@/models/Beat';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    // Récupérer le body brut (nécessaire pour la vérification de signature)
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('Webhook: Signature manquante');
      return NextResponse.json(
        { error: 'Signature manquante' },
        { status: 400 }
      );
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event;
    try {
      event = verifyWebhookSignature(body, signature);
    } catch (err: any) {
      console.error('Webhook: Signature invalide:', err.message);
      return NextResponse.json(
        { error: 'Signature invalide' },
        { status: 400 }
      );
    }

    console.log('Webhook reçu:', event.type);

    // Traiter l'événement
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        console.log('PaymentIntent réussi:', (event.data.object as Stripe.PaymentIntent).id);
        break;

      case 'charge.refunded':
        await handleRefund(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Type d'événement non géré: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('Erreur webhook:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    );
  }
}

/**
 * Gérer la session checkout complétée
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('Traitement checkout session:', session.id);

    await dbConnect();

    // Récupérer les métadonnées
    const userId = session.metadata?.userId;
    const itemsString = session.metadata?.items;

    if (!userId || !itemsString) {
      throw new Error('Métadonnées manquantes dans la session');
    }

    const items = JSON.parse(itemsString);

    // Récupérer l'utilisateur
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Créer la commande
    const order = new Order({
      userId,
      items: items.map((item: any) => ({
        beatId: item.beatId,
        beatTitle: item.beatTitle,
        licenseType: item.licenseType,
        price: item.price,
      })),
      totalAmount: session.amount_total! / 100, // Convertir centimes en euros
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      status: 'completed',
      deliveryEmail: session.customer_email || user.email,
    });

    await order.save();

    console.log('Commande créée:', order.orderNumber);

    // Générer les PDFs de licence pour chaque beat
    const contractUrls: string[] = [];

    for (const item of items) {
      const beat = await Beat.findById(item.beatId);
      if (!beat) continue;

      // Générer le PDF
      const pdfBuffer = await generateLicenseContract({
        orderNumber: order.orderNumber,
        customerName: `${user.firstName} ${user.lastName}`,
        customerEmail: user.email,
        beatTitle: item.beatTitle,
        licenseType: item.licenseType,
        price: item.price,
        date: new Date(),
      });

      // Upload sur Cloudinary
      const contractUrl = await uploadToCloudinary(
        pdfBuffer,
        `contracts/${order.orderNumber}_${item.beatId}.pdf`,
        'raw'
      );

      contractUrls.push(contractUrl);

      // Créer l'entrée Download
      const download = new Download({
        orderId: order._id,
        userId: user._id,
        beatId: item.beatId,
        licenseType: item.licenseType,
        downloadCount: 0,
        maxDownloads: 3,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        files: {
          mp3: beat.files.mp3,
          wav: beat.files.wav,
          stems: beat.files.stems,
          contract: contractUrl,
        },
      });

      await download.save();

      // Incrémenter le compteur de ventes du beat
      await Beat.findByIdAndUpdate(item.beatId, {
        $inc: { salesCount: 1 },
      });

      // Si licence exclusive, désactiver le beat
      if (item.licenseType === 'exclusive') {
        await Beat.findByIdAndUpdate(item.beatId, {
          isActive: false,
        });
      }
    }

    // Mettre à jour le premier contract dans Order (pour référence)
    if (contractUrls.length > 0) {
      order.licenseContract = contractUrls[0];
      await order.save();
    }

    // Ajouter la commande aux achats de l'utilisateur
    await User.findByIdAndUpdate(userId, {
      $push: { purchases: order._id },
    });

    // Envoyer l'email de confirmation
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    await sendOrderConfirmationEmail({
      email: order.deliveryEmail,
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      downloadUrl: `${appUrl}/account/downloads?order=${order._id}`,
    });

    console.log('Commande traitée avec succès:', order.orderNumber);

  } catch (error: any) {
    console.error('Erreur lors du traitement de la session:', error);
    throw error;
  }
}

/**
 * Gérer les remboursements
 */
async function handleRefund(charge: Stripe.Charge) {
  try {
    console.log('Traitement refund:', charge.id);

    await dbConnect();

    // Trouver la commande
    const order = await Order.findOne({ stripePaymentId: charge.payment_intent });

    if (!order) {
      console.error('Commande non trouvée pour le refund:', charge.payment_intent);
      return;
    }

    // Mettre à jour le statut
    order.status = 'refunded';
    await order.save();

    // Désactiver les téléchargements
    await Download.updateMany(
      { orderId: order._id },
      { $set: { expiresAt: new Date() } } // Expirer immédiatement
    );

    console.log('Refund traité:', order.orderNumber);

  } catch (error: any) {
    console.error('Erreur lors du traitement du refund:', error);
    throw error;
  }
}

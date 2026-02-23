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
    const isGuest = session.metadata?.isGuest === 'true';
    const guestEmail = session.metadata?.guestEmail;
    const locale = session.metadata?.locale || 'en';

    if (!itemsString) {
      throw new Error('Métadonnées items manquantes dans la session');
    }

    const items = JSON.parse(itemsString);

    // Variables utilisateur
    let user = null;
    let customerName = 'Guest User';
    let customerEmail = session.customer_email || '';

    // Mode utilisateur connecté
    if (!isGuest && userId) {
      user = await User.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      customerName = `${user.firstName} ${user.lastName}`;
      customerEmail = user.email;
    } else if (isGuest && guestEmail) {
      // Mode guest
      customerEmail = guestEmail;
    }

    // Générer un token de téléchargement unique pour les guests
    let downloadToken: string | undefined;
    let downloadExpiry: Date | undefined;
    
    if (isGuest) {
      const crypto = require('crypto');
      downloadToken = crypto.randomBytes(32).toString('hex');
      downloadExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours
    }

    // Créer la commande
    const order = new Order({
      userId: isGuest ? undefined : userId,
      items: items.map((item: any) => ({
        beatId: item.beatId,
        beatTitle: item.beatTitle,
        licenseType: item.licenseType,
        price: item.price,
      })),
      totalAmount: session.amount_total!, // Stripe retourne déjà en centimes
      stripePaymentId: session.payment_intent as string,
      stripeSessionId: session.id,
      status: 'completed',
      deliveryEmail: customerEmail,
      isGuestOrder: isGuest,
      guestEmail: isGuest ? guestEmail : undefined,
      downloadToken: isGuest ? downloadToken : undefined,
      downloadCount: 0,
      downloadExpiry: isGuest ? downloadExpiry : undefined,
    });

    await order.save();

    console.log('Commande créée:', order.orderNumber, isGuest ? '(Guest)' : '(User)');

    // Générer les PDFs de licence pour chaque beat
    const contractUrls: string[] = [];

    for (const item of items) {
      console.log(`[WEBHOOK] Traitement beat: ${item.beatId} - ${item.beatTitle}`);
      
      const beat = await Beat.findById(item.beatId);
      if (!beat) {
        console.error(`[WEBHOOK] Beat non trouvé: ${item.beatId}`);
        continue;
      }
      console.log(`[WEBHOOK] Beat trouvé: ${beat.title}`);

      // Générer le PDF
      console.log(`[WEBHOOK] Début génération PDF pour: ${item.beatTitle}`);
      const pdfBuffer = await generateLicenseContract({
        orderNumber: order.orderNumber,
        customerName,
        customerEmail,
        beatTitle: item.beatTitle,
        licenseType: item.licenseType,
        price: item.price,
        date: new Date(),
        locale,
      });
      console.log(`[WEBHOOK] PDF généré, taille: ${pdfBuffer.length} bytes`);

      // Upload sur Cloudinary
      console.log(`[WEBHOOK] Début upload Cloudinary pour: ${item.beatTitle}`);
      const contractUrl = await uploadToCloudinary(
        pdfBuffer,
        `contracts/${order.orderNumber}_${item.beatId}.pdf`,
        'raw'
      );
      console.log(`[WEBHOOK] Upload réussi: ${contractUrl}`);

      contractUrls.push(contractUrl);

      // Créer l'entrée Download (uniquement pour les utilisateurs connectés)
      if (!isGuest && user) {
        console.log(`[WEBHOOK] Création Download pour user: ${user._id}`);
        const download = new Download({
          orderId: order._id,
          userId: user._id,
          beatId: item.beatId,
          licenseType: item.licenseType,
          downloadCount: 0,
          // maxDownloads supprimé - téléchargements illimités
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
          files: {
            mp3: beat.files.mp3,
            wav: beat.files.wav,
            stems: beat.files.stems,
            contract: contractUrl,
          },
        });

        await download.save();
        console.log(`[WEBHOOK] Download créé avec succès: ${download._id}`);
      } else {
        console.log(`[WEBHOOK] Mode guest - pas de Download créé`);
      }

      // Incrémenter le compteur de ventes du beat
      console.log(`[WEBHOOK] Incrémentation salesCount pour beat: ${item.beatId}`);
      await Beat.findByIdAndUpdate(item.beatId, {
        $inc: { salesCount: 1 },
      });

      // Si licence exclusive, désactiver le beat
      if (item.licenseType === 'exclusive') {
        console.log(`[WEBHOOK] Désactivation beat exclusif: ${item.beatId}`);
        await Beat.findByIdAndUpdate(item.beatId, {
          isActive: false,
        });
      }
      
      console.log(`[WEBHOOK] Beat ${item.beatId} traité avec succès`);
    }

    // Mettre à jour le premier contract dans Order (pour référence)
    if (contractUrls.length > 0) {
      console.log(`[WEBHOOK] Mise à jour Order avec contract URL`);
      order.licenseContract = contractUrls[0];
      await order.save();
    }

    // Ajouter la commande aux achats de l'utilisateur (si connecté)
    if (!isGuest && userId) {
      console.log(`[WEBHOOK] Ajout Order aux purchases de l'utilisateur: ${userId}`);
      await User.findByIdAndUpdate(userId, {
        $push: { purchases: order._id },
      });
    }

    // Envoyer l'email de confirmation
    console.log(`[WEBHOOK] Préparation email de confirmation pour: ${order.deliveryEmail}`);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const downloadUrl = isGuest 
      ? `${appUrl}/downloads/guest/${downloadToken}`
      : `${appUrl}/account/downloads?order=${order._id}`;

    await sendOrderConfirmationEmail({
      email: order.deliveryEmail,
      orderNumber: order.orderNumber,
      items: order.items,
      totalAmount: order.totalAmount,
      downloadUrl,
      isGuest,
      locale,
    });
    
    console.log(`[WEBHOOK] Email envoyé avec succès`);

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

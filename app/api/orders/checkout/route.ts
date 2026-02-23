import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/services/stripe.service';
import { verifyToken } from '@/lib/utils/auth';
import dbConnect from '@/lib/db/mongodb';
import Beat, { IBeatDocument } from '@/models/Beat';

interface CheckoutItem {
  beatId: string;
  licenseType: string;
}

export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification (optionnelle pour guest checkout)
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    let decoded: any = null;
    let isGuest = false;
    let guestEmail = '';

    if (token) {
      // Mode utilisateur connecté
      decoded = verifyToken(token);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Token invalide' },
          { status: 401 }
        );
      }
    } else {
      // Mode guest
      isGuest = true;
    }

    // Récupérer les données du panier
    const body = await req.json();
    const { items, guestEmail: bodyGuestEmail } = body as { 
      items: CheckoutItem[];
      guestEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Si mode guest, valider l'email
    if (isGuest) {
      if (!bodyGuestEmail || !bodyGuestEmail.includes('@')) {
        return NextResponse.json(
          { error: 'Email invalide' },
          { status: 400 }
        );
      }
      guestEmail = bodyGuestEmail;
    }

    // Connexion DB
    await dbConnect();

    // Vérifier que tous les beats existent et récupérer les prix
    const checkoutItems = [];
    
    for (const item of items) {
      const beat = await Beat.findById(item.beatId) as IBeatDocument | null;
      
      if (!beat) {
        return NextResponse.json(
          { error: `Beat non trouvé: ${item.beatId}` },
          { status: 404 }
        );
      }

      const license = beat.licenses.find((l: any) => l.type === item.licenseType);
      
      if (!license || !license.available) {
        return NextResponse.json(
          { error: `Licence non disponible: ${item.licenseType}` },
          { status: 400 }
        );
      }

      checkoutItems.push({
        beatId: beat._id.toString(),
        beatTitle: beat.title,
        licenseType: item.licenseType,
        price: license.price,
      });
    }

    // Créer la session Stripe Checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const customerEmail = isGuest ? guestEmail : decoded.email;
    
    const session = await createCheckoutSession({
      items: checkoutItems,
      customerEmail,
      successUrl: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${appUrl}/cart`,
      metadata: {
        ...(decoded && { userId: decoded.userId }),
        isGuest: isGuest.toString(),
        ...(isGuest && { guestEmail }),
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error: any) {
    console.error('Erreur checkout:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création de la session' },
      { status: 500 }
    );
  }
}

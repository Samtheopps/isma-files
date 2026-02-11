import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY as string;

if (!STRIPE_SECRET_KEY) {
  throw new Error('Please define STRIPE_SECRET_KEY in .env.local');
}

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});

/**
 * Create Stripe Checkout Session
 */
export const createCheckoutSession = async ({
  items,
  customerEmail,
  successUrl,
  cancelUrl,
  metadata,
}: {
  items: {
    beatId: string;
    beatTitle: string;
    licenseType: string;
    price: number;
  }[];
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${item.beatTitle} - ${item.licenseType.toUpperCase()} License`,
          description: `Beat: ${item.beatTitle}`,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      metadata: {
        ...metadata,
        items: JSON.stringify(items),
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    throw new Error('Failed to create checkout session');
  }
};

/**
 * Verify Stripe webhook signature
 */
export const verifyWebhookSignature = (
  payload: string | Buffer,
  signature: string
): Stripe.Event => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET not defined');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw new Error('Invalid webhook signature');
  }
};

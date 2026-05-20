import Stripe from 'stripe';

// Singleton del cliente Stripe.
// La API version se fija al snapshot que tenemos seleccionado en el dashboard
// para que los tipos del SDK matcheen los payloads que recibimos por webhook.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-03-25.dahlia',
});

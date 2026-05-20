import Stripe from 'stripe';

// Singleton del cliente Stripe.
// La apiVersion se alinea al tipo del SDK instalado (stripe ^22.1.1 → 2026-04-22.dahlia).
// Stripe es backward-compatible: el webhook destination puede estar configurado en
// 2026-03-25.dahlia (la versión que tenía el dashboard al crearlo) y los campos básicos
// siguen siendo los mismos. Cuando Vic actualice la API version del destination en
// Stripe dashboard al mismo valor, no hace falta tocar este archivo.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2026-04-22.dahlia',
});

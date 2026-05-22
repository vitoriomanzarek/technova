import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

// HSTS lo añade Vercel automáticamente.
// CSP queda fuera por ahora — tenemos scripts de terceros (GTM, Meta Pixel,
// futuro Stripe.js) y un CSP mal calibrado los rompe sin warning. Cuando
// implementemos, hacerlo primero en Report-Only mode.
const securityHeaders = [
  // Bloquea iframes de otros orígenes que intenten cargar el sitio (clickjacking).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Prohíbe que el browser "adivine" el Content-Type (MIME sniffing).
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Solo manda el host como Referer cuando navegamos a otros orígenes.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Deshabilita explícitamente APIs del browser que no usamos.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // Defensa contra DNS rebinding y otros ataques cross-origin.
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

// withSentryConfig sube sourcemaps en build (stack traces legibles) y configura
// el tunnel para evitar ad-blockers. Solo sube sourcemaps si SENTRY_AUTH_TOKEN
// está presente — sin él (dev/CI sin token), el build sigue funcionando sin upload.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  // Sube sourcemaps solo si hay auth token (evita romper builds sin credenciales).
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Tunnel para que los ad-blockers no bloqueen el envío de eventos a Sentry.
  tunnelRoute: "/monitoring",
});

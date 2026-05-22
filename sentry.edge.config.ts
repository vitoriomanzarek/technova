import * as Sentry from '@sentry/nextjs';

// Init de Sentry para el runtime Edge (middleware, edge routes).
// Sin NEXT_PUBLIC_SENTRY_DSN configurado, Sentry queda inactivo.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? 'development',
  tracesSampleRate: 0.1,
  ignoreErrors: ['NEXT_NOT_FOUND', 'NEXT_REDIRECT'],
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

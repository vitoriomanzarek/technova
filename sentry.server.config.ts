import * as Sentry from '@sentry/nextjs';

// Init de Sentry para el runtime Node (Server Components + API routes).
// Sin NEXT_PUBLIC_SENTRY_DSN configurado, Sentry queda inactivo (no envía nada).
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV ?? 'development',
  // 10% de transacciones para performance tracing (ajustar si hace falta más detalle).
  tracesSampleRate: 0.1,
  // Errores esperados de Next.js que NO son bugs.
  ignoreErrors: ['NEXT_NOT_FOUND', 'NEXT_REDIRECT'],
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

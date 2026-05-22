import * as Sentry from '@sentry/nextjs';

// Init de Sentry en el browser. Next.js carga este archivo en el cliente.
// Sin NEXT_PUBLIC_SENTRY_DSN configurado, Sentry queda inactivo.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  tracesSampleRate: 0.1,
  // Replay opcional: graba sesiones donde hay error (0% normal, 100% en error).
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
  ignoreErrors: ['NEXT_NOT_FOUND', 'NEXT_REDIRECT'],
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
});

// Necesario para que Sentry instrumente las transiciones de navegación.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

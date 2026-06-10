import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? 'development',
  tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  enableLogs: true,
  integrations: [Sentry.replayIntegration()],
  ignoreErrors: ['NEXT_NOT_FOUND', 'NEXT_REDIRECT'],
});

// Necesario para que Sentry instrumente las transiciones de navegación.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

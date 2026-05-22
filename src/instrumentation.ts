import * as Sentry from '@sentry/nextjs';

// Next.js ejecuta register() una vez al arrancar cada runtime.
// Cargamos la config de Sentry según el runtime activo.
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

// Captura errores que ocurren en Server Components / route handlers.
export const onRequestError = Sentry.captureRequestError;

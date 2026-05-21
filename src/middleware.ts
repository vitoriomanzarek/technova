import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Rate limiting con Upstash Redis (Edge-compatible).
 *
 * Si UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN no están configuradas,
 * el middleware degrada graciosamente y deja pasar todas las requests. Esto
 * evita romper producción si las env vars de Upstash se borran por accidente
 * o si estamos corriendo localmente sin Upstash setup.
 *
 * Cuando se quiera forzar fallo en producción si Upstash no está configurado,
 * cambiar `FAIL_OPEN` a `false`.
 */

const FAIL_OPEN = true;

const hasUpstashConfig =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

// Singletons — Next.js reusa el módulo entre invocaciones en el mismo runtime instance.
const redis = hasUpstashConfig ? Redis.fromEnv() : null;

const leadsLimiter = redis
  ? new Ratelimit({
      redis,
      // 5 requests por IP por minuto. Suficiente para uso legítimo,
      // bloquea spam masivo.
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      prefix: 'rl:leads',
      analytics: true,
    })
  : null;

const checkoutLimiter = redis
  ? new Ratelimit({
      redis,
      // 3 requests por IP por minuto. Crear sesiones de Stripe es más caro
      // (cada sesión queda en Stripe dashboard como un objeto persistente).
      limiter: Ratelimit.slidingWindow(3, '1 m'),
      prefix: 'rl:checkout',
      analytics: true,
    })
  : null;

function getClientIp(request: NextRequest): string {
  // Vercel pone la IP real en x-forwarded-for; tomamos el primer valor.
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'anonymous';
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  let limiter: Ratelimit | null = null;
  if (path === '/api/leads') limiter = leadsLimiter;
  else if (path === '/api/checkout') limiter = checkoutLimiter;
  else return NextResponse.next(); // matcher de abajo debería evitar esto pero por si acaso.

  // Sin config de Upstash → dejar pasar (degrade gracefully).
  if (!limiter) {
    if (!FAIL_OPEN) {
      return NextResponse.json(
        { success: false, error: 'Rate limiter not configured' },
        { status: 503 }
      );
    }
    return NextResponse.next();
  }

  const ip = getClientIp(request);

  try {
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests',
          retry_after_seconds: retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
            'X-RateLimit-Limit': String(limit),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(reset),
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(remaining));
    response.headers.set('X-RateLimit-Reset', String(reset));
    return response;
  } catch (error) {
    // Si Upstash falla (network, etc.), no bloqueamos el endpoint legítimo.
    console.error('[rate-limit] Upstash error, failing open:', error);
    return NextResponse.next();
  }
}

// Matcher restringe el middleware a SOLO los endpoints rate-limited.
// Otros paths (pages, otros API routes) no pagan el overhead.
export const config = {
  matcher: ['/api/leads', '/api/checkout'],
};

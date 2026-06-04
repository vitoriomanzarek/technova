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

/**
 * Gate de los dashboards internos (/admin/*, /internal/*).
 *
 * El token se acepta de tres formas, en orden de prioridad:
 *   1. header `x-admin-token`  (para curl / scripts)
 *   2. cookie `admin_token`     (sesión de browser ya autenticada)
 *   3. query `?token=…`         (primer acceso desde browser → setea la cookie)
 *
 * Si `ADMIN_DASHBOARD_TOKEN` no está configurada, el gate bloquea todo (503)
 * en vez de dejar pasar — preferimos cerrar las páginas internas por defecto.
 */
const ADMIN_COOKIE = 'admin_token';
const CLIENT_TOKEN_COOKIE = 'client_access_token'; // mirrors src/lib/client-auth/constants.ts

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function handleAdminAuth(request: NextRequest): NextResponse {
  const expected = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!expected) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Dashboards internos deshabilitados: falta ADMIN_DASHBOARD_TOKEN.',
      },
      { status: 503 },
    );
  }

  const headerToken = request.headers.get('x-admin-token');
  const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const queryToken = request.nextUrl.searchParams.get('token');

  const supplied = headerToken ?? cookieToken ?? queryToken ?? '';

  if (!constantTimeEqual(supplied, expected)) {
    return new NextResponse('401 Unauthorized — token inválido o ausente.', {
      status: 401,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // Token válido vía query → persiste cookie y limpia la URL para no dejar el
  // secreto en el historial / barra de direcciones.
  if (queryToken && !headerToken && !cookieToken) {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete('token');
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(ADMIN_COOKIE, expected, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8h
    });
    return response;
  }

  return NextResponse.next();
}

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Gate de dashboards internos y APIs admin antes que cualquier otra cosa.
  if (path.startsWith('/admin') || path.startsWith('/internal') || path.startsWith('/api/admin')) {
    return handleAdminAuth(request);
  }

  // B.4.7 — Client dashboard: token via query param → set cookie → redirect
  if (path.startsWith('/cliente')) {
    const tokenFromQuery = request.nextUrl.searchParams.get('token');
    const tokenFromCookie = request.cookies.get(CLIENT_TOKEN_COOKIE)?.value;

    if (tokenFromQuery) {
      // Set cookie and redirect to clean URL
      const cleanUrl = request.nextUrl.clone();
      cleanUrl.searchParams.delete('token');
      const response = NextResponse.redirect(cleanUrl);
      response.cookies.set(CLIENT_TOKEN_COOKIE, tokenFromQuery, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 90, // 90 days
      });
      return response;
    }

    if (!tokenFromCookie) {
      return new NextResponse('Acceso no autorizado. Usa el link de tu email.', {
        status: 401,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }

    return NextResponse.next();
  }

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

// Matcher restringe el middleware a los endpoints rate-limited + dashboards
// internos. Otros paths (pages públicas, otros API routes) no pagan overhead.
export const config = {
  matcher: ['/api/leads', '/api/checkout', '/admin/:path*', '/internal/:path*', '/api/admin/:path*', '/cliente/:path*'],
};

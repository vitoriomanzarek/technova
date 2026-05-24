import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Los dashboards internos leen estos markdown de disco en runtime. Sin esto,
  // el file tracing de Vercel no los incluiría en el bundle serverless.
  outputFileTracingIncludes: {
    '/admin/project-status': ['./docs/BITACORA.md', './DECISION_LOG.md'],
    '/internal/architecture': ['./DECISION_LOG.md'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

// Sentry solo se activa cuando SENTRY_AUTH_TOKEN está presente.
// Sin él el build continúa normalmente.
async function buildConfig() {
  if (process.env.SENTRY_AUTH_TOKEN) {
    const { withSentryConfig } = await import('@sentry/nextjs');
    return withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      silent: !process.env.CI,
      sourcemaps: { disable: false },
      tunnelRoute: '/monitoring',
    });
  }
  return nextConfig;
}

export default buildConfig();

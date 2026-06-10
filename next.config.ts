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
    '/admin/project-status': ['./BITACORA.md', './DECISION_LOG.md'],
    '/internal/architecture': ['./DECISION_LOG.md'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

async function buildConfig() {
  const { withSentryConfig } = await import('@sentry/nextjs');
  return withSentryConfig(nextConfig, {
    org: 'technova-xg',
    project: 'technova',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    silent: !process.env.CI,
  });
}

export default buildConfig();

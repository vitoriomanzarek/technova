import { MetadataRoute } from 'next';

const BASE = 'https://tech-nova.mx';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Páginas principales
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                           lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/servicios`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/start-project`,        lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/pricing`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/nosotros`,             lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contacto`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/gracias`,              lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/privacidad`,           lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${BASE}/terminos`,             lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ];

  // Páginas de servicios individuales
  const servicePages: MetadataRoute.Sitemap = [
    'landing-page',
    'ecommerce',
    'lms',
    'web-app',
    'marketing',
    'data-analysis',
    'chatbot',
    'crm',
    'support',
  ].map(slug => ({
    url:             `${BASE}/services/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }));

  return [...staticPages, ...servicePages];
}

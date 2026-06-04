export interface ExtractedSiteData {
  url: string;
  loadTimeMs: number;
  isHttps: boolean;
  title: string | null;
  metaDescription: string | null;
  hasViewportMeta: boolean;
  hasCharset: boolean;
  hasDoctype: boolean;
  htmlLang: string | null;
  h1Count: number;
  h2Count: number;
  h3Count: number;
  formCount: number;
  imagesWithoutAlt: number;
  totalImages: number;
  hasGA4: boolean;
  hasMetaPixel: boolean;
  hasCookiePolicyLink: boolean;
  coreWebVitals: {
    lcp: number | null;
    fid: number | null;
    cls: number | null;
  };
  // Lighthouse scores (0–100) or null if unavailable
  lighthousePerformance: number | null;
  lighthouseAccessibility: number | null;
  lighthouseBestPractices: number | null;
  lighthouseSeo: number | null;
}

export const auditWebsitePrompt = (data: ExtractedSiteData) => `
Eres un experto en auditoría de sitios web para MIPyMEs mexicanas.

DATOS EXTRAÍDOS DEL SITIO:
${JSON.stringify(data, null, 2)}

INSTRUCCIONES:
Analiza los datos anteriores y devuelve EXCLUSIVAMENTE un objeto JSON válido con la siguiente estructura exacta. No incluyas explicaciones, markdown, ni bloques de código.

{
  "score": <number 0-100, ponderado por importancia>,
  "findings": [
    {
      "item": "<nombre del elemento auditado>",
      "status": "<verde|amarillo|rojo>",
      "score": <number 0-10>,
      "recomendacion": "<qué hacer para mejorar, en español>"
    }
  ],
  "summary": "<párrafo de 2-3 líneas en español sobre el estado general del sitio>",
  "priority_areas": [
    "<área más crítica>",
    "<área 2>",
    "<área 3>"
  ]
}

ITEMS A EVALUAR (exactamente 17, en este orden):
1.  Performance General (basado en loadTimeMs y lighthousePerformance)
2.  Lighthouse Accessibility Score
3.  Lighthouse Best Practices Score
4.  Lighthouse SEO Score
5.  Mobile Responsive (viewport meta tag)
6.  HTTPS / SSL
7.  Meta Title (presente y optimizado)
8.  Meta Description (presente y optimizado)
9.  H1 Tag (exactamente 1 presente)
10. Estructura de Encabezados (jerarquía H1-H3)
11. Alt Text en Imágenes (imagesWithoutAlt vs totalImages)
12. Core Web Vitals (LCP, FID, CLS si disponibles)
13. Google Analytics 4 Integrado
14. Meta Pixel (Facebook/Instagram) Integrado
15. Formularios / Llamadas a la Acción
16. Cookie / Política de Privacidad
17. Atributo lang en HTML (accesibilidad e internacionalización)

PONDERACIÓN PARA score FINAL (0-100):
- Performance: 25%
- SEO (Lighthouse SEO + meta tags + H1): 20%
- Accessibility (Lighthouse + lang + alt): 15%
- Mobile (viewport): 15%
- Security (HTTPS): 10%
- Analytics (GA4 + Pixel): 10%
- UX Signals (forms + cookie policy): 5%

Para cada item:
- verde: cumple correctamente
- amarillo: cumple parcialmente o hay oportunidad de mejora
- rojo: falta o tiene problemas graves

RESPONDE SOLO CON JSON VÁLIDO. SIN MARKDOWN. SIN EXPLICACIONES.
`.trim();

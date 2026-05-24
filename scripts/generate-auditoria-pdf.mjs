/**
 * Generador del lead magnet "Auditoría Web Express" (PDF estático).
 *
 * Documento de marca TechNova — estética espacial: cosmos oscuro, gradientes
 * cian → violeta, lenguaje de misión. Se ejecuta una sola vez y el PDF
 * resultante se commitea en public/assets/. NO es una dependencia de runtime.
 *
 *   node scripts/generate-auditoria-pdf.mjs
 *
 * Nota: las fuentes estándar de PDFKit (Helvetica) no renderizan emoji, así que
 * los íconos se dibujan como vectores. El acentuado español (WinAnsi) sí funciona.
 */
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'assets', 'auditoria-web-express.pdf');

// --- Paleta de marca -------------------------------------------------------
const COSMOS = '#0a0a14';
const PANEL = '#111827';
const CYAN = '#0ea5e9';
const VIOLET = '#7c3aed';
const VIOLET_LT = '#8b5cf6';
const WHITE = '#ffffff';
const SLATE_100 = '#e2e8f0';
const SLATE_300 = '#cbd5e1';
const SLATE_400 = '#94a3b8';
const SLATE_500 = '#64748b';
const LINE = '#1e293b';

const W = 612; // letter width
const H = 792; // letter height
const M = 56; // margin
const CONTENT_W = W - M * 2;

const FECHA = new Date().toLocaleDateString('es-MX', {
  year: 'numeric',
  month: 'long',
});

const doc = new PDFDocument({
  size: 'letter',
  margins: { top: M, bottom: M, left: M, right: M },
  bufferPages: true,
  info: {
    Title: 'Auditoría Web Express — TechNova',
    Author: 'TechNova',
    Subject: 'Diagnóstico orbital de tu presencia digital',
    Keywords: 'auditoría web, SEO, performance, conversión, México',
  },
});

doc.pipe(createWriteStream(OUT));

// --- Helpers ----------------------------------------------------------------

/** Fondo cosmos en toda la página. */
function paintBackground() {
  doc.save();
  doc.rect(0, 0, W, H).fill(COSMOS);
  // estrellas dispersas (determinísticas para que el build sea reproducible)
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 90; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const r = rnd() * 0.9 + 0.2;
    doc.circle(x, y, r).fill(rnd() > 0.7 ? CYAN : '#334155');
    doc.fillOpacity(1);
  }
  doc.restore();
}

/** Barra de gradiente cian → violeta (la "dirección del viaje"). */
function gradientBar(x, y, w, h, r = 0) {
  const grad = doc.linearGradient(x, y, x + w, y + h);
  grad.stop(0, CYAN).stop(1, VIOLET);
  doc.save();
  if (r > 0) doc.roundedRect(x, y, w, h, r).fill(grad);
  else doc.rect(x, y, w, h).fill(grad);
  doc.restore();
}

function newPage() {
  doc.addPage();
  paintBackground();
}

/** Pie de página con marca, repetido en páginas de contenido. */
function footer(pageLabel) {
  // Escribir dentro del margen inferior dispararía un salto de página automático
  // en PDFKit (y dejaría páginas en blanco). Lo anulamos mientras dibujamos.
  const prevBottom = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc.save();
  doc
    .moveTo(M, H - 64)
    .lineTo(W - M, H - 64)
    .lineWidth(0.5)
    .stroke(LINE);
  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(SLATE_500)
    .text('TechNova · Navegando el cosmos digital desde México', M, H - 54, {
      width: CONTENT_W / 2,
    });
  doc
    .fillColor(SLATE_500)
    .text('tech-nova.mx', M + CONTENT_W / 2, H - 54, {
      width: CONTENT_W / 2,
      align: 'right',
    });
  if (pageLabel) {
    doc
      .fillColor(SLATE_500)
      .text(pageLabel, M, H - 42, { width: CONTENT_W, align: 'center' });
  }
  doc.restore();
  doc.page.margins.bottom = prevBottom;
}

/** Encabezado de sección con número + título. */
function sectionHeader(num, title) {
  const y = doc.y;
  gradientBar(M, y, 4, 22, 2);
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(CYAN)
    .text(num, M + 14, y + 1);
  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor(WHITE)
    .text(title, M + 14, y + 12);
  doc.moveDown(0.8);
}

// =========================================================================
// PÁGINA 1 — PORTADA
// =========================================================================
paintBackground();

// halo central
doc.save();
const halo = doc.radialGradient(W / 2, 250, 0, W / 2, 250, 320);
halo.stop(0, VIOLET, 0.35).stop(1, COSMOS, 0);
doc.rect(0, 0, W, H).fill(halo);
doc.restore();

// kicker
gradientBar(M, 120, 46, 5, 2.5);
doc
  .font('Helvetica-Bold')
  .fontSize(11)
  .fillColor(CYAN)
  .text('CONTROL DE MISIÓN DIGITAL', M, 138, { characterSpacing: 2 });

// título
doc
  .font('Helvetica-Bold')
  .fontSize(46)
  .fillColor(WHITE)
  .text('Auditoría', M, 178);
doc.fillColor(CYAN).text('Web Express', M, 226);

// subtítulo
doc
  .font('Helvetica')
  .fontSize(15)
  .fillColor(SLATE_300)
  .text(
    'Diagnóstico orbital de tu presencia digital.\nDescubre qué le falta a tu nave para alcanzar velocidad de escape.',
    M,
    296,
    { width: CONTENT_W - 60, lineGap: 4 }
  );

// tarjeta de "qué incluye"
const cardY = 392;
doc.save();
doc
  .roundedRect(M, cardY, CONTENT_W, 188, 16)
  .fillOpacity(1)
  .fill(PANEL);
doc
  .roundedRect(M, cardY, CONTENT_W, 188, 16)
  .lineWidth(1)
  .stroke(LINE);
doc.restore();

doc
  .font('Helvetica-Bold')
  .fontSize(10)
  .fillColor(SLATE_400)
  .text('QUÉ EVALÚA ESTE DIAGNÓSTICO', M + 24, cardY + 22, {
    characterSpacing: 1,
  });

const coverItems = [
  ['Rendimiento', 'Velocidad de carga y Core Web Vitals'],
  ['SEO técnico', 'Visibilidad y posicionamiento en Google'],
  ['UX / UI', 'Experiencia móvil, accesibilidad y claridad'],
  ['Seguridad', 'HTTPS, headers y protección de datos'],
  ['Conversión', 'Formularios, analítica y seguimiento'],
  ['Email', 'Señales de entregabilidad'],
];
let cy = cardY + 50;
const colW = (CONTENT_W - 48) / 2;
coverItems.forEach((it, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = M + 24 + col * (colW + 0);
  const yy = cy + row * 44;
  doc.circle(x + 4, yy + 6, 3).fill(CYAN);
  doc
    .font('Helvetica-Bold')
    .fontSize(11)
    .fillColor(WHITE)
    .text(it[0], x + 16, yy);
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(SLATE_400)
    .text(it[1], x + 16, yy + 14, { width: colW - 20 });
});

// firma de portada
doc
  .font('Helvetica')
  .fontSize(10)
  .fillColor(SLATE_400)
  .text('Preparado por Sofía Torres · Navegante Digital · TechNova', M, 640);
doc
  .font('Helvetica')
  .fontSize(10)
  .fillColor(SLATE_500)
  .text(FECHA.charAt(0).toUpperCase() + FECHA.slice(1), M, 656);

doc
  .font('Helvetica-Bold')
  .fontSize(12)
  .fillColor(WHITE)
  .text('TechNova', M, 700);
doc
  .font('Helvetica')
  .fontSize(9)
  .fillColor(SLATE_500)
  .text('tech-nova.mx', M, 716);

// =========================================================================
// PÁGINA 2 — INTRO
// =========================================================================
newPage();
doc.y = 90;
doc
  .font('Helvetica-Bold')
  .fontSize(26)
  .fillColor(WHITE)
  .text('¿Tu web está lista para escalar?', M, 90, { width: CONTENT_W });

doc.moveDown(0.8);
doc
  .font('Helvetica')
  .fontSize(12)
  .fillColor(SLATE_300)
  .text(
    'El 95% de las empresas no sabe si su sitio web realmente está funcionando. Cargan lento, no aparecen en Google, pierden visitantes en el móvil — y nunca se enteran de cuánto les cuesta.',
    { width: CONTENT_W, lineGap: 5 }
  );
doc.moveDown(0.6);
doc
  .font('Helvetica')
  .fontSize(12)
  .fillColor(SLATE_300)
  .text(
    'Esta auditoría es tu escaneo orbital: una revisión honesta de los sistemas que mantienen tu nave en vuelo. Marca cada punto que tu sitio cumple. Al final sabrás exactamente dónde estás y qué corregir primero.',
    { width: CONTENT_W, lineGap: 5 }
  );

// cómo usarla
doc.moveDown(1.4);
const howY = doc.y;
doc.save();
doc.roundedRect(M, howY, CONTENT_W, 120, 14).fill(PANEL);
doc.roundedRect(M, howY, CONTENT_W, 120, 14).lineWidth(1).stroke(LINE);
doc.restore();
doc
  .font('Helvetica-Bold')
  .fontSize(11)
  .fillColor(CYAN)
  .text('CÓMO USAR ESTA AUDITORÍA', M + 22, howY + 18, { characterSpacing: 1 });

const steps = [
  'Recorre los 17 puntos de control de las 6 secciones.',
  'Marca la casilla de cada punto que tu sitio cumple hoy.',
  'Suma tus marcas y ubica tu nave en la tabla de altitud final.',
];
let sy = howY + 42;
steps.forEach((s, i) => {
  doc.circle(M + 30, sy + 6, 9).fill(CYAN);
  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fillColor(COSMOS)
    .text(String(i + 1), M + 26, sy + 1);
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor(SLATE_100)
    .text(s, M + 50, sy, { width: CONTENT_W - 80 });
  sy += 26;
});

footer('Auditoría Web Express · TechNova');

// =========================================================================
// CHECKLIST — secciones
// =========================================================================
const sections = [
  {
    num: '01',
    title: 'Rendimiento',
    sub: 'Velocidad = altitud. Un sitio lento pierde tripulación antes de despegar.',
    items: [
      'Tu sitio carga en menos de 3 segundos en una conexión móvil promedio.',
      'Tus puntajes de Core Web Vitals (LCP, CLS, INP) están en verde en PageSpeed Insights.',
      'Las imágenes están optimizadas (formatos modernos como WebP y carga diferida).',
    ],
  },
  {
    num: '02',
    title: 'SEO técnico',
    sub: 'Si Google no te encuentra, tu nave es invisible en el cosmos.',
    items: [
      'Cada página tiene un title y meta description únicos y descriptivos.',
      'Tienes un sitemap.xml enviado a Google Search Console.',
      'Tu robots.txt permite el rastreo y no bloquea páginas clave por error.',
    ],
  },
  {
    num: '03',
    title: 'UX / UI',
    sub: 'La experiencia decide si tu visitante navega contigo o abandona la misión.',
    items: [
      'El sitio se ve y funciona perfecto en móvil (responsive real, no solo "se ajusta").',
      'El contraste de color y los textos cumplen criterios básicos de accesibilidad.',
      'Tu llamada a la acción principal (CTA) es clara y visible sin hacer scroll.',
    ],
  },
  {
    num: '04',
    title: 'Seguridad',
    sub: 'Una nave sin escudos no llega lejos. La confianza empieza por la seguridad.',
    items: [
      'Todo el sitio corre sobre HTTPS con un certificado válido y sin advertencias.',
      'Tienes cabeceras de seguridad básicas (HSTS, X-Content-Type-Options, CSP).',
      'No hay configuraciones CORS abiertas ni datos sensibles expuestos en el cliente.',
    ],
  },
  {
    num: '05',
    title: 'Conversión',
    sub: 'De nada sirve el tráfico si no se convierte en tripulación a bordo.',
    items: [
      'Tus formularios funcionan, validan datos y confirman el envío al usuario.',
      'Tienes analítica instalada (GA4 / GTM) y mides los eventos importantes.',
      'Existe seguimiento de conversiones para saber qué canal trae clientes reales.',
    ],
  },
  {
    num: '06',
    title: 'Email y entregabilidad',
    sub: 'Tus correos deben llegar a la bandeja, no al espacio profundo del spam.',
    items: [
      'Tu dominio tiene registros SPF, DKIM y DMARC configurados correctamente.',
      'Los correos transaccionales salen desde un dominio verificado y profesional.',
    ],
  },
];

let globalIdx = 0;

function drawChecklistItem(text) {
  globalIdx++;
  const startY = doc.y;
  // medir alto del texto
  const textH = doc.heightOfString(text, {
    width: CONTENT_W - 84,
    fontSize: 11,
  });
  const rowH = Math.max(textH, 18) + 14;

  // salto de página si no cabe
  if (startY + rowH > H - 80) {
    footer('Auditoría Web Express · TechNova');
    newPage();
    doc.y = 80;
  }
  const y = doc.y;
  // tarjeta sutil
  doc.save();
  doc.roundedRect(M, y - 4, CONTENT_W, rowH, 8).fill(PANEL);
  doc.restore();
  // checkbox
  doc
    .roundedRect(M + 16, y + 2, 16, 16, 3)
    .lineWidth(1.5)
    .stroke(CYAN);
  // número
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(SLATE_500)
    .text(String(globalIdx).padStart(2, '0'), M + 40, y + 4);
  // texto
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor(SLATE_100)
    .text(text, M + 62, y + 2, { width: CONTENT_W - 84, lineGap: 2 });
  doc.y = y + rowH + 6;
}

sections.forEach((sec) => {
  // cada sección empieza en página nueva si queda poco espacio
  if (doc.y > H - 220 || sec.num === '01') {
    newPage();
    doc.y = 80;
  }
  sectionHeader(sec.num, sec.title);
  doc
    .font('Helvetica-Oblique')
    .fontSize(10.5)
    .fillColor(SLATE_400)
    .text(sec.sub, M + 14, doc.y, { width: CONTENT_W - 14, lineGap: 2 });
  doc.moveDown(0.8);
  sec.items.forEach((it) => drawChecklistItem(it));
  doc.moveDown(0.4);
});

footer('Auditoría Web Express · TechNova');

// =========================================================================
// SCORING — tabla de altitud
// =========================================================================
newPage();
doc.y = 90;
doc
  .font('Helvetica-Bold')
  .fontSize(26)
  .fillColor(WHITE)
  .text('Tu altitud actual', M, 90);
doc
  .font('Helvetica')
  .fontSize(12)
  .fillColor(SLATE_300)
  .text(
    'Cuenta cuántas de las 17 casillas marcaste y ubica tu nave. No hay puntajes "malos" — solo coordenadas desde donde empezar el viaje.',
    M,
    doc.y + 8,
    { width: CONTENT_W, lineGap: 4 }
  );

const tiers = [
  {
    range: '0 – 6',
    title: 'En plataforma de lanzamiento',
    desc: 'Tu nave todavía no despega. Hay riesgos que están costándote clientes hoy mismo — pero también el mayor margen de mejora. Es urgente, y es totalmente recuperable.',
    color: '#f43f5e',
  },
  {
    range: '7 – 11',
    title: 'Órbita baja',
    desc: 'Ya estás en el aire, pero girando bajo. Tienes bases sólidas y huecos claros. Unas pocas correcciones bien dirigidas pueden cambiar tu trayectoria por completo.',
    color: '#f59e0b',
  },
  {
    range: '12 – 15',
    title: 'En órbita estable',
    desc: 'Buen vuelo. Tu sitio cumple lo esencial y compite bien. Ahora se trata de afinar detalles para ganar altitud sobre la competencia.',
    color: CYAN,
  },
  {
    range: '16 – 17',
    title: 'Velocidad de escape',
    desc: 'Excelente. Tu nave está optimizada y lista para escalar. El siguiente paso es estrategia de crecimiento, no reparaciones.',
    color: '#10b981',
  },
];

let ty = doc.y + 24;
tiers.forEach((t) => {
  const rowH = 78;
  doc.save();
  doc.roundedRect(M, ty, CONTENT_W, rowH, 12).fill(PANEL);
  doc.roundedRect(M, ty, CONTENT_W, rowH, 12).lineWidth(1).stroke(LINE);
  doc.restore();
  // chip de rango
  doc.roundedRect(M + 18, ty + 18, 78, 42, 8).fill(t.color);
  doc.fillOpacity(1);
  doc
    .font('Helvetica-Bold')
    .fontSize(8)
    .fillColor(COSMOS)
    .text('PUNTOS', M + 18, ty + 24, { width: 78, align: 'center' });
  doc
    .font('Helvetica-Bold')
    .fontSize(15)
    .fillColor(COSMOS)
    .text(t.range, M + 18, ty + 36, { width: 78, align: 'center' });
  // título + desc
  doc
    .font('Helvetica-Bold')
    .fontSize(14)
    .fillColor(WHITE)
    .text(t.title, M + 112, ty + 16);
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(SLATE_400)
    .text(t.desc, M + 112, ty + 34, { width: CONTENT_W - 130, lineGap: 2 });
  ty += rowH + 12;
});

footer('Auditoría Web Express · TechNova');

// =========================================================================
// CTA FINAL
// =========================================================================
newPage();

// halo
doc.save();
const halo2 = doc.radialGradient(W / 2, 320, 0, W / 2, 320, 340);
halo2.stop(0, CYAN, 0.25).stop(1, COSMOS, 0);
doc.rect(0, 0, W, H).fill(halo2);
doc.restore();

doc
  .font('Helvetica-Bold')
  .fontSize(12)
  .fillColor(CYAN)
  .text('SIGUIENTE PASO DE LA MISIÓN', M, 150, {
    width: CONTENT_W,
    align: 'center',
    characterSpacing: 1.5,
  });

doc
  .font('Helvetica-Bold')
  .fontSize(28)
  .fillColor(WHITE)
  .text('Obtén una auditoría\npersonalizada de tu sitio', M, 180, {
    width: CONTENT_W,
    align: 'center',
    lineGap: 2,
  });

doc
  .font('Helvetica')
  .fontSize(13)
  .fillColor(SLATE_300)
  .text(
    'Esta checklist te da el mapa. Para las coordenadas exactas, deja que Sofía escanee tu sitio: en 24–48 horas recibes un diagnóstico orbital con las 3 correcciones más urgentes y un plan de acción claro.',
    M + 30,
    266,
    { width: CONTENT_W - 60, align: 'center', lineGap: 5 }
  );

// botón CTA
const btnW = 280;
const btnX = (W - btnW) / 2;
const btnY = 372;
gradientBar(btnX, btnY, btnW, 52, 14);
doc
  .font('Helvetica-Bold')
  .fontSize(14)
  .fillColor(WHITE)
  .text('Quiero mi diagnóstico gratuito', btnX, btnY + 18, {
    width: btnW,
    align: 'center',
  });
doc.link(btnX, btnY, btnW, 52, 'https://tech-nova.mx/#contacto');

doc
  .font('Helvetica')
  .fontSize(11)
  .fillColor(SLATE_400)
  .text('tech-nova.mx/start-project', M, btnY + 70, {
    width: CONTENT_W,
    align: 'center',
  });

// firma Sofía
const sigY = 500;
doc.save();
doc.circle(W / 2, sigY + 20, 24).fill(PANEL);
doc.circle(W / 2, sigY + 20, 24).lineWidth(1).stroke(CYAN);
doc.restore();
doc
  .font('Helvetica-Bold')
  .fontSize(16)
  .fillColor(CYAN)
  .text('ST', W / 2 - 24, sigY + 12, { width: 48, align: 'center' });
doc
  .font('Helvetica-Bold')
  .fontSize(13)
  .fillColor(WHITE)
  .text('Sofía Torres', M, sigY + 56, { width: CONTENT_W, align: 'center' });
doc
  .font('Helvetica')
  .fontSize(10)
  .fillColor(SLATE_400)
  .text('Navegante Digital · sofia@tech-nova.mx', M, sigY + 74, {
    width: CONTENT_W,
    align: 'center',
  });

// redes / footer final
doc
  .font('Helvetica')
  .fontSize(10)
  .fillColor(SLATE_500)
  .text('tech-nova.mx   ·   WhatsApp +52 722 166 9672', M, H - 130, {
    width: CONTENT_W,
    align: 'center',
  });
doc
  .font('Helvetica')
  .fontSize(8)
  .fillColor(SLATE_500)
  .text(
    `© ${new Date().getFullYear()} TechNova. Navegando el cosmos digital desde México.`,
    M,
    H - 110,
    { width: CONTENT_W, align: 'center' }
  );

doc.end();

doc.on('end', () => {});
console.log('Generando PDF en', OUT);

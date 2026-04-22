import fs from 'fs';
import path from 'path';

const map = {
  'Home.tsx': 'page.tsx',
  'Nosotros.tsx': 'nosotros/page.tsx',
  'Contacto.tsx': 'contacto/page.tsx',
  'Services.tsx': 'servicios/page.tsx',
  'Pricing.tsx': 'pricing/page.tsx',
  'Terms.tsx': 'terminos/page.tsx',
  'Privacy.tsx': 'privacidad/page.tsx',
  'StartProject.tsx': 'start-project/page.tsx',
};

const pagesDir = path.join('src', 'pages');
const appDir = path.join('src', 'app');

// Move direct files
for (const [oldName, newPath] of Object.entries(map)) {
  const source = path.join(pagesDir, oldName);
  const dest = path.join(appDir, newPath);
  if (fs.existsSync(source)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    // Import path fixes
    let content = fs.readFileSync(source, 'utf8');
    // Change '../components' to '@/components' since we moved it
    content = content.replace(/\.\.\/components/g, '@/components');
    content = content.replace(/\.\.\/\.\.\/components/g, '@/components');
    fs.writeFileSync(dest, content, 'utf8');
  }
}

// Move services
const servicesDir = path.join(pagesDir, 'services');
if (fs.existsSync(servicesDir)) {
  fs.readdirSync(servicesDir).forEach(f => {
    if (f.endsWith('.tsx')) {
      const slug = f.replace('.tsx', '').toLowerCase();
      const routeMap = {
        'LandingPage.tsx': 'landing-page',
        'Ecommerce.tsx': 'ecommerce',
        'LMS.tsx': 'lms',
        'WebApp.tsx': 'web-app',
        'Marketing.tsx': 'marketing',
        'DataAnalysis.tsx': 'data-analysis',
        'Support.tsx': 'support',
        'CRM.tsx': 'crm',
        'Chatbot.tsx': 'chatbot'
      };
      const rslug = routeMap[f] || slug;
      const dest = path.join(appDir, 'services', rslug, 'page.tsx');
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      let content = fs.readFileSync(path.join(servicesDir, f), 'utf8');
      content = content.replace(/\.\.\/\.\.\/components/g, '@/components');
      content = content.replace(/\.\.\/components/g, '@/components');
      fs.writeFileSync(dest, content, 'utf8');
    }
  });
}
console.log("Routes created.");

import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // React router dom replacements
    content = content.replace(/import\s*\{\s*Link(.*?)\}\s*from\s*['"]react-router-dom['"]/g, "import Link from 'next/link'");
    content = content.replace(/import\s*\{\s*useNavigate\s*\}\s*from\s*['"]react-router-dom['"]/g, "import { useRouter } from 'next/navigation'");
    content = content.replace(/useNavigate\(\)/g, "useRouter()");
    content = content.replace(/import\s*\{\s*useLocation\s*\}\s*from\s*['"]react-router-dom['"]/g, "import { usePathname } from 'next/navigation'");
    content = content.replace(/useLocation\(\)/g, "({ pathname: usePathname() })"); // Since useLocation returns { pathname, ... }
    content = content.replace(/import\s*\{\s*Outlet\s*,\s*Link\s*\}\s*from\s*['"]react-router-dom['"]/g, "import Link from 'next/link';");

    // Replace <Outlet /> with {children} in Layout components manually later, but let's try a quick hack
    if (filePath.includes('Layout.tsx') || filePath.includes('AdLandingLayout.tsx') || filePath.includes('ServiceLayout.tsx')) {
        content = content.replace(/<Outlet\s*\/>/g, "{children}");
        if (!content.includes('{children}')) {
             // Just in case it was differently formatted
        }
    }

    // Use client directive
    if (filePath.endsWith('.tsx') && !content.startsWith('"use client"') && !content.startsWith("'use client'")) {
        content = '"use client";\n' + content;
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

['src/components', 'src/pages', 'src/hooks'].forEach(dir => {
    if (fs.existsSync(dir)) walk(dir, processFile);
});
console.log("Migration script complete.");

import { useState, useEffect } from 'react';
import { COMPONENTS, CatalogComponent } from '../data/catalog';
import type { WizardState } from '../data/inventory';

// ─────────────────────────────────────────────
// MAPA DE COMPONENTES POR TIPO DE PROYECTO
// Cada proyecto arranca con un set de componentes base.
// Los precios son en MXN (catálogo v1.1).
// ─────────────────────────────────────────────

const BASE_COMPONENTS: Record<WizardState['answers']['projectType'], string[]> = {
    landing: [
        // Estructura base
        'DV-01', 'DV-02', 'DV-03', 'DV-04', 'DV-05', 'DV-07', 'DV-08', 'DV-13', 'DV-14',
        // Infraestructura
        'IT-02', 'IT-03', 'IT-04',
        // Analíticos base
        'AN-01', 'AN-02', 'AN-03',
        // SEO base
        'SE-01', 'SE-02', 'SE-03', 'SE-06',
        // Entrega
        'PM-02', 'PM-03', 'PM-04',
    ],
    ecommerce: [
        // Estructura
        'DV-01', 'DV-02', 'DV-03', 'DV-04', 'DV-11', 'DV-13', 'DV-14',
        // Tienda
        'EC-01', 'EC-02', 'EC-03', 'EC-04', 'EC-05',
        // Usuarios y admin
        'EC-06', 'EC-07', 'EC-08',
        // Sistemas
        'SY-01', 'SY-04', 'SY-06',
        // Infraestructura
        'IT-02', 'IT-03', 'IT-04',
        // Analíticos
        'AN-01', 'AN-02', 'AN-03',
        // SEO
        'SE-01', 'SE-02', 'SE-03', 'SE-06',
        // Entrega
        'PM-02', 'PM-03', 'PM-04',
    ],
    lms: [
        // Estructura
        'DV-01', 'DV-02', 'DV-03', 'DV-04', 'DV-13', 'DV-14',
        // Cursos y usuarios
        'SY-01', 'SY-02', 'SY-04', 'SY-05', 'SY-06',
        // Pagos para cursos
        'EC-05', 'EC-06',
        // Infraestructura
        'IT-02', 'IT-03', 'IT-04',
        // Analíticos
        'AN-01', 'AN-02', 'AN-03',
        // SEO
        'SE-01', 'SE-02', 'SE-03', 'SE-06',
        // Entrega
        'PM-02', 'PM-03', 'PM-04',
    ],
    webapp: [
        // Estructura mínima
        'DV-01', 'DV-02', 'DV-03', 'DV-14',
        // Sistemas core
        'SY-01', 'SY-03', 'SY-04', 'SY-05', 'SY-06',
        // Infraestructura
        'IT-02', 'IT-03', 'IT-04',
        // Analíticos
        'AN-01', 'AN-02',
        // SEO básico
        'SE-01',
        // Entrega
        'PM-02', 'PM-03', 'PM-04',
    ],
};

// ─────────────────────────────────────────────
// COMPONENTES POR ESTADO DE MARCA
// ─────────────────────────────────────────────

const BRAND_COMPONENTS: Record<WizardState['answers']['brandStatus'], string[]> = {
    complete: [],  // Cliente ya tiene su identidad lista
    basic: [       // Solo tiene logo básico → completar identidad
        'VI-01', 'VI-02', 'VI-03', 'VI-07',
    ],
    none: [        // Identidad desde cero
        'VI-01', 'VI-02', 'VI-03', 'VI-04', 'VI-05', 'VI-06', 'VI-07',
    ],
};

// ─────────────────────────────────────────────
// COMPONENTES POR FEATURES SELECCIONADAS
// ─────────────────────────────────────────────

const FEATURE_COMPONENTS: Record<string, string[]> = {
    seo:          ['SE-04', 'SE-05'],   // SEO avanzado (sobre el base)
    analytics:    ['AN-04'],            // Heatmaps (sobre el analytics base)
    chatbot:      ['SY-07'],            // Chatbot IA
    multilanguage: ['SY-08'],           // Multi-idioma
};

// ─────────────────────────────────────────────
// ESTADO INICIAL
// ─────────────────────────────────────────────

const INITIAL_STATE: WizardState = {
    step: 0,
    answers: {
        segment: 'orbita',
        selectedPackage: '',
        projectType: 'landing',
        brandStatus: 'complete',
        domainStatus: 'owned_ok',
        features: [],
        deadline: 'normal',
        budgetRange: 'seed',
        name: '',
        email: '',
        company: '',
        whatsapp: '',
        hostingType: 'none',
        securityLevel: 'standard',
        designStyle: '',
        references: '',
        sitemap: [],
        seoStatus: 'has_keywords',
        analytics: [],
        contactPreference: 'form',
    },
    recommendations: [],
    totalCost: 0,
    totalHours: 0,
    generatedPlan: {
        diagnosis: '',
        techStack: [],
        team: [],
        roadmap: [],
    },
};

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export const useProjectCalculator = () => {
    const [state, setState] = useState<WizardState>(INITIAL_STATE);

    const setAnswer = (category: keyof WizardState['answers'], value: any) => {
        setState(prev => ({
            ...prev,
            answers: { ...prev.answers, [category]: value },
        }));
    };

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
    const startWizard = () => setState(prev => ({ ...prev, step: 1 }));

    // ── MOTOR DE CÁLCULO ──────────────────────
    useEffect(() => {
        const { projectType, brandStatus, domainStatus, features } = state.answers;

        // Usamos un Set para evitar componentes duplicados
        const componentIds = new Set<string>();

        // 1. Base según tipo de proyecto
        (BASE_COMPONENTS[projectType] ?? BASE_COMPONENTS.landing)
            .forEach(id => componentIds.add(id));

        // 2. Identidad visual según estado de marca
        BRAND_COMPONENTS[brandStatus]
            .forEach(id => componentIds.add(id));

        // 3. Dominio: si no tiene o está perdido, agregar configuración
        if (domainStatus !== 'owned_ok') {
            componentIds.add('IT-01');
        }

        // 4. Features opcionales
        features.forEach(feature => {
            (FEATURE_COMPONENTS[feature] ?? []).forEach(id => componentIds.add(id));
        });

        // 5. Resolver componentes del catálogo
        const items: CatalogComponent[] = [...componentIds]
            .map(id => COMPONENTS.find(c => c.id === id))
            .filter((c): c is CatalogComponent => c !== undefined && c.cost > 0);

        // 6. Totales técnicos
        const technicalCost = items.reduce((sum, c) => sum + c.cost, 0);
        const technicalHours = items.reduce((sum, c) => sum + c.hours, 0);

        // 7. PM: 20% del costo técnico
        const pmCost = Math.round(technicalCost * 0.20);
        const pmHours = Math.round(technicalHours * 0.20);

        // 8. Plan generado
        const diagnosis = `Solución tipo ${projectType.toUpperCase()} con ${
            brandStatus === 'complete' ? 'identidad existente' :
            brandStatus === 'basic'    ? 'identidad a complementar' :
                                         'identidad desde cero'
        }.`;

        const techStack: string[] = ['Next.js + React', 'Tailwind CSS', 'Neon PostgreSQL', 'Vercel'];
        if (projectType === 'ecommerce' || projectType === 'lms') techStack.push('Stripe');
        if (features.includes('chatbot')) techStack.push('OpenAI API');
        if (features.includes('multilanguage')) techStack.push('next-intl');
        if (projectType === 'lms') techStack.push('Drizzle ORM + CMS');

        const roadmap = [
            'Fase 1: Kickoff y configuración de infraestructura',
            'Fase 2: Identidad visual y sistema de diseño',
            'Fase 3: Desarrollo de componentes y funcionalidades',
            'Fase 4: Integraciones (pagos, analíticos, marketing)',
            'Fase 5: QA, optimización y lanzamiento',
        ];

        setState(prev => ({
            ...prev,
            recommendations: items,
            totalCost: technicalCost + pmCost,
            totalHours: technicalHours + pmHours,
            generatedPlan: {
                diagnosis,
                techStack,
                team: ['Project Manager', 'Developer', 'Designer'],
                roadmap,
            },
        }));

    }, [state.answers]);

    return { state, setAnswer, nextStep, prevStep, startWizard };
};

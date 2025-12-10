export type InventoryCategory = 'IT' | 'DS' | 'DV' | 'MK' | 'PM';

export interface InventoryItem {
    id: string;
    category: InventoryCategory;
    name: string;
    description?: string;
    roles: string[];
    effortHours: number;
    cost: number;
    trigger?: string;
    inputRequired?: string;
}

export const INVENTORY: InventoryItem[] = [
    // CATEGORÍA 1: Infraestructura y Cimientos (IT)
    {
        id: 'IT-01',
        category: 'IT',
        name: 'Dominio & DNS Setup',
        roles: ['Soporte Técnico'],
        effortHours: 2,
        cost: 70,
        trigger: 'No tengo dominio / No sé configurar'
    },
    {
        id: 'IT-02',
        category: 'IT',
        name: 'Hosting / Cloud Server Setup',
        roles: ['Web Developer'],
        effortHours: 3,
        cost: 150,
        trigger: 'Default'
    },

    // CATEGORÍA 2: Identidad y Diseño (DS)
    {
        id: 'DS-01',
        category: 'DS',
        name: 'Identidad Visual Básica',
        roles: ['UX/UI Designer'],
        effortHours: 15,
        cost: 675,
        trigger: 'No tengo logo / Renovar imagen'
    },
    {
        id: 'DS-02',
        category: 'DS',
        name: 'UI/UX & Design System',
        roles: ['UX/UI Designer'],
        effortHours: 20, // Base effort, can be scaled
        cost: 900,
        trigger: 'Proyectos Custom'
    },

    // CATEGORÍA 3: Desarrollo Web (DV)
    {
        id: 'DV-01',
        category: 'DV',
        name: 'Landing Page',
        roles: ['Web Developer'],
        effortHours: 15,
        cost: 750,
        trigger: 'Captación de leads'
    },
    {
        id: 'DV-02',
        category: 'DV',
        name: 'Módulo eCommerce',
        roles: ['Web Developer'],
        effortHours: 40,
        cost: 2000,
        trigger: 'Vender productos'
    },
    {
        id: 'DV-03',
        category: 'DV',
        name: 'Módulo LMS',
        roles: ['Web Developer', 'Project Manager'],
        effortHours: 60,
        cost: 3050,
        trigger: 'Vender cursos'
    },
    {
        id: 'DV-04',
        category: 'DV',
        name: 'Página Adicional',
        roles: ['Web Developer'],
        effortHours: 4,
        cost: 200,
        trigger: 'Blog, Portafolio, etc'
    },

    // CATEGORÍA 4: Marketing Intelligence (MK)
    {
        id: 'MK-01',
        category: 'MK',
        name: 'Setup Analítica (Base)',
        roles: ['Analista de Datos'],
        effortHours: 5,
        cost: 225,
        trigger: 'Default'
    },
    {
        id: 'MK-02',
        category: 'MK',
        name: 'SEO On-Page Inicial',
        roles: ['Especialista en SEO'],
        effortHours: 10,
        cost: 400,
        trigger: 'Default'
    },
    {
        id: 'MK-03',
        category: 'MK',
        name: 'Integración Chatbot AI',
        roles: ['Web Developer'],
        effortHours: 8,
        cost: 400,
        trigger: 'Atención 24/7'
    },

    // CATEGORÍA 3: Features & Sitemap (Extension)
    {
        id: 'DV-05',
        category: 'DV',
        name: 'Integración Pasarela de Pagos',
        roles: ['Web Developer'],
        effortHours: 8,
        cost: 350,
        trigger: 'Pagos Online'
    },
    {
        id: 'DV-06',
        category: 'DV',
        name: 'Sistema de Reservas',
        roles: ['Web Developer'],
        effortHours: 12,
        cost: 500,
        trigger: 'Agendar Citas'
    },
    {
        id: 'DV-07',
        category: 'DV',
        name: 'Multi-idioma',
        roles: ['Web Developer'],
        effortHours: 10,
        cost: 450,
        trigger: 'Idiomas múltiples'
    },
    {
        id: 'DV-08',
        category: 'DV',
        name: 'Integración CRM Externa',
        roles: ['Web Developer'],
        effortHours: 6,
        cost: 300,
        trigger: 'HubSpot/Salesforce'
    },

    // CATEGORÍA 5: Gestión (PM)
    {
        id: 'PM-01',
        category: 'PM',
        name: 'Project Management',
        roles: ['Project Manager'],
        effortHours: 0, // Calculated dynamically
        cost: 0, // Calculated dynamically (20% of total)
        trigger: 'Default'
    }
];

export interface WizardState {
    step: number;
    answers: {
        // Dimensión 1: Misión (Tipo)
        projectType: 'landing' | 'ecommerce' | 'lms' | 'webapp';

        // Dimensión 2: Identidad (Brand)
        brandStatus: 'complete' | 'basic' | 'none';

        // Dimensión 3: Infraestructura (Dominio)
        domainStatus: 'owned_ok' | 'owned_lost' | 'none';

        // Dimensión 4: Marketing & Features
        features: string[]; // seo, analytics, chatbot, etc.

        // Dimensión 5: Coordenadas
        deadline: 'urgent' | 'normal' | 'long';
        budgetRange: 'seed' | 'takeoff' | 'expansion';

        // Dimensión 6: Lead Data
        name: string;
        company: string;
        email: string;
        whatsapp: string;

        // Optional / Legacy fields (kept for type safety if referenced elsewhere temporarily)
        hostingType?: any;
        securityLevel?: any;
        designStyle?: any;
        references?: any;
        sitemap?: any;
        seoStatus?: any;
        analytics?: any;
        contactPreference?: any;
    };
    recommendations: InventoryItem[];
    totalCost: number;
    totalHours: number;
    generatedPlan: {
        diagnosis: string;
        techStack: string[];
        team: string[];
        roadmap: string[];
    };
}

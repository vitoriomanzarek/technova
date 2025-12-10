import { useState, useEffect } from 'react';
import { INVENTORY } from '../data/inventory';
import type { WizardState, InventoryItem } from '../data/inventory';

// NOVA AI FLOW STATE
const INITIAL_STATE: WizardState = {
    step: 0, // 0 = Welcome Screen
    answers: {
        // 1. Mission
        projectType: 'landing',

        // 2. Identity
        brandStatus: 'complete',

        // 3. Infrastructure
        domainStatus: 'owned_ok',

        // 4. Marketing (Checklist)
        features: [],

        // 5. Coordinates
        deadline: 'normal',
        budgetRange: 'seed', // seed | takeoff | expansion

        // 6. Lead Data
        name: '',
        email: '',
        company: '',
        whatsapp: '',

        // Unused in new flow but kept for compatibility if needed
        hostingType: 'none',
        securityLevel: 'standard',
        designStyle: '',
        references: '',
        sitemap: [],
        seoStatus: 'has_keywords',
        analytics: [],
        contactPreference: 'form'
    },
    recommendations: [],
    totalCost: 0,
    totalHours: 0,
    generatedPlan: {
        diagnosis: '',
        techStack: [],
        team: [],
        roadmap: []
    }
};

export const useProjectCalculator = () => {
    const [state, setState] = useState<WizardState>(INITIAL_STATE);

    const setAnswer = (category: keyof WizardState['answers'], value: any) => {
        setState(prev => ({
            ...prev,
            answers: {
                ...prev.answers,
                [category]: value
            }
        }));
    };

    const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
    const prevStep = () => setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
    const startWizard = () => setState(prev => ({ ...prev, step: 1 }));

    // Calculation & Plan Logic (NOVA AI ALGORITHM)
    useEffect(() => {
        let items: InventoryItem[] = [];
        const { domainStatus, brandStatus, projectType, features } = state.answers;

        // --- LOGIC MAPPING ---

        // 3. Infrastructure
        // "Todo listo" implies owned_ok. "A medias" / "Nulo" -> add Domain
        items.push(INVENTORY.find(i => i.id === 'IT-02')!); // Hosting always needed
        if (domainStatus !== 'owned_ok') items.push(INVENTORY.find(i => i.id === 'IT-01')!);

        // 2. Identity
        // "Solo lo basico" or "Desde cero" -> add UX/UI
        if (brandStatus !== 'complete') {
            items.push(INVENTORY.find(i => i.id === 'DS-02')!);
            if (brandStatus === 'none') {
                items.push(INVENTORY.find(i => i.id === 'DS-01')!); // Branding
            }
        }

        // 1. Mission (Dev Core)
        if (projectType === 'landing') items.push(INVENTORY.find(i => i.id === 'DV-01')!);
        if (projectType === 'ecommerce') items.push(INVENTORY.find(i => i.id === 'DV-02')!);
        if (projectType === 'lms') items.push(INVENTORY.find(i => i.id === 'DV-03')!);
        if (projectType === 'webapp') items.push({ ...INVENTORY.find(i => i.id === 'DV-02')!, name: 'Web App Core', cost: 2500 });


        // 4. Marketing & Navigation
        if (features.includes('seo')) items.push(INVENTORY.find(i => i.id === 'MK-02')!);
        if (features.includes('analytics')) items.push(INVENTORY.find(i => i.id === 'MK-01')!);
        if (features.includes('chatbot')) items.push(INVENTORY.find(i => i.id === 'MK-03')!);
        if (features.includes('multilanguage')) items.push(INVENTORY.find(i => i.id === 'DV-07')!);

        // PM calc
        const technicalCost = items.reduce((sum, item) => sum + item.cost, 0);
        const technicalHours = items.reduce((sum, item) => sum + item.effortHours, 0);
        const pmItem: InventoryItem = {
            ...INVENTORY.find(i => i.id === 'PM-01')!,
            cost: technicalCost * 0.20,
            effortHours: technicalHours * 0.20
        };
        items.push(pmItem);

        // --- PLAN GENERATION ---
        const diagnosis = `Necesidad detectada: Solución tipo ${projectType.toUpperCase()} con requerimientos de ${brandStatus === 'complete' ? 'integración' : 'diseño de identidad'}.`;

        const stack = ['Core: React + Vite'];
        if (projectType === 'ecommerce') stack.push('Commerce: Node.js / Stripe');
        if (features.includes('chatbot')) stack.push('AI: OpenAI Module');

        const roadmap = [
            'Fase 1: Configuración Inicial (Terreno)',
            'Fase 2: Identidad & Diseño (Nave)',
            'Fase 3: Desarrollo Core (Motores)',
            'Fase 4: Pruebas de Vuelo (QA)',
            'Fase 5: Despegue (Lanzamiento)'
        ];

        setState(prev => ({
            ...prev,
            recommendations: items,
            totalCost: technicalCost + pmItem.cost,
            totalHours: technicalHours + pmItem.effortHours,
            generatedPlan: {
                diagnosis,
                techStack: stack,
                team: ['PM', 'Dev', 'Designer'], // Simplificado
                roadmap
            }
        }));

    }, [state.answers]);

    return { state, setAnswer, nextStep, prevStep, startWizard };
};

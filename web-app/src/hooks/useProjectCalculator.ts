import { useState, useEffect } from 'react';
import { INVENTORY } from '../data/inventory';
import type { WizardState, InventoryItem } from '../data/inventory';

const INITIAL_STATE: WizardState = {
    step: 1,
    answers: {
        domainStatus: 'none',
        brandStatus: 'none',
        projectType: 'landing',
        features: [],
        marketing: ['analytics', 'seo'] // Defaults usually checked
    },
    recommendations: [],
    totalCost: 0,
    totalHours: 0
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
    const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));

    // Calculation Logic
    useEffect(() => {
        let items: InventoryItem[] = [];
        const { domainStatus, brandStatus, projectType, features } = state.answers;

        // 1. Infrastructure
        items.push(INVENTORY.find(i => i.id === 'IT-02')!); // Hosting always
        if (domainStatus !== 'owned_ok') {
            items.push(INVENTORY.find(i => i.id === 'IT-01')!);
        }

        // 2. Branding
        if (brandStatus === 'none') {
            items.push(INVENTORY.find(i => i.id === 'DS-01')!);
            items.push(INVENTORY.find(i => i.id === 'DS-02')!);
        } else if (brandStatus === 'basic' && projectType !== 'landing') {
            items.push(INVENTORY.find(i => i.id === 'DS-02')!); // Design System needed for complex apps
        }

        // 3. Development Core
        if (projectType === 'landing') items.push(INVENTORY.find(i => i.id === 'DV-01')!);
        if (projectType === 'ecommerce') items.push(INVENTORY.find(i => i.id === 'DV-02')!);
        if (projectType === 'lms') items.push(INVENTORY.find(i => i.id === 'DV-03')!);
        if (projectType === 'webapp') {
            // WebApp similar to Ecomm base price for logic, or specific item
            items.push({ ...INVENTORY.find(i => i.id === 'DV-02')!, name: 'Web App Core', cost: 2500 });
        }

        // 4. Features
        if (features.includes('chatbot')) items.push(INVENTORY.find(i => i.id === 'MK-03')!);
        if (features.includes('blog')) items.push({ ...INVENTORY.find(i => i.id === 'DV-04')!, name: 'Módulo Blog' });

        // 5. Marketing Defaults
        items.push(INVENTORY.find(i => i.id === 'MK-01')!); // Analytics
        items.push(INVENTORY.find(i => i.id === 'MK-02')!); // SEO

        // Calculate Subtotals
        const technicalCost = items.reduce((sum, item) => sum + item.cost, 0);
        const technicalHours = items.reduce((sum, item) => sum + item.effortHours, 0);

        // 6. PM Management (20%)
        const pmCost = technicalCost * 0.20;
        const pmItem: InventoryItem = {
            ...INVENTORY.find(i => i.id === 'PM-01')!,
            cost: pmCost,
            effortHours: technicalHours * 0.20
        };
        items.push(pmItem);

        setState(prev => ({
            ...prev,
            recommendations: items,
            totalCost: technicalCost + pmCost,
            totalHours: technicalHours + pmItem.effortHours
        }));

    }, [state.answers]);

    return { state, setAnswer, nextStep, prevStep };
};

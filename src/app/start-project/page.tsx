"use client";
import { useProjectCalculator } from '@/hooks/useProjectCalculator';
import { useRouter } from 'next/navigation';
import StarBackground from '@/components/StarBackground';
import WizardCard from '@/components/WizardCard';
import WizardProgress from '@/components/WizardProgress';
import StepWelcome from '@/components/wizard/StepWelcome';
import StepSegment from '@/components/wizard/StepSegment';
import StepPackage from '@/components/wizard/StepPackage';
import StepMisionBrief from '@/components/wizard/StepMisionBrief';
import StepMissionType from '@/components/wizard/StepMissionType';
import StepVisualIdentity from '@/components/wizard/StepVisualIdentity';
import StepInfrastructure from '@/components/wizard/StepInfrastructure';
import StepSystems from '@/components/wizard/StepSystems';
import StepLaunch from '@/components/wizard/StepLaunch';
import StepBreakdown from '@/components/wizard/StepBreakdown';
import StepContact from '@/components/wizard/StepContact';
import StepSuccess from '@/components/wizard/StepSuccess';
import Navbar from '@/components/layout/Navbar';

// ─────────────────────────────────────────────
// CONFIGURACIÓN DE PASOS POR SEGMENTO
//
// despegue: 0-Welcome → 1-Segment → 2-Package → 3-Contact → 4-Success
// orbita:   0-Welcome → 1-Segment → 2-Mission → 3-Identity → 4-Infra
//                     → 5-Systems → 6-Launch → 7-Breakdown → 8-Contact → 9-Success
// mision:   0-Welcome → 1-Segment → 2-Brief → 3-Success
// ─────────────────────────────────────────────

const TOTAL_STEPS: Record<string, number> = {
    despegue: 3,
    orbita: 8,
    mision: 2,
};

const StartProject = () => {
    const { state, setAnswer, nextStep, prevStep, startWizard } = useProjectCalculator();
    const { step, answers } = state;
    const router = useRouter();
    const segment = answers.segment;

    // ── MAPPERS ──────────────────────────────────
    const mapBrandToLogic = (val: string) => {
        if (val === 'logo-only') return 'basic';
        if (val === 'from-scratch') return 'none';
        return 'complete';
    };
    const mapInfraToLogic = (val: string) => {
        if (val === 'domain-only') return 'owned_lost';
        if (val === 'nothing') return 'none';
        return 'owned_ok';
    };
    const mapTimelineToLogic = (val: string) => val === 'standard' ? 'normal' : 'urgent';
    const mapBudgetToLogic = (val: string) => {
        if (val === 'small') return 'seed';
        if (val === 'medium') return 'takeoff';
        return 'expansion';
    };
    const getBrandValue = () => {
        if (answers.brandStatus === 'basic') return 'logo-only';
        if (answers.brandStatus === 'none') return 'from-scratch';
        return 'complete';
    };
    const getInfraValue = () => {
        if (answers.domainStatus === 'owned_lost') return 'domain-only';
        if (answers.domainStatus === 'none') return 'nothing';
        return 'complete';
    };

    // ── SUBMIT HELPERS ───────────────────────────
    const submitLead = async (data: {
        name: string; email: string; whatsapp?: string;
        projectType?: string; message: string;
    }) => {
        try {
            await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.whatsapp ?? '',
                    project_type: data.projectType ?? segment,
                    message: data.message,
                }),
            });
        } catch (e) {
            console.error('Error al enviar el lead', e);
        }
    };

    // ── RENDER STEP ──────────────────────────────
    const renderStep = () => {
        // Step 0: Welcome (igual para todos)
        if (step === 0) return <StepWelcome onNext={startWizard} />;

        // Step 1: Selección de segmento (igual para todos)
        if (step === 1) return (
            <StepSegment
                selected={segment}
                onSelect={(val) => setAnswer('segment', val)}
                onNext={nextStep}
                onBack={prevStep}
            />
        );

        // ── FLUJO DESPEGUE ──────────────────────
        if (segment === 'despegue') {
            if (step === 2) return (
                <StepPackage
                    selected={answers.selectedPackage}
                    onSelect={(val) => setAnswer('selectedPackage', val)}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 3) return (
                <StepContact
                    onSubmit={async (data) => {
                        const packageLabels: Record<string, string> = {
                            cohete: 'Cohete 🚀 — $5,500 MXN | 3 días',
                            lanzadera: 'Lanzadera ⚡ — $12,000 MXN | 7 días',
                            'mision-starter': 'Misión Starter 🌟 — $20,000 MXN | 12 días',
                        };
                        const message = [
                            `Segmento: Despegue (Emprendedor)`,
                            `Paquete seleccionado: ${packageLabels[answers.selectedPackage] ?? answers.selectedPackage}`,
                        ].join(' | ');
                        await submitLead({
                            name: data.name, email: data.email,
                            whatsapp: data.whatsapp,
                            projectType: `despegue-${answers.selectedPackage}`,
                            message,
                        });
                        router.push('/gracias');
                    }}
                    onBack={prevStep}
                />
            );
            if (step === 4) return <StepSuccess />;
        }

        // ── FLUJO MISIÓN (enterprise) ────────────
        if (segment === 'mision') {
            if (step === 2) return (
                <StepMisionBrief
                    onSubmit={async (data) => {
                        const message = [
                            `Segmento: Misión (Empresa)`,
                            `Empresa: ${data.company}`,
                            `Descripción: ${data.description}`,
                            `Presupuesto estimado: ${data.budget}`,
                        ].join(' | ');
                        await submitLead({
                            name: data.company, email: data.contact,
                            projectType: 'mision-enterprise',
                            message,
                        });
                        nextStep();
                    }}
                    onBack={prevStep}
                />
            );
            if (step === 3) return <StepSuccess />;
        }

        // ── FLUJO ÓRBITA (negocio — wizard completo) ──
        if (segment === 'orbita') {
            if (step === 2) return (
                <StepMissionType
                    selected={answers.projectType}
                    onSelect={(val) => setAnswer('projectType', val)}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 3) return (
                <StepVisualIdentity
                    selected={getBrandValue()}
                    onSelect={(val) => setAnswer('brandStatus', mapBrandToLogic(val))}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 4) return (
                <StepInfrastructure
                    selected={getInfraValue()}
                    onSelect={(val) => setAnswer('domainStatus', mapInfraToLogic(val))}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 5) return (
                <StepSystems
                    selected={answers.features.map(f => f === 'multilanguage' ? 'multilang' : f)}
                    onToggle={(val) => {
                        const logicVal = val === 'multilang' ? 'multilanguage' : val;
                        const newFeats = answers.features.includes(logicVal)
                            ? answers.features.filter(f => f !== logicVal)
                            : [...answers.features, logicVal];
                        setAnswer('features', newFeats);
                    }}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 6) return (
                <StepLaunch
                    timeline={answers.deadline === 'normal' ? 'standard' : 'urgent'}
                    budget={answers.budgetRange === 'seed' ? 'small' : answers.budgetRange === 'takeoff' ? 'medium' : 'large'}
                    onTimelineSelect={(val) => setAnswer('deadline', mapTimelineToLogic(val))}
                    onBudgetSelect={(val) => setAnswer('budgetRange', mapBudgetToLogic(val))}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 7) return (
                <StepBreakdown
                    recommendations={state.recommendations}
                    totalCost={state.totalCost}
                    totalHours={state.totalHours}
                    onNext={nextStep}
                    onBack={prevStep}
                />
            );
            if (step === 8) return (
                <StepContact
                    onSubmit={async (data) => {
                        setAnswer('name', data.name);
                        setAnswer('email', data.email);
                        setAnswer('whatsapp', data.whatsapp);
                        const budgetLabel = answers.budgetRange === 'seed'
                            ? 'Hasta $40,000 MXN'
                            : answers.budgetRange === 'takeoff'
                            ? '$40,000 – $80,000 MXN'
                            : '+$80,000 MXN';
                        const featuresLabel = answers.features.length > 0 ? answers.features.join(', ') : 'Ninguno';
                        const message = [
                            `Segmento: Órbita (Negocio)`,
                            `Tipo: ${answers.projectType}`,
                            `Marca: ${answers.brandStatus}`,
                            `Dominio: ${answers.domainStatus}`,
                            `Features: ${featuresLabel}`,
                            `Presupuesto: ${budgetLabel}`,
                            `Plazo: ${answers.deadline === 'normal' ? 'Estándar (4 sem)' : 'Urgente (1-2 sem)'}`,
                            `Costo estimado: $${state.totalCost.toFixed(0)} MXN`,
                            `Horas: ${state.totalHours.toFixed(0)}h`,
                        ].join(' | ');
                        await submitLead({
                            name: data.name, email: data.email,
                            whatsapp: data.whatsapp,
                            projectType: answers.projectType,
                            message,
                        });
                        router.push('/gracias');
                    }}
                    onBack={prevStep}
                />
            );
            if (step === 9) return <StepSuccess />;
        }

        return null;
    };

    // ── PROGRESS BAR ─────────────────────────────
    const totalSteps = TOTAL_STEPS[segment] ?? 8;
    const showProgress = step > 0 && step < (totalSteps + 1);

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <StarBackground />
            <Navbar />
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12 pt-32 px-4">
                {showProgress && (
                    <WizardProgress currentStep={step} totalSteps={totalSteps} />
                )}
                <WizardCard className="max-w-2xl w-full">
                    {renderStep()}
                </WizardCard>
            </main>
        </div>
    );
};

export default StartProject;

import { useProjectCalculator } from '@/hooks/useProjectCalculator';
import StarBackground from '@/components/StarBackground';
import WizardCard from '@/components/WizardCard';
import WizardProgress from '@/components/WizardProgress';
import StepWelcome from '@/components/wizard/StepWelcome';
import StepMissionType from '@/components/wizard/StepMissionType';
import StepVisualIdentity from '@/components/wizard/StepVisualIdentity';
import StepInfrastructure from '@/components/wizard/StepInfrastructure';
import StepSystems from '@/components/wizard/StepSystems';
import StepLaunch from '@/components/wizard/StepLaunch';
import StepContact from '@/components/wizard/StepContact';
import StepSuccess from '@/components/wizard/StepSuccess';

import Navbar from '@/components/layout/Navbar';

const StartProject = () => {
    const { state, setAnswer, nextStep, prevStep, startWizard } = useProjectCalculator();
    const { step, answers } = state;

    // --- MAPPERS ---
    // Map component values to internal logic values
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

    const mapTimelineToLogic = (val: string) => {
        return val === 'standard' ? 'normal' : 'urgent';
    };

    const mapBudgetToLogic = (val: string) => {
        if (val === 'small') return 'seed';
        if (val === 'medium') return 'takeoff';
        return 'expansion';
    };

    // --- REVERSE MAPPERS (Logic -> Component) ---
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

    const renderStep = () => {
        switch (step) {
            case 0:
                return <StepWelcome onNext={startWizard} />;
            case 1:
                return (
                    <StepMissionType
                        selected={answers.projectType}
                        onSelect={(val) => setAnswer('projectType', val)}
                        onNext={nextStep}
                        onBack={() => prevStep()} // Should go to welcome? No, welcome is step 0.
                    />
                );
            case 2:
                return (
                    <StepVisualIdentity
                        selected={getBrandValue()}
                        onSelect={(val) => setAnswer('brandStatus', mapBrandToLogic(val))}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 3:
                return (
                    <StepInfrastructure
                        selected={getInfraValue()}
                        onSelect={(val) => setAnswer('domainStatus', mapInfraToLogic(val))}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 4:
                return (
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
            case 5:
                // Split logic: StepLaunch combines Time and Budget.
                // Our logic expected separate steps maybe?
                // The new component StepLaunch handles BOTH.
                // So we just map both here.
                return (
                    <StepLaunch
                        timeline={answers.deadline === 'normal' ? 'standard' : 'urgent'}
                        budget={answers.budgetRange === 'seed' ? 'small' : answers.budgetRange === 'takeoff' ? 'medium' : 'large'} // approx mapping
                        onTimelineSelect={(val) => setAnswer('deadline', mapTimelineToLogic(val))}
                        onBudgetSelect={(val) => setAnswer('budgetRange', mapBudgetToLogic(val))}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                );
            case 6:
                return (
                    <StepContact
                        onSubmit={(data) => {
                            setAnswer('name', data.name);
                            setAnswer('email', data.email);
                            setAnswer('whatsapp', data.whatsapp);
                            // Submit logic or next step?
                            // Logic usually generates plan here.
                            nextStep(); // This moves to step 7 (Success)
                        }}
                        onBack={prevStep}
                    />
                );
            case 7:
                return <StepSuccess />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-background">
            <StarBackground />

            <Navbar />

            {/* Main content */}
            <main className="relative z-10 min-h-screen flex flex-col items-center justify-center py-12 pt-32 px-4">
                {/* Show progress only on steps 1-6 (Content steps) */}
                {step > 0 && step < 7 && (
                    <WizardProgress currentStep={step} totalSteps={6} />
                )}

                {/* If step 0, render directly. If >0, wrap in card? 
                    StepWelcome usually is full page or card?
                    In nova-mission-builder index.tsx: 
                    <ProjectWizard /> -> wraps content in WizardCard.
                    StepWelcome is rendered INSIDE WizardCard in the original repo.
                */}
                <WizardCard className="max-w-2xl w-full">
                    {renderStep()}
                </WizardCard>
            </main>

        </div>
    );
};

export default StartProject;

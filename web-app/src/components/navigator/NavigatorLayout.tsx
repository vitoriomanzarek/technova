import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigatorLayoutProps {
    currentStep: number;
    totalSteps: number;
    title: string;
    children: ReactNode;
    onNext?: () => void;
    onPrev?: () => void;
    canNext?: boolean;
}

const NavigatorLayout = ({
    currentStep,
    totalSteps,
    title,
    children,
    onNext,
    onPrev,
    canNext = true
}: NavigatorLayoutProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="min-h-screen bg-dark pt-32 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Paso {currentStep} de {totalSteps}</span>
                        <span>{Math.round(progress)}% Completado</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Card Content */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10"></div>

                    <motion.h2
                        key={title}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold mb-8 text-center text-white"
                    >
                        {title}
                    </motion.h2>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-12 pt-8 border-t border-white/5">
                        <button
                            onClick={onPrev}
                            disabled={currentStep === 1}
                            className={`px-6 py-3 rounded-lg font-bold transition-colors ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            ← Atrás
                        </button>

                        {onNext && (
                            <button
                                onClick={onNext}
                                disabled={!canNext}
                                className="bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-primary/30"
                            >
                                Siguiente →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavigatorLayout;

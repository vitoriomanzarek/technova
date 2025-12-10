interface WizardProgressProps {
    currentStep: number;
    totalSteps: number;
}

const WizardProgress = ({ currentStep, totalSteps }: WizardProgressProps) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full max-w-md mx-auto mb-8">
            {/* Step indicator */}
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground font-medium tracking-wider uppercase">
                    Paso {currentStep} de {totalSteps}
                </span>
                <span className="text-xs text-primary font-bold">
                    {Math.round(progress)}%
                </span>
            </div>

            {/* Progress bar container */}
            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden border border-border/50">
                {/* Background glow */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background: 'linear-gradient(90deg, hsl(189 100% 50% / 0.2), hsl(274 89% 37% / 0.2))',
                    }}
                />

                {/* Progress fill */}
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out animate-progress-glow relative"
                    style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, hsl(189 100% 50%), hsl(274 89% 37%))',
                    }}
                >
                    {/* Shine effect */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)',
                        }}
                    />
                </div>

                {/* End cap glow */}
                {progress > 0 && (
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary"
                        style={{
                            left: `calc(${progress}% - 6px)`,
                            boxShadow: '0 0 10px hsl(189 100% 50%), 0 0 20px hsl(189 100% 50% / 0.5)',
                        }}
                    />
                )}
            </div>

            {/* Step dots */}
            <div className="flex justify-between mt-3">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index + 1 <= currentStep
                                ? 'bg-primary glow-cyan scale-125'
                                : 'bg-muted-foreground/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default WizardProgress;

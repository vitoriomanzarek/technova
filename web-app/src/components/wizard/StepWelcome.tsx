import { Rocket } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepWelcomeProps {
    onNext: () => void;
}

const StepWelcome = ({ onNext }: StepWelcomeProps) => {
    return (
        <div className="text-center space-y-8">
            <NovaAvatar size="lg" isThinking />

            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient">
                    Despega tu Proyecto
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
                    Hola, soy <span className="text-primary font-semibold">NOVA AI</span>.
                    Diseñemos tu Plan de Vuelo Digital juntos.
                </p>
            </div>

            <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-xl hover-glow transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <span className="relative flex items-center gap-3">
                        Iniciar Diagnóstico
                        <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                </button>
            </div>

            <p className="text-sm text-muted-foreground/60 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                Solo tomará 2 minutos completar el diagnóstico
            </p>
        </div>
    );
};

export default StepWelcome;

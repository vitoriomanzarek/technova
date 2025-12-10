import { CheckCircle, Sparkles } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

const StepSuccess = () => {
    return (
        <div className="text-center space-y-8 py-8">
            {/* Success icon */}
            <div className="relative inline-block animate-fade-in">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150" />
                <div className="relative bg-primary/10 p-6 rounded-full border border-primary/30 glow-cyan">
                    <CheckCircle className="w-16 h-16 text-primary" />
                </div>
            </div>

            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-3xl font-bold text-gradient">
                    ¡Misión Confirmada!
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Tu Plan de Vuelo Digital está en camino. Revisa tu correo electrónico para los próximos pasos.
                </p>
            </div>

            <div className="flex items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <NovaAvatar size="sm" />
                <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-semibold">NOVA AI</span> te contactará pronto
                </p>
            </div>

            <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 text-secondary border border-secondary/30">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Gracias por confiar en TechNova</span>
                </div>
            </div>
        </div>
    );
};

export default StepSuccess;

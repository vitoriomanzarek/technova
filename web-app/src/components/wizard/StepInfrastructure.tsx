import { Server, Globe, HelpCircle } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepInfrastructureProps {
    selected: string;
    onSelect: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const infraOptions = [
    { id: 'complete', label: 'Tengo Dominio & Hosting', sublabel: 'Todo listo para desplegar', icon: Server },
    { id: 'domain-only', label: 'Solo Dominio', sublabel: 'Necesito hosting', icon: Globe },
    { id: 'nothing', label: 'No tengo nada', sublabel: 'Empezamos desde cero', icon: HelpCircle },
];

const StepInfrastructure = ({ selected, onSelect, onNext, onBack }: StepInfrastructureProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Infraestructura</h2>
                    <p className="text-muted-foreground">¿Qué recursos técnicos tienes disponibles?</p>
                </div>
            </div>

            <div className="space-y-3">
                {infraOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = selected === option.id;

                    return (
                        <button
                            key={option.id}
                            onClick={() => onSelect(option.id)}
                            className={`group w-full p-5 rounded-xl text-left transition-all duration-300 animate-fade-in border flex items-center gap-4 ${isSelected
                                    ? 'bg-primary/10 border-primary glow-cyan'
                                    : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className={`p-3 rounded-lg transition-all duration-300 ${isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground group-hover:text-primary'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {option.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">{option.sublabel}</p>
                            </div>

                            <div
                                className={`w-5 h-5 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                                    }`}
                            >
                                {isSelected && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                    ← Atrás
                </button>
                <button
                    onClick={onNext}
                    disabled={!selected}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${selected
                            ? 'bg-primary text-primary-foreground hover-glow hover:scale-105'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                >
                    Continuar →
                </button>
            </div>
        </div>
    );
};

export default StepInfrastructure;

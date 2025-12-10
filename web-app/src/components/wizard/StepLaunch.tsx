import { Zap, Clock, DollarSign } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepLaunchProps {
    timeline: string;
    budget: string;
    onTimelineSelect: (value: string) => void;
    onBudgetSelect: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const timelineOptions = [
    { id: 'urgent', label: 'Urgente', sublabel: 'Menos de 2 semanas', icon: Zap },
    { id: 'standard', label: 'Estándar', sublabel: '2-4 semanas', icon: Clock },
];

const budgetOptions = [
    { id: 'small', label: '$1,000 - $3,000', sublabel: 'Proyecto básico' },
    { id: 'medium', label: '$3,000 - $7,000', sublabel: 'Proyecto intermedio' },
    { id: 'large', label: '$7,000 - $15,000', sublabel: 'Proyecto avanzado' },
    { id: 'enterprise', label: '+$15,000', sublabel: 'Proyecto enterprise' },
];

const StepLaunch = ({ timeline, budget, onTimelineSelect, onBudgetSelect, onNext, onBack }: StepLaunchProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Coordenadas de Lanzamiento</h2>
                    <p className="text-muted-foreground">Definamos el timeline y presupuesto</p>
                </div>
            </div>

            {/* Timeline section */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Timeline
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {timelineOptions.map((option, index) => {
                        const Icon = option.icon;
                        const isSelected = timeline === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => onTimelineSelect(option.id)}
                                className={`group p-4 rounded-xl text-left transition-all duration-300 animate-fade-in border ${isSelected
                                        ? 'bg-primary/10 border-primary glow-cyan'
                                        : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                                    }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <div>
                                        <h4 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                            {option.label}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">{option.sublabel}</p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Budget section */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    Rango de Presupuesto
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {budgetOptions.map((option, index) => {
                        const isSelected = budget === option.id;

                        return (
                            <button
                                key={option.id}
                                onClick={() => onBudgetSelect(option.id)}
                                className={`group p-4 rounded-xl text-left transition-all duration-300 animate-fade-in border ${isSelected
                                        ? 'bg-primary/10 border-primary glow-cyan'
                                        : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                                    }`}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <h4 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {option.label}
                                </h4>
                                <p className="text-xs text-muted-foreground">{option.sublabel}</p>
                            </button>
                        );
                    })}
                </div>
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
                    disabled={!timeline || !budget}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${timeline && budget
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

export default StepLaunch;

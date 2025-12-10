import { Search, BarChart3, Bot, Languages, Check } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepSystemsProps {
    selected: string[];
    onToggle: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const systemOptions = [
    { id: 'seo', label: 'SEO', description: 'Optimización para buscadores', icon: Search },
    { id: 'analytics', label: 'Analytics', description: 'Métricas y estadísticas', icon: BarChart3 },
    { id: 'chatbot', label: 'Chatbot AI', description: 'Asistente inteligente', icon: Bot },
    { id: 'multilang', label: 'Multi-idioma', description: 'Soporte multilingüe', icon: Languages },
];

const StepSystems = ({ selected, onToggle, onNext, onBack }: StepSystemsProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Sistemas Adicionales</h2>
                    <p className="text-muted-foreground">Selecciona las funcionalidades que necesitas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {systemOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = selected.includes(option.id);

                    return (
                        <button
                            key={option.id}
                            onClick={() => onToggle(option.id)}
                            className={`group relative p-5 rounded-xl text-left transition-all duration-300 animate-fade-in border ${isSelected
                                    ? 'bg-primary/10 border-primary glow-cyan'
                                    : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start gap-4">
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
                                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                                </div>

                                <div
                                    className={`w-6 h-6 rounded-md border-2 transition-all duration-300 flex items-center justify-center ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                                        }`}
                                >
                                    {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="text-sm text-muted-foreground/60 text-center">
                Puedes seleccionar múltiples opciones o ninguna
            </p>

            <div className="flex justify-between pt-4">
                <button
                    onClick={onBack}
                    className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                    ← Atrás
                </button>
                <button
                    onClick={onNext}
                    className="px-8 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover-glow hover:scale-105 transition-all duration-300"
                >
                    Continuar →
                </button>
            </div>
        </div>
    );
};

export default StepSystems;

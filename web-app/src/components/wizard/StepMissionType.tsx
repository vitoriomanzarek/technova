import { Globe, ShoppingCart, GraduationCap, Layers } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepMissionTypeProps {
    selected: string;
    onSelect: (value: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const missionTypes = [
    { id: 'landing', label: 'Landing Page', icon: Globe, description: 'Página de aterrizaje para captar leads' },
    { id: 'ecommerce', label: 'eCommerce', icon: ShoppingCart, description: 'Tienda online completa' },
    { id: 'lms', label: 'LMS', icon: GraduationCap, description: 'Plataforma de cursos online' },
    { id: 'webapp', label: 'Web App', icon: Layers, description: 'Aplicación web personalizada' },
];

const StepMissionType = ({ selected, onSelect, onNext, onBack }: StepMissionTypeProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">¿Cuál es tu misión?</h2>
                    <p className="text-muted-foreground">Selecciona el tipo de proyecto que deseas crear</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missionTypes.map((type, index) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.id;

                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className={`group relative p-6 rounded-xl text-left transition-all duration-300 animate-fade-in border ${isSelected
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
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`font-semibold text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                        {type.label}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                                </div>
                            </div>

                            {isSelected && (
                                <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse" />
                            )}
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

export default StepMissionType;

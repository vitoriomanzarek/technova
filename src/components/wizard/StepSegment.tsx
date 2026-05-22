"use client";
import NovaAvatar from '../NovaAvatar';

interface StepSegmentProps {
    selected: string;
    onSelect: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const segments = [
    {
        id: 'despegue',
        emoji: '🚀',
        title: 'Despegue',
        subtitle: 'Emprendedor / Idea nueva',
        description: 'Quiero lanzar mi primera presencia digital. Necesito algo rápido, bonito y accesible.',
        badge: 'Desde $5,500 MXN',
        badgeColor: 'cyan',
    },
    {
        id: 'orbita',
        emoji: '🛸',
        title: 'Órbita',
        subtitle: 'Negocio establecido',
        description: 'Tengo un negocio funcionando y necesito un sitio completo, e-commerce o un sistema a medida.',
        badge: 'Desde $20,000 MXN',
        badgeColor: 'purple',
    },
    {
        id: 'mision',
        emoji: '🏛️',
        title: 'Misión',
        subtitle: 'Empresa / Proyecto grande',
        description: 'Tenemos requerimientos complejos: web app, SaaS, integraciones, equipo técnico externo.',
        badge: 'Desde $80,000 MXN',
        badgeColor: 'emerald',
    },
];

const badgeStyles: Record<string, { badge: string; ring: string; bg: string; text: string }> = {
    cyan: {
        badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40',
        ring: 'border-cyan-500 bg-cyan-500/10 glow-cyan',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
    },
    purple: {
        badge: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
        ring: 'border-purple-500 bg-purple-500/10',
        bg: 'bg-purple-500/10',
        text: 'text-purple-400',
    },
    emerald: {
        badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
        ring: 'border-emerald-500 bg-emerald-500/10',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
    },
};

const StepSegment = ({ selected, onSelect, onNext, onBack }: StepSegmentProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">¿En qué etapa está tu proyecto?</h2>
                    <p className="text-muted-foreground">Elige la que mejor describe tu situación</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {segments.map((seg, index) => {
                    const isSelected = selected === seg.id;
                    const styles = badgeStyles[seg.badgeColor];

                    return (
                        <button
                            key={seg.id}
                            onClick={() => onSelect(seg.id)}
                            className={`group relative p-6 rounded-xl text-left transition-all duration-300 animate-fade-in border ${
                                isSelected
                                    ? `${styles.ring}`
                                    : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className={`text-4xl leading-none p-3 rounded-xl transition-all duration-300 ${
                                        isSelected ? styles.bg : 'bg-muted/40'
                                    }`}
                                >
                                    {seg.emoji}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h3 className={`font-bold text-xl ${isSelected ? styles.text : 'text-foreground'}`}>
                                            {seg.title}
                                        </h3>
                                        <span className="text-sm text-muted-foreground">{seg.subtitle}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {seg.description}
                                    </p>
                                    <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${styles.badge}`}>
                                        {seg.badge}
                                    </span>
                                </div>
                            </div>

                            {isSelected && (
                                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full animate-pulse ${
                                    seg.badgeColor === 'cyan' ? 'bg-cyan-400' :
                                    seg.badgeColor === 'purple' ? 'bg-purple-400' : 'bg-emerald-400'
                                }`} />
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
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                        selected
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

export default StepSegment;

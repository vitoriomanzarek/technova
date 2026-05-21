"use client";
import { CheckCircle } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';

interface StepPackageProps {
    selected: string;
    onSelect: (val: string) => void;
    onNext: () => void;
    onBack: () => void;
}

const packages = [
    {
        id: 'cohete',
        name: 'Cohete',
        emoji: '🚀',
        price: '$5,500 MXN',
        days: 3,
        popular: false,
        features: [
            'Hero + CTA',
            'Formulario de contacto',
            'Deploy en Vercel',
            'Google Analytics',
            'SEO básico',
        ],
    },
    {
        id: 'lanzadera',
        name: 'Lanzadera',
        emoji: '⚡',
        price: '$12,000 MXN',
        days: 7,
        popular: true,
        features: [
            'Todo en Cohete',
            'Navbar + Footer',
            'Sección de servicios',
            'Testimonios',
            'FAQ',
            'GTM + Meta Pixel',
            'SEO completo',
        ],
    },
    {
        id: 'mision-starter',
        name: 'Misión Starter',
        emoji: '🌟',
        price: '$20,000 MXN',
        days: 12,
        popular: false,
        features: [
            'Todo en Lanzadera',
            'Diseño de logo',
            'Paleta de colores',
            'Tipografía',
            'Favicon',
            'Animaciones',
            'Google Search Console',
        ],
    },
];

const StepPackage = ({ selected, onSelect, onNext, onBack }: StepPackageProps) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Elige tu paquete de despegue</h2>
                    <p className="text-muted-foreground">Soluciones listas en días, no semanas</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg, index) => {
                    const isSelected = selected === pkg.id;

                    return (
                        <button
                            key={pkg.id}
                            onClick={() => onSelect(pkg.id)}
                            className={`group relative p-6 rounded-xl text-left transition-all duration-300 animate-fade-in border flex flex-col ${
                                isSelected
                                    ? 'bg-primary/10 border-primary glow-cyan'
                                    : pkg.popular
                                    ? 'bg-muted/30 border-primary/40 hover:border-primary hover:bg-muted/50'
                                    : 'bg-muted/20 border-border/50 hover:border-primary/50 hover:bg-muted/40'
                            }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                                        MÁS POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="text-3xl mb-2">{pkg.emoji}</div>
                                <h3 className={`font-bold text-lg ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {pkg.name}
                                </h3>
                                <div className={`text-2xl font-extrabold mt-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                    {pkg.price}
                                </div>
                                <span className="inline-block mt-2 text-xs font-medium bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-full border border-border/50">
                                    {pkg.days} días de entrega
                                </span>
                            </div>

                            <ul className="flex-1 space-y-2">
                                {pkg.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-primary/70'}`} />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </li>
                                ))}
                            </ul>

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

export default StepPackage;

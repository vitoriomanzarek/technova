"use client";
import { CheckCircle, Clock, DollarSign, Package } from 'lucide-react';
import NovaAvatar from '../NovaAvatar';
import type { CatalogComponent, ComponentCategory } from '@/data/catalog';

interface StepBreakdownProps {
    recommendations: CatalogComponent[];
    totalCost: number;
    totalHours: number;
    onNext: () => void;
    onBack: () => void;
}

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
    VI: 'Identidad Visual',
    UX: 'UX / Diseño',
    DV: 'Desarrollo Web',
    EC: 'E-commerce',
    SY: 'Sistemas',
    AN: 'Analíticos',
    SE: 'SEO',
    MK: 'Marketing',
    IT: 'Infraestructura',
    PM: 'Gestión',
};

const CATEGORY_COLORS: Record<ComponentCategory, string> = {
    VI: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
    UX: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    DV: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    EC: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    SY: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    AN: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    SE: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    MK: 'text-red-400 bg-red-400/10 border-red-400/20',
    IT: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
    PM: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
};

const StepBreakdown = ({ recommendations, totalCost, totalHours, onNext, onBack }: StepBreakdownProps) => {
    // Agrupar componentes por categoría
    const grouped = recommendations.reduce<Record<string, CatalogComponent[]>>((acc, comp) => {
        const cat = comp.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(comp);
        return acc;
    }, {});

    const pmCost = Math.round(totalCost - (totalCost / 1.20));
    const technicalCost = totalCost - pmCost;
    const deliveryDays = Math.ceil(totalHours / 8);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Tu Plan de Vuelo</h2>
                    <p className="text-muted-foreground">Esto incluye tu proyecto personalizado</p>
                </div>
            </div>

            {/* Totales destacados */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 text-center">
                    <DollarSign className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-xl font-bold text-primary">
                        ${totalCost.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-muted-foreground">MXN estimado</div>
                </div>
                <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-xl font-bold text-accent">{totalHours.toFixed(0)}h</div>
                    <div className="text-xs text-muted-foreground">de trabajo</div>
                </div>
                <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-xl p-4 text-center">
                    <Package className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xl font-bold text-emerald-400">~{deliveryDays}</div>
                    <div className="text-xs text-muted-foreground">días hábiles</div>
                </div>
            </div>

            {/* Desglose por categoría */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {Object.entries(grouped).map(([cat, items]) => {
                    const category = cat as ComponentCategory;
                    const subtotal = items.reduce((s, c) => s + c.cost, 0);
                    const colorClass = CATEGORY_COLORS[category];

                    return (
                        <div key={cat} className="border border-border/30 rounded-xl overflow-hidden">
                            {/* Header de categoría */}
                            <div className={`flex items-center justify-between px-4 py-2 border-b border-border/20 ${colorClass}`}>
                                <span className="text-sm font-semibold">
                                    {CATEGORY_LABELS[category]}
                                </span>
                                <span className="text-sm font-bold">
                                    ${subtotal.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                                </span>
                            </div>
                            {/* Items */}
                            <div className="divide-y divide-border/10">
                                {items.map(comp => (
                                    <div key={comp.id} className="flex items-center justify-between px-4 py-2 bg-muted/10">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                                            <span className="text-sm text-foreground">{comp.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span>{comp.hours}h</span>
                                            <span className="font-medium text-foreground/70">
                                                ${comp.cost.toLocaleString('es-MX')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Nota PM */}
            <div className="bg-muted/20 border border-border/30 rounded-xl px-4 py-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gestión de proyecto (PM) · 20%</span>
                <span className="font-semibold text-foreground">
                    +${pmCost.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN
                </span>
            </div>

            <p className="text-xs text-muted-foreground text-center">
                * Estimación base. El costo final se define después de una consultoría sin costo.
            </p>

            {/* Navegación */}
            <div className="flex justify-between pt-2">
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
                    Solicitar Consultoría →
                </button>
            </div>
        </div>
    );
};

export default StepBreakdown;

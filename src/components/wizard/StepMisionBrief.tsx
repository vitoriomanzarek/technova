"use client";
import { useState } from 'react';
import NovaAvatar from '../NovaAvatar';

interface MisionBriefData {
    company: string;
    description: string;
    budget: string;
    contact: string;
}

interface StepMisionBriefProps {
    onSubmit: (data: MisionBriefData) => void;
    onBack: () => void;
}

const budgetOptions = [
    '$80,000 – $150,000 MXN',
    '$150,000 – $300,000 MXN',
    '+$300,000 MXN',
    'Por definir',
];

const inputClass =
    'w-full bg-muted/20 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-200';

const StepMisionBrief = ({ onSubmit, onBack }: StepMisionBriefProps) => {
    const [form, setForm] = useState<MisionBriefData>({
        company: '',
        description: '',
        budget: '',
        contact: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isValid =
        form.company.trim() !== '' &&
        form.description.trim() !== '' &&
        form.budget !== '' &&
        form.contact.trim() !== '';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        setLoading(true);
        setError(null);
        try {
            await onSubmit(form);
        } catch {
            setError('Ocurrió un error al enviar. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <NovaAvatar size="sm" isThinking />
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Cuéntanos tu Misión</h2>
                    <p className="text-muted-foreground">
                        Analizaremos tu proyecto y te contactamos en menos de 24 horas
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Nombre de la empresa
                    </label>
                    <input
                        type="text"
                        placeholder="Ej. Grupo Innovación S.A."
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className={inputClass}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Describe tu proyecto
                    </label>
                    <textarea
                        rows={4}
                        placeholder="¿Qué quieres construir? ¿Qué problema resuelve? ¿Tienes referencias o deadline?"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={`${inputClass} resize-none`}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Presupuesto estimado
                    </label>
                    <select
                        value={form.budget}
                        onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className={`${inputClass} cursor-pointer`}
                        required
                    >
                        <option value="" disabled className="bg-[#12121f] text-white">
                            Selecciona un rango
                        </option>
                        {budgetOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#12121f] text-white">
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Email o WhatsApp de contacto
                    </label>
                    <input
                        type="text"
                        placeholder="Ej. direccion@empresa.com o +52 55 1234 5678"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        className={inputClass}
                        required
                    />
                </div>

                {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                        {error}
                    </p>
                )}

                <div className="flex justify-between pt-2">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors font-medium disabled:opacity-50"
                    >
                        ← Atrás
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid || loading}
                        className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                            isValid && !loading
                                ? 'bg-primary text-primary-foreground hover-glow hover:scale-105'
                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Misión →'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StepMisionBrief;

"use client";
import { Radar, ArrowRight, Rocket, Loader2 } from 'lucide-react';
import { useState } from 'react';

const LeadMagnetSection = () => {
    const [form, setForm] = useState({ email: '', website_url: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'Auditoría Express',
                    email: form.email,
                    website_url: form.website_url || undefined,
                    project_type: 'auditoria-web',
                }),
            });
            if (!res.ok) throw new Error();
            setStatus('success');
            setForm({ email: '', website_url: '' });
        } catch {
            setStatus('error');
        }
    };

    return (
        <section className="py-24 relative overflow-hidden bg-dark">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto backdrop-blur-sm shadow-2xl shadow-cyan-900/20">
                    <div className="grid md:grid-cols-2 gap-10 items-center">

                        {/* Left: copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-bold mb-6">
                                <Radar className="w-4 h-4" />
                                Diagnóstico Orbital Gratuito
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading leading-tight">
                                ¿Tu sitio web está <span className="text-gradient">perdiendo altitud</span>?
                            </h2>
                            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                                Déjanos escanear tu sitio. En 24-48 horas, Sofía — nuestra navegante digital — te enviará un diagnóstico personalizado con las 3 correcciones más urgentes para recuperar velocidad, visibilidad y ventas.
                            </p>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                {[
                                    '⚡ Velocidad de carga y Core Web Vitals',
                                    '🔍 Oportunidades SEO y posicionamiento',
                                    '📱 Experiencia de usuario y conversión',
                                    '💡 Plan de acción + cotización personalizada',
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-2">{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Right: form */}
                        <div>
                            {status === 'success' ? (
                                <div className="flex flex-col items-center text-center gap-4 py-8">
                                    <div className="text-5xl animate-bounce">🚀</div>
                                    <h3 className="text-xl font-bold text-white">¡Misión iniciada!</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Sofía ya recibió tu solicitud y está preparando el escáner orbital.
                                        Revisa tu correo en las próximas 24-48 horas — vendrá con tu diagnóstico completo y un plan de acción.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="text-xs text-cyan-400 hover:underline mt-2"
                                    >
                                        Enviar otra solicitud
                                    </button>
                                </div>
                            ) : (
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <div>
                                        <label className="text-xs text-gray-400 font-medium mb-1.5 block">
                                            Tu correo electrónico *
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="tu@correo.com"
                                            required
                                            value={form.email}
                                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                            className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 font-medium mb-1.5 block">
                                            URL de tu sitio web actual
                                            <span className="text-gray-600 ml-1">(opcional — si ya tienes uno)</span>
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://tu-sitio.com"
                                            value={form.website_url}
                                            onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))}
                                            className="w-full bg-dark/50 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-red-400 text-sm">Hubo un error. Por favor intenta de nuevo.</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 className="w-5 h-5 animate-spin" /> Iniciando misión...</>
                                        ) : (
                                            <><Rocket className="w-5 h-5" /> Quiero mi Diagnóstico Gratis <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-600 text-center">
                                        Sin spam. Sofía te escribe personalmente con tu diagnóstico en 24-48h.
                                    </p>
                                </form>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadMagnetSection;

"use client";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

const Contacto = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [started, setStarted] = useState(false);

    // Primera interacción con el form — para medir abandono (form_start sin form_submit)
    const markStarted = () => {
        if (!started) {
            setStarted(true);
            trackEvent('form_start', { form: 'contacto' });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    message: form.message,
                    project_type: 'contacto',
                }),
            });
            if (!res.ok) throw new Error();
            setStatus('success');
            setForm({ name: '', email: '', message: '' });
            trackEvent('form_submit', { form: 'contacto' });
        } catch {
            setStatus('error');
            trackEvent('form_error', { form: 'contacto' });
        }
    };

    return (
        <div className="pt-24 pb-16 overflow-hidden">
            {/* Header */}
            <div className="text-center py-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading">
                    Hablemos de tu <span className="text-gradient">Proyecto</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    ¿Tienes una idea en mente o necesitas ayuda con tu estrategia digital?
                    Escríbenos y nuestro equipo se pondrá en contacto contigo lo antes posible.
                </p>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Información de Contacto */}
                    <div className="space-y-8">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent/20 p-3 rounded-lg">
                                        <Mail className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <a href="mailto:thisistechnova2026@gmail.com" className="text-lg font-medium hover:text-accent transition-colors">
                                            thisistechnova2026@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-cyan-400/20 p-3 rounded-lg">
                                        <Phone className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Teléfono</p>
                                        <a href="tel:+527221669672" className="text-lg font-medium hover:text-cyan-400 transition-colors">
                                            +52 722 166 9672
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-500/20 p-3 rounded-lg">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Ubicación</p>
                                        <p className="text-lg font-medium">100% Remoto, Global.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Wizard */}
                        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30 p-8 rounded-2xl text-center">
                            <h4 className="text-xl font-bold mb-3">¿Quieres un presupuesto rápido?</h4>
                            <p className="text-gray-400 mb-6 text-sm">
                                Utiliza nuestro cotizador inteligente y descubre el alcance y costo estimado de tu proyecto en minutos.
                            </p>
                            <a href="/start-project" onClick={() => trackEvent('cta_click', { cta: 'contacto_cotizador' })} className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-lg hover:scale-105 transition-all">
                                Ir al Cotizador →
                            </a>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                        {status === 'success' ? (
                            <div className="flex flex-col items-center justify-center h-full py-16 text-center gap-4">
                                <CheckCircle className="w-16 h-16 text-cyan-400" />
                                <h3 className="text-2xl font-bold">¡Mensaje enviado!</h3>
                                <p className="text-gray-400">Nuestro equipo te contactará en menos de 24 horas.</p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="mt-4 text-sm text-cyan-400 hover:underline"
                                >
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Nombre Completo</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        required
                                        value={form.name}
                                        onFocus={markStarted}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        placeholder="john@ejemplo.com"
                                        required
                                        value={form.email}
                                        onFocus={markStarted}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-gray-300">Mensaje</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Cuéntanos un poco más sobre tus necesidades..."
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                                    />
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-400 text-sm">Hubo un error al enviar. Por favor intenta de nuevo.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {status === 'loading' ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>
                                    ) : (
                                        <><Send className="w-5 h-5" /> Enviar Mensaje</>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contacto;






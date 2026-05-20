"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2, Rocket, TrendingUp, Cpu } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

export default function Wizard() {
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState({
        goal: '',
        stage: '',
        name: '',
        email: '',
        phone: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [recommendation, setRecommendation] = useState<string>('');

    const handleNext = () => setStep((prev) => (prev + 1) as Step);
    const handlePrev = () => setStep((prev) => (prev - 1) as Step);

    const selectGoal = (goal: string) => {
        setFormData({ ...formData, goal });
        handleNext();
    };

    const selectStage = (stage: string) => {
        setFormData({ ...formData, stage });
        handleNext();
    };

    const getRecommendation = (stage: string) => {
        if (stage.includes('Empezando')) return 'START';
        if (stage.includes('Creciendo')) return 'GROWTH';
        return 'SCALE';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        const rec = getRecommendation(formData.stage);
        setRecommendation(rec);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: formData.name,
                    email: formData.email, 
                    phone: formData.phone,
                    project_type: `Cotización Wizard - Paquete Recomendado: ${rec} (Objetivo: ${formData.goal})` 
                }),
            });
            
            if (res.ok) {
                setStatus('success');
                setStep(4);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const packages = {
        START: { title: 'Paquete START', desc: 'Ideal para validar y captar tus primeros clientes rápido.', icon: Rocket, color: 'text-cyan-400' },
        GROWTH: { title: 'Paquete GROWTH', desc: 'El sistema completo para escalar tus ventas y automatizar.', icon: TrendingUp, color: 'text-purple-400' },
        SCALE: { title: 'Paquete SCALE', desc: 'Soluciones con Inteligencia Artificial para operaciones complejas.', icon: Cpu, color: 'text-emerald-400' },
    };

    return (
        <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-sm min-h-[400px] flex flex-col">
            
            {/* Progress Bar */}
            {step < 4 && (
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">
                        <span>Paso {step} de 3</span>
                        <span>{Math.round((step / 3) * 100)}%</span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-2">
                        <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
                    </div>
                </div>
            )}

            <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">¿Cuál es tu objetivo principal en este momento?</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Conseguir más prospectos/leads', 'Vender productos online (E-commerce)', 'Automatizar procesos y atención', 'Renovar mi imagen digital'].map((opt) => (
                                    <button 
                                        key={opt}
                                        onClick={() => selectGoal(opt)}
                                        className="text-left p-4 rounded-xl border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/5 transition-all text-gray-300 hover:text-white"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={handlePrev} className="text-gray-500 hover:text-white mb-4 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/> Atrás</button>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">¿En qué etapa se encuentra tu negocio?</h2>
                            <div className="flex flex-col gap-4">
                                {[
                                    'Empezando / Validando la idea (Tengo pocos clientes)', 
                                    'Creciendo / Establecido (Ya vendo pero quiero escalar)', 
                                    'Escalando operaciones (Busco máxima automatización e IA)'
                                ].map((opt) => (
                                    <button 
                                        key={opt}
                                        onClick={() => selectStage(opt)}
                                        className="text-left p-5 rounded-xl border border-white/10 hover:border-purple-400 hover:bg-purple-400/5 transition-all text-gray-300 hover:text-white"
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <button onClick={handlePrev} className="text-gray-500 hover:text-white mb-4 flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4"/> Atrás</button>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Casi listo!</h2>
                            <p className="text-gray-400 mb-6">Déjanos tus datos para enviarte tu propuesta y agendar tu llamada estratégica gratis.</p>
                            
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <input type="text" required placeholder="Tu Nombre" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400" />
                                <input type="email" required placeholder="Tu Correo Electrónico" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400" />
                                <input type="tel" required placeholder="Tu WhatsApp (con código de país)" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400" />
                                
                                {status === 'error' && <p className="text-red-400 text-sm">Ocurrió un error. Inténtalo de nuevo.</p>}
                                
                                <button disabled={status === 'loading'} type="submit" className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105">
                                    {status === 'loading' ? 'Procesando...' : 'Ver Mi Propuesta'} <ArrowRight className="w-5 h-5"/>
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {step === 4 && recommendation && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">¡Propuesta Generada!</h2>
                            <p className="text-gray-400 mb-8">Basado en tus respuestas, el paquete ideal para ti es:</p>
                            
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-sm mx-auto mb-8">
                                {(() => {
                                    const RecIcon = packages[recommendation as keyof typeof packages].icon;
                                    return (
                                        <>
                                            <RecIcon className={`w-12 h-12 mx-auto mb-4 ${packages[recommendation as keyof typeof packages].color}`} />
                                            <h3 className="text-xl font-bold text-white mb-2">{packages[recommendation as keyof typeof packages].title}</h3>
                                            <p className="text-sm text-gray-400">{packages[recommendation as keyof typeof packages].desc}</p>
                                        </>
                                    );
                                })()}
                            </div>

                            <a 
                                href={`https://wa.me/5215555555555?text=Hola,%20acabo%20de%20completar%20el%20Wizard.%20Me%20recomendó%20el%20${packages[recommendation as keyof typeof packages].title}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-lg shadow-emerald-500/30"
                            >
                                Hablar por WhatsApp
                            </a>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

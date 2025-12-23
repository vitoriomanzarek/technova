import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, ChevronDown, Zap, Star, Shield } from 'lucide-react';
import ParticleBackground from '../components/home/ParticleBackground';

const plans = [
    {
        name: 'Start',
        price: 'Personalizado',
        description: 'Ideal para validar ideas y lanzar tu primer MVP.',
        features: [
            'Landing Page de Alto Impacto',
            'Configuración de Dominio & Hosting',
            'Integración con WhatsApp',
            'Optimización SEO Básica',
            'Soporte por Email'
        ],
        icon: Zap,
        color: 'from-cyan-400 to-blue-500',
        glow: 'rgba(6,182,212,0.4)',
        popular: false
    },
    {
        name: 'Growth',
        price: 'Personalizado',
        description: 'Para negocios que buscan escalar y automatizar.',
        features: [
            'Sitio Web Completo / eCommerce',
            'Sistema de Gestión de Contenidos (CMS)',
            'Automatización de Correos',
            'SEO Avanzado & Analytics',
            'Soporte Prioritario',
            'Estrategia de Contenidos Inicial'
        ],
        icon: Star,
        color: 'from-purple-500 to-pink-500',
        glow: 'rgba(168,85,247,0.4)',
        popular: true
    },
    {
        name: 'Scale',
        price: 'Personalizado',
        description: 'Soluciones a medida para operaciones complejas.',
        features: [
            'Desarrollo de Software a Medida',
            'Integración de IA & Chatbots',
            'CRM Personalizado',
            'Infraestructura Cloud Escalable',
            'Soporte Dedicado 24/7',
            'Consultoría Estratégica Mensual'
        ],
        icon: Shield,
        color: 'from-emerald-500 to-cyan-500',
        glow: 'rgba(16,185,129,0.4)',
        popular: false
    }
];

const faqs = [
    {
        q: '¿Cómo funciona el proceso de pago?',
        a: 'Trabajamos con un esquema 50/50: 50% al iniciar el proyecto y el 50% restante contra entrega y satisfacción final.'
    },
    {
        q: '¿Incluyen mantenimiento?',
        a: 'Sí, todos nuestros desarrollos incluyen 30 días de soporte post-lanzamiento gratuito. Ofrecemos planes de mantenimiento mensual opcionales.'
    },
    {
        q: '¿Cuánto tiempo toma un proyecto?',
        a: 'Depende de la complejidad. Una Landing Page toma aprox. 1 semana, mientras que proyectos más complejos pueden tomar de 4 a 8 semanas.'
    },
    {
        q: '¿Qué necesito para empezar?',
        a: 'Solo tu idea y ganas de crecer. Nosotros te ayudamos a definir requerimientos, textos e imágenes si no los tienes.'
    }
];

const Pricing = () => {
    // FAQ State
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (idx: number) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-darker relative overflow-x-hidden">
            {/* Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticleBackground />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/10"></div>
            </div>

            <div className="relative z-10 pt-32 pb-20 container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20 max-w-4xl mx-auto"
                >
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text font-bold tracking-wider uppercase text-sm mb-4 block">
                        Planes Flexibles
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
                        Inversión inteligente para <br />
                        <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Resultados Reales</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        No vendemos "gastos", creamos activos digitales que pagan su propio retorno. Elige el nivel de aceleración que tu negocio necesita.
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32 relative">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.15 }}
                            whileHover={{ y: -10 }}
                            className={`relative group rounded-3xl p-1 ${plan.popular ? 'scale-105 z-10' : 'scale-100 z-0'}`}
                        >
                            {/* Card Border Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${plan.color} rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-sm`}></div>

                            {/* Card Content */}
                            <div className="relative h-full bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-[22px] p-8 flex flex-col overflow-hidden">
                                {plan.popular && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-[22px]">
                                        MÁS POPULAR
                                    </div>
                                )}

                                {/* Glow Effect inside card */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-white/10 to-transparent rounded-full blur-2xl -mt-16 pointer-events-none"></div>

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-6 shadow-lg shadow-${plan.color.split(' ')[1]}/20`}>
                                    <plan.icon className="text-white w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>

                                <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-gray-300 text-sm font-medium">Desde</span>
                                    <div className={`text-3xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                        {plan.price}
                                    </div>
                                    <span className="text-xs text-gray-500">Dependiendo alcance</span>
                                </div>

                                <ul className="space-y-4 mb-8 flex-grow">
                                    {plan.features.map((feature, fIdx) => (
                                        <li key={fIdx} className="flex items-start gap-3 text-gray-300 text-sm">
                                            <Check className={`w-5 h-5 flex-shrink-0 text-${plan.color.includes('cyan') ? 'cyan' : plan.color.includes('purple') ? 'purple' : 'emerald'}-400`} />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    to="/start-project"
                                    className={`w-full py-4 rounded-xl font-bold text-center transition-all duration-300 relative overflow-hidden group/btn ${plan.popular
                                        ? 'bg-gradient-to-r ' + plan.color + ' text-white shadow-lg hover:shadow-' + plan.color.split(' ')[1] + '/50'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/30'
                                        }`}
                                >
                                    <span className="relative z-10">Cotizar Ahora</span>
                                    {plan.popular && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>}
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Preguntas Frecuentes</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                                >
                                    <span className="font-semibold text-white">{faq.q}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`}
                                    />
                                </button>
                                <AnimatePresence>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <p className="p-6 pt-0 text-gray-400 leading-relaxed border-t border-white/5">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 border-t border-white/10"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">¿Tienes un requerimiento especial?</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                        Entendemos que cada negocio es único. Hablemos y diseñemos una solución exactamente a tu medida.
                    </p>
                    <Link
                        to="/start-project"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-cyan-500/40 hover:scale-105 transition-all"
                    >
                        Agendar Consultoría Gratuita
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default Pricing;

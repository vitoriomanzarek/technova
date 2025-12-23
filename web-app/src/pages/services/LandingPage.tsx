import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Globe, Lock, Code, BarChart,
    Smartphone, Palette, HelpCircle, ChevronDown,
    Zap, Layout, Shield, Search, MousePointerClick
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-blue-500/20 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-medium text-blue-100 group-hover:text-cyan-400 transition-colors">
                    {question}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="w-5 h-5 text-blue-400" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-400 leading-relaxed">
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const LandingPage = () => {
    const comparisonData = [
        {
            title: "Sitio Web Tradicional",
            icon: <Globe className="w-6 h-6 text-gray-400" />,
            features: [
                "Múltiples objetivos y distracciones",
                "Menú de navegación complejo",
                "Información general de la empresa",
                "Baja tasa de conversión (1-3%)"
            ],
            isHighlight: false
        },
        {
            title: "Landing Page TechNova",
            icon: <Zap className="w-6 h-6 text-cyan-400" />,
            features: [
                "Un solo objetivo: VENDER",
                "Sin fugas ni distracciones",
                "Copywriting persuasivo",
                "Alta tasa de conversión (5-15% o más)"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Necesito pagar hosting mensual?",
            a: "El hosting está incluido en nuestros planes de mantenimiento, o podemos configurarlo en tu propia cuenta si prefieres control total. Nosotros nos encargamos de toda la configuración técnica."
        },
        {
            q: "¿Puedo actualizar los textos yo mismo?",
            a: "¡Sí! Podemos integrar un CMS ligero (Gestor de Contenido) para que edites textos e imágenes sin tocar código, o puedes optar por nuestro servicio de mantenimiento donde nosotros hacemos los cambios por ti."
        },
        {
            q: "¿Cuánto tardan en entregar?",
            a: "Una Landing Page profesional suele tomar entre 1 y 2 semanas, dependiendo de la rapidez con la que recibamos tu feedback y material (logo, textos base)."
        },
        {
            q: "¿Incluye correos corporativos?",
            a: "Sí, te ayudamos a configurar correos profesionales con tu dominio (ej: hola@tuempresa.com) para que proyectes una imagen seria desde el primer día."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Landing Pages de Alto Impacto | TechNova Solutions</title>
                <meta name="description" content="Diseñadas científicamente para convertir visitantes en clientes." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-sm"
                    >
                        <Zap className="w-12 h-12 text-cyan-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Landing Pages de <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
                            Alto Impacto
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Diseñadas científicamente para convertir visitantes en clientes.
                        <br />
                        <span className="text-cyan-300 font-semibold">Velocidad, Persuasión y Diseño Premium.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#landing-vs-web"
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Ver la Diferencia <ArrowRight className="w-4 h-4" />
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN: Landing vs Web --- */}
            <section id="landing-vs-web" className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Más que una página bonita</h2>
                        <p className="text-blue-200/60 max-w-2xl mx-auto text-lg">
                            Muchos negocios fallan porque envían tráfico a una web genérica.
                            <br /><span className="text-cyan-400">Tú necesitas una herramienta de ventas.</span>
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {comparisonData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className={`p-8 rounded-3xl border transition-all duration-300 ${item.isHighlight
                                        ? 'bg-blue-900/20 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transform md:-translate-y-4'
                                        : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-cyan-500/20' : 'bg-gray-800'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className={`text-2xl font-bold ${item.isHighlight ? 'text-white' : 'text-gray-400'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                                <ul className="space-y-4">
                                    {item.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {item.isHighlight ? (
                                                <Check className="w-5 h-5 text-cyan-400 mt-1 shrink-0" />
                                            ) : (
                                                <div className="w-5 h-5 flex items-center justify-center mt-1 shrink-0">
                                                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                                                </div>
                                            )}
                                            <span className={item.isHighlight ? 'text-gray-200' : 'text-gray-500'}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN ESTRATEGIA Y DISEÑO --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">La Ciencia de la Persuasión</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Palette className="w-8 h-8 text-pink-400" />,
                                title: "Identidad Visual",
                                desc: "No es solo poner tu logo. Diseñamos una estética que respira los valores de tu marca, usando psicología del color para generar confianza instantánea."
                            },
                            {
                                icon: <Layout className="w-8 h-8 text-cyan-400" />,
                                title: "UX/UI & Wireframes",
                                desc: "Antes de programar, estructuramos el éxito. Creamos prototipos (wireframes) para garantizar que la información fluye lógicamente hacia la venta."
                            },
                            {
                                icon: <Smartphone className="w-8 h-8 text-blue-400" />,
                                title: "100% Responsive",
                                desc: "Tu cliente te ve en el móvil. Tu página debe verse y funcionar perfecta en un iPhone, una tablet o una pantalla 4K. Sin excusas."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-blue-500/10 hover:border-cyan-500/30 transition-colors group"
                            >
                                <div className="mb-6 bg-gray-900/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN TECNOLOGÍA: Under the Hood --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                {/* Background Tech Mesh */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59,130,246,0.5) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }}></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-cyan-400 text-sm font-bold mb-6">
                                <Code className="w-4 h-4" /> Tecnología Avanzada
                            </div>
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                                Motor de Fórmula 1 <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    bajo el capó
                                </span>
                            </h2>
                            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                                Olvida las webs lentas de WordPress. Usamos el stack tecnológico más moderno (React + Tailwind) para una velocidad extrema y seguridad total.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-blue-900/20 rounded-lg h-fit"><BarChart className="w-6 h-6 text-green-400" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Analítica 360°</h4>
                                        <p className="text-gray-400 text-sm">Google Analytics 4 + Meta Pixel para trackear cada visita.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-blue-900/20 rounded-lg h-fit"><MousePointerClick className="w-6 h-6 text-orange-400" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Mapas de Calor (Heatmaps)</h4>
                                        <p className="text-gray-400 text-sm">Vemos exactamente dónde hacen clic y hasta dónde leen tus usuarios con Microsoft Clarity.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="p-3 bg-blue-900/20 rounded-lg h-fit"><Shield className="w-6 h-6 text-purple-400" /></div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Seguridad Blindada</h4>
                                        <p className="text-gray-400 text-sm">Sin bases de datos vulnerables ni plugins desactualizados. SSL incluido.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-[#161B28] to-[#0F1522] border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl"></div>

                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Search className="w-5 h-5 text-cyan-400" /> SEO Técnico
                                </h3>

                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">Core Web Vitals</span>
                                        <span className="text-green-400 font-bold">Passing</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">Performance</span>
                                        <span className="text-green-400 font-bold">98/100</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                        <span className="text-gray-400">Accessibility</span>
                                        <span className="text-green-400 font-bold">100/100</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2">
                                        <span className="text-gray-400">SEO Score</span>
                                        <span className="text-green-400 font-bold">100/100</span>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 text-center uppercase tracking-widest">Powered by TechNova Architecture</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN INFRAESTRUCTURA: Dominio y Hosting --- */}
            <section className="py-24 bg-[#0B0F19] relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">Tu Terreno Digital <Globe className="inline-block ml-2 text-blue-400 mb-1" /></h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Entender la infraestructura web puede ser confuso. Nosotros lo simplificamos con una analogía de bienes raíces:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-blue-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div> Dominio
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Es tu <strong>dirección</strong> (ej: tuempresa.com). Es cómo la gente encuentra tu negocio en el mapa de internet. Te ayudamos a elegir el mejor nombre.
                                </p>
                            </div>
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-blue-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div> Hosting
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Es tu <strong>terreno</strong>. Donde se construye y aloja tu página. Usamos servidores ultra-rápidos para que tu "casa" cargue al instante.
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-blue-500/20">
                            <p className="text-cyan-400 font-medium">✨ Nosotros configuramos todo. Tú solo te preocupas por tu negocio.</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- SECCIÓN PROCESO (Refinado) --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Tu camino al éxito online</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: 1, title: "Estrategia", desc: "Briefing creativo. Definimos objetivo, público y mensaje clave." },
                            { step: 2, title: "Arquitectura", desc: "Wireframes y diseño UX. Estructuramos el contenido visualmente." },
                            { step: 3, title: "Desarrollo", desc: "Código limpio. Implementación de analítica y optimización móvil." },
                            { step: 4, title: "Despegue", desc: "Revisión final, pruebas de carga y lanzamiento oficial." }
                        ].map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent rounded-2xl transform group-hover:-translate-y-2 transition-transform duration-300"></div>
                                <div className="bg-[#0F1522] border border-blue-500/10 p-8 rounded-2xl relative z-10 h-full hover:border-cyan-500/40 transition-colors duration-300">
                                    <div className="text-6xl font-bold text-blue-900/30 absolute top-4 right-4 select-none group-hover:text-blue-500/10 transition-colors">
                                        {step.step}
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-blue-500/20 text-white">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN PRICING (Existente) --- */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión Estimada</h2>
                        <p className="text-blue-200/60 max-w-2xl mx-auto">
                            Todo incluido. Sin sorpresas.
                        </p>
                    </motion.div>

                    <div className="flex justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-blue-500/30 p-10 rounded-3xl max-w-md w-full hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all"></div>

                            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-4">Paquete Estándar</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Landing Page Pro</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">$400 - $800</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent mb-8"></div>

                            <ul className="space-y-4 mb-10">
                                {["Diseño estratégico One-Page", "Dominio + Hosting (1 año)", "Analítica (GA4 + Hotjar/Clarity)", "Integración WhatsApp / Email", "Optimización SEO On-Page"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <a href="#contacto" className="block w-full text-center bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/50 hover:shadow-cyan-500/25">
                                Agendar Consultoría
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN FAQ --- */}
            <section className="py-24 bg-[#05070A] relative">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
                            Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-blue-500/50" />
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LandingPage;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Share2, Target, BarChart2,
    Smartphone, Users, HelpCircle,
    Zap, Youtube, Facebook, Linkedin, Instagram
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-orange-900/30 border border-orange-500/30 text-orange-400 font-bold hover:bg-orange-500/10 hover:border-orange-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const Marketing = () => {
    const comparisonData = [
        {
            title: "Gastar en Publicidad",
            icon: <Target className="w-6 h-6 text-gray-400" />,
            features: [
                "Disparar al aire sin estrategia",
                "'Likes' que no pagan facturas",
                "Sin medición de retorno (ROI)",
                "Pérdida de presupuesto"
            ],
            isHighlight: false
        },
        {
            title: "Invertir en Marketing (TechNova)",
            icon: <BarChart2 className="w-6 h-6 text-orange-400" />,
            features: [
                "Estrategia basada en Dat",
                "Captura de Leads (Clientes potenciales)",
                "ROI medible y optimizable",
                "Crecimiento escalable"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿En qué redes sociales debo estar?",
            a: "Depende de tu audiencia. Analizamos si tus clientes están en Linkedin (B2B), Instagram/TikTok (Visua/Gen Z) o Google (Búsqueda intencional) y enfocamos esfuerzos ahí."
        },
        {
            q: "¿Qué es la captura de Leads?",
            a: "Es el proceso de obtener datos de contacto (nombre, email, teléfono) de personas interesadas. Integramos esto con un CRM para que tu equipo de ventas cierre el trato."
        },
        {
            q: "¿Cómo miden el éxito?",
            a: "No usamos métricas de vanidad. Nos enfocamos en Conversiones: Ventas generadas, llamadas agendadas o formularios completados."
        },
        {
            q: "¿Incluyen creación de contenido?",
            a: "Sí. Diseñamos los anuncios (imágenes/video) y redactamos los copys persuasivos para tus campañas."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Marketing Digital & Growth | TechNova Solutions</title>
                <meta name="description" content="Estrategias de marketing digital en FB, Google, TikTok y Linkedin centradas en ROI y captura de leads." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-orange-500/10 border border-orange-400/20 backdrop-blur-sm"
                    >
                        <Target className="w-12 h-12 text-orange-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Marketing que <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-rose-500">
                            Genera Ventas
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Deja de perseguir likes. Empieza a cerrar negocios.
                        <br />
                        <span className="text-orange-300 font-semibold">Captura de leads, Analítica avanzada y Estrategia Multi-canal.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Escalar mis Ventas <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Gasto vs. Inversión</h2>
                        <p className="text-orange-200/60 max-w-2xl mx-auto text-lg">
                            La diferencia está en la estrategia y la medición.
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
                                        ? 'bg-orange-900/20 border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)] transform md:-translate-y-4'
                                        : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-orange-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-orange-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN ESTRATEGIA Y SOCIAL --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Omnipresencia Estratégica</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Share2 className="w-8 h-8 text-orange-400" />,
                                title: "Redes Sociales",
                                desc: "Presencia dominante donde está tu cliente: Facebook, Instagram, TikTok, LinkedIn y YouTube. Adaptamos el mensaje al canal."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-red-400" />,
                                title: "Captura de Leads",
                                desc: "No queremos solo 'vistas'. Implementamos embudos para capturar emails y teléfonos, alimentando directamente tu CRM."
                            },
                            {
                                icon: <BarChart2 className="w-8 h-8 text-rose-400" />,
                                title: "Data Intelligence",
                                desc: "Comprendemos a tu audiencia con datos duros: Edad, Sexo, Ubicación, Intereses personales y Capacidad Adquisitiva."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-orange-500/10 hover:border-orange-500/30 transition-colors group"
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

            {/* --- SECCIÓN MOBILE FIRST --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Scroll Infinito, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                                    Atención Finita
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                El 90% del consumo de redes sociales es móvil. Tus anuncios deben captar la atención en menos de 1 segundo mientras el usuario hace scroll.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-orange-400" />
                                    Formatos verticales (Stories/Reels).
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-orange-400" />
                                    Carga instantánea de Landing Pages.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Target className="w-5 h-5 text-orange-400" />
                                    Segmentación por dispositivo y SO.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-orange-400 font-bold hover:text-white transition-colors border-b border-orange-400 hover:border-white pb-1"
                            >
                                Dominar redes sociales <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="orange" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN INFRAESTRUCTURA --- */}
            <section className="py-24 bg-[#0B0F19] relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/20 rounded-3xl p-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">Plataformas de Anuncios <Youtube className="inline-block ml-2 text-red-500 mb-1" /></h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Gestionamos tus campañas en los ecosistemas más grandes del mundo.
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 mb-8">
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#080B14] rounded-full border border-orange-500/10 text-gray-300">
                                <Facebook className="w-5 h-5 text-blue-500" /> Meta Ads
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#080B14] rounded-full border border-orange-500/10 text-gray-300">
                                <Linkedin className="w-5 h-5 text-blue-400" /> LinkedIn Ads
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#080B14] rounded-full border border-orange-500/10 text-gray-300">
                                <Youtube className="w-5 h-5 text-red-500" /> YouTube Ads
                            </div>
                            <div className="flex items-center gap-2 px-6 py-3 bg-[#080B14] rounded-full border border-orange-500/10 text-gray-300">
                                <img src="https://www.google.com/favicon.ico" alt="G" className="w-5 h-5 opacity-80" /> Google Ads
                            </div>
                        </div>

                        <SectionCTA text="Lanzar Campaña" />
                    </motion.div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Campañas de Resultados</h2>
                    <p className="text-orange-200/60 max-w-2xl mx-auto mb-16">
                        Planes diseñados para maximizar tu presupuesto publicitario.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-orange-500/30 p-10 rounded-3xl max-w-md w-full hover:border-orange-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all"></div>

                            <div className="text-orange-400 text-sm font-bold tracking-widest uppercase mb-4">Pack Growth</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Gestión Mensual</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$500 - $1,500</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Estrategia Multi-canal", "Diseño de Creativos (Ads)", "Copywriting Persuasivo", "Reporte de ROI Semanal", "Optimización Continua"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-500 hover:to-red-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/50 hover:shadow-orange-500/25"
                            >
                                Empezar a Crecer
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-orange-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="orange" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Marketing;

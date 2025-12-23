import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Bot, MessageSquare, Brain,
    Smartphone, UserCheck, HelpCircle,
    Zap, Code, Globe, Clock
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 font-bold hover:bg-purple-500/10 hover:border-purple-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const Chatbot = () => {
    const comparisonData = [
        {
            title: "Formulario de Contacto",
            icon: <MessageSquare className="w-6 h-6 text-gray-400" />,
            features: [
                "El cliente debe esperar respuesta",
                "Sensación fría e impersonal",
                "Muchos abandonan al ver el form",
                "Solo horario de oficina"
            ],
            isHighlight: false
        },
        {
            title: "Agente AI 24/7 (TechNova)",
            icon: <Bot className="w-6 h-6 text-purple-400" />,
            features: [
                "Respuesta inmediata (0s)",
                "Conversación natural (Como humano)",
                "Resuelve dudas complejas",
                "Atiende 24/7 sin descanso"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Cómo sabe la AI sobre mi negocio?",
            a: "Usamos tecnología RAG (Retrieval-Augmented Generation). Alimentamos el modelo con TUS documentos PDF, web y FAQs para que responda solo con tu información."
        },
        {
            q: "¿Puede agendar citas?",
            a: "Sí. Integramos el bot con Calendly o Google Calendar para que el usuario pueda reservar una reunión directamente en el chat."
        },
        {
            q: "¿Se nota que es un robot?",
            a: "Cada vez menos. Usamos modelos avanzados (como GPT-4) y ajustamos el 'tono de voz' para que suene amigable, profesional y empático, alineado a tu marca."
        },
        {
            q: "¿Dónde se instala?",
            a: "Puede vivir en tu sitio web (burbuja de chat), en WhatsApp Business, en Facebook Messenger o en Instagram DM."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Chatbots AI & Asistentes Virtuales | TechNova Solutions</title>
                <meta name="description" content="Automatiza tu atención al cliente con Inteligencia Artificial. Chatbots que entienden, responden y venden 24/7." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-purple-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-purple-500/10 border border-purple-400/20 backdrop-blur-sm"
                    >
                        <Bot className="w-12 h-12 text-fuchsia-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Tu Mejor Empleado <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-500">
                            Nunca Duerme
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-purple-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Atención al cliente instantánea con Inteligencia Artificial.
                        <br />
                        <span className="text-fuchsia-300 font-semibold">Responde dudas, califica leads y agenda reuniones automáticamente.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Crear mi Chatbot <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Espera vs. Inmediatez</h2>
                        <p className="text-purple-200/60 max-w-2xl mx-auto text-lg">
                            En internet, 5 minutos de espera es una eternidad. No pierdas clientes por lentitud.
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
                                        ? 'bg-purple-900/20 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)] transform md:-translate-y-4'
                                        : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-purple-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-fuchsia-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN CAPACIDADES AI --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Cerebro Artificial, Resultados Reales</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Brain className="w-8 h-8 text-fuchsia-400" />,
                                title: "Entrenamiento Personal",
                                desc: "No usa respuestas genéricas. Entrenamos a la AI con TUS manuales de ventas, políticas y precios."
                            },
                            {
                                icon: <UserCheck className="w-8 h-8 text-purple-400" />,
                                title: "Calificación de Leads",
                                desc: "El bot hace las preguntas clave (presupuesto, urgencia, necesidad) y solo pasa a tu equipo los prospectos calificados."
                            },
                            {
                                icon: <Globe className="w-8 h-8 text-indigo-400" />,
                                title: "Multi-Idioma Aut.",
                                desc: "Si un cliente escribe en inglés, el bot responde en inglés fluido. Atiende a clientes de todo el mundo sin barreras."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-purple-500/10 hover:border-purple-500/30 transition-colors group"
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
                                WhatsApp: El Rey <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                                    de la Conversación
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Todo el mundo usa WhatsApp. Coloca a tu asistente AI ahí y maximiza tus tasas de apertura y respuesta.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <MessageSquare className="w-5 h-5 text-fuchsia-400" />
                                    Respuestas automáticas en WhatsApp.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-fuchsia-400" />
                                    Atención 24/7 sin personal nocturno.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-fuchsia-400" />
                                    Derivación a humano si es necesario.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-white transition-colors border-b border-purple-400 hover:border-white pb-1"
                            >
                                Automatizar mi WhatsApp <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="purple" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión en Futuro</h2>
                    <p className="text-purple-200/60 max-w-2xl mx-auto mb-16">
                        Tecnología de punta accesible para tu negocio.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-purple-500/30 p-10 rounded-3xl max-w-md w-full hover:border-purple-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all"></div>

                            <div className="text-purple-400 text-sm font-bold tracking-widest uppercase mb-4">Pack AI Agent</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Chatbot Personalizado</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$1,500 - $3,500</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Entrenamiento con tus Datos", "Integración Web y WhatsApp", "Personalidad de Marca", "Reporte de Conversaciones", "Ajustes post-lanzamiento"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-fuchsia-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/50 hover:shadow-purple-500/25"
                            >
                                Crear mi AI Agent
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-purple-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="purple" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Chatbot;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Users, MessageSquare, Briefcase,
    Smartphone, Calendar, HelpCircle,
    Zap, Share2, Mail, Clock
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-rose-900/30 border border-rose-500/30 text-rose-400 font-bold hover:bg-rose-500/10 hover:border-rose-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const CRM = () => {
    const comparisonData = [
        {
            title: "Agenda de Papel / Excel",
            icon: <Calendar className="w-6 h-6 text-gray-400" />,
            features: [
                "Olvido de seguimientos",
                "Datos dispersos e inseguros",
                "Sin historial de cliente",
                "Dependencia de la memoria"
            ],
            isHighlight: false
        },
        {
            title: "CRM Inteligente (TechNova)",
            icon: <Users className="w-6 h-6 text-rose-400" />,
            features: [
                "Recordatorios automáticos",
                "Base de datos centralizada",
                "Historial completo de chats",
                "Pipeline de ventas visual"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Qué CRM implementan?",
            a: "Somos agnósticos. Implementamos HubSpot, Salesforce o Pipedrive según tu presupuesto. También desarrollamos CRMs a medida si tienes procesos únicos."
        },
        {
            q: "¿Puedo importar mis contactos de Excel?",
            a: "Sí. Realizamos la migración completa de tu base de datos actual, limpiándola y organizándola para que empieces con el pie derecho."
        },
        {
            q: "¿Se conecta con mi correo?",
            a: "Totalmente. Sincronizamos Gmail o Outlook para que cada correo enviado quede registrado automáticamente en la ficha del cliente."
        },
        {
            q: "¿Es difícil de usar?",
            a: "La adopción es clave. Capacitamos a tu equipo de ventas y configuramos la interfaz para que sea lo más limpia e intuitiva posible."
        }
    ];

    return (
        <>
            <Helmet>
                <title>CRM & Automatización de Ventas | TechNova Solutions</title>
                <meta name="description" content="Organiza tus ventas y no pierdas ni un cliente. Implementación de CRM (HubSpot, Salesforce) y automatización." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-rose-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-rose-500/10 border border-rose-400/20 backdrop-blur-sm"
                    >
                        <Briefcase className="w-12 h-12 text-red-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Ventas Organizadas, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-orange-400">
                            Negocio Escalable
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-rose-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Nunca más olvides llamar a un prospecto.
                        <br />
                        <span className="text-red-300 font-semibold">Centraliza clientes, automatiza seguimientos y cierra más tratos.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-rose-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Organizar mis Ventas <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Caos vs. Sistema</h2>
                        <p className="text-rose-200/60 max-w-2xl mx-auto text-lg">
                            Un vendedor sin CRM pierde el 30% de sus oportunidades por falta de seguimiento.
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
                                        ? 'bg-rose-900/20 border-rose-500/50 shadow-[0_0_30px_rgba(225,29,72,0.15)] transform md:-translate-y-4'
                                        : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-rose-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-red-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN FEATURES CRM --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Tu Máquina de Ventas</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-red-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Zap className="w-8 h-8 text-rose-400" />,
                                title: "Automatización",
                                desc: "Envía correos de bienvenida, seguimiento o cotizaciones automáticamente cuando mueves una tarjeta en el tablero."
                            },
                            {
                                icon: <Mail className="w-8 h-8 text-red-400" />,
                                title: "Email Tracking",
                                desc: "Entérate al instante cuando un cliente abre tu correo o hace clic en tu cotización. Llama en el momento perfecto."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-orange-400" />,
                                title: "Pipeline Visual",
                                desc: "Visualiza en qué etapa está cada negocio: 'Prospecto', 'Contactado', 'Negociación' o 'Cerrado'."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-rose-500/10 hover:border-rose-500/30 transition-colors group"
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

            {/* --- SECCIÓN MOBILE FIRST: VENTAS ON THE GO --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Cierra Ventas <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-400">
                                    Desde el Auto
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Tu equipo comercial vive moviéndose. Dales un CRM móvil para registrar visitas, llamadas y notas de voz al salir de la reunión.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-red-400" />
                                    App móvil intuitiva (iOS/Android).
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <MessageSquare className="w-5 h-5 text-red-400" />
                                    Mandar WhatsApps pre-definidos.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-red-400" />
                                    Agenda sincronizada en tiempo real.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-rose-400 font-bold hover:text-white transition-colors border-b border-rose-400 hover:border-white pb-1"
                            >
                                Probar CRM Móvil <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="rose" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,29,72,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión en Orden</h2>
                    <p className="text-rose-200/60 max-w-2xl mx-auto mb-16">
                        Implementación y capacitación para que tu equipo lo use realmente.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-rose-500/30 p-10 rounded-3xl max-w-md w-full hover:border-rose-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(225,29,72,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all"></div>

                            <div className="text-rose-400 text-sm font-bold tracking-widest uppercase mb-4">Pack Sales Pro</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Setup CRM</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$1,000 - $3,000</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Configuración Pipeline", "Importación de Datos", "Integración con Email", "Automatización Básica", "Capacitación a Equipo"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/50 hover:shadow-rose-500/25"
                            >
                                Implementar CRM
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-rose-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="rose" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default CRM;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, ShieldCheck, RefreshCw, LifeBuoy,
    Smartphone, Lock, HelpCircle,
    Zap, Server, Activity, Wrench
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-cyan-900/30 border border-cyan-500/30 text-cyan-400 font-bold hover:bg-cyan-500/10 hover:border-cyan-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const Support = () => {
    const comparisonData = [
        {
            title: "Web Abandonada",
            icon: <Wrench className="w-6 h-6 text-gray-400" />,
            features: [
                "Plugins desactualizados (Riesgo)",
                "Lenta por falta de limpieza",
                "Sin copias de seguridad",
                "Vulnerable a hackeos"
            ],
            isHighlight: false
        },
        {
            title: "Mantenimiento TechNova",
            icon: <ShieldCheck className="w-6 h-6 text-cyan-400" />,
            features: [
                "Actualizaciones semanales",
                "Optimización de velocidad",
                "Backups diarios en la nube",
                "Monitoreo 24/7"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Qué incluye el mantenimiento?",
            a: "Incluye actualizaciones de plugins y temas, copias de seguridad diarias, monitoreo de seguridad, limpieza de base de datos y soporte técnico prioritario."
        },
        {
            q: "¿Si mi web se cae, qué hacen?",
            a: "Nuestro sistema de monitoreo nos avisa al instante. Procedemos a restaurar la última copia de seguridad funcional en cuestión de minutos."
        },
        {
            q: "¿Puedo pedir cambios en el contenido?",
            a: "Sí. Dependiendo de tu plan, tienes horas de desarrollo incluidas para cambiar textos, imágenes o ajustar secciones sin costo extra."
        },
        {
            q: "¿Me protegen contra virus?",
            a: "Sí. Instalamos firewalls y escáneres de malware para bloquear ataques de fuerza bruta y mantener tu sitio limpio."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Soporte & Mantenimiento Web | TechNova Solutions</title>
                <meta name="description" content="Mantén tu sitio web seguro y rápido. Actualizaciones, backups y soporte técnico 24/7." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-cyan-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-cyan-500/10 border border-cyan-400/20 backdrop-blur-sm"
                    >
                        <LifeBuoy className="w-12 h-12 text-teal-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Tranquilidad <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-500">
                            Digital Total
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-cyan-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Protege tu inversión online.
                        <br />
                        <span className="text-teal-300 font-semibold">Seguridad, Actualizaciones y Soporte Técnico rápido.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Proteger mi Web <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Mantenimiento vs. Desastre</h2>
                        <p className="text-cyan-200/60 max-w-2xl mx-auto text-lg">
                            Un sitio web es como un auto, si no lo mantienes, te dejará tirado.
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
                                        ? 'bg-cyan-900/20 border-cyan-500/50 shadow-[0_0_30px_rgba(34,211,238,0.15)] transform md:-translate-y-4'
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
                                                <Check className="w-5 h-5 text-teal-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN SERVICIOS DETALLADOS --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Tu Equipo de TI Remoto</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <RefreshCw className="w-8 h-8 text-cyan-400" />,
                                title: "Actualizaciones",
                                desc: "Mantenemos el núcleo de tu CMS, plugins y temas siempre en su última versión para evitar brechas de seguridad y mejorar rendimiento."
                            },
                            {
                                icon: <Lock className="w-8 h-8 text-teal-400" />,
                                title: "Seguridad Blindada",
                                desc: "Monitoreo activo contra malware, ataques DDoS e intentos de login fallidos. Dormirás tranquilo sabiendo que estás protegido."
                            },
                            {
                                icon: <Server className="w-8 h-8 text-blue-400" />,
                                title: "Backups Cloud",
                                desc: "Copias de seguridad diarias enviadas a un servidor externo. Si algo falla, podemos restaurar tu sitio en el tiempo."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-cyan-500/10 hover:border-cyan-500/30 transition-colors group"
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

            {/* --- SECCIÓN MOBILE FIRST: RESPONSIVE SUPPORT --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Soporte Humano <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                                    por WhatsApp
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Olvídate de tickets que tardan días en responderse. Nuestros planes incluyen contacto directo para emergencias.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-teal-400" />
                                    Atención prioritaria.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Activity className="w-5 h-5 text-teal-400" />
                                    Reportes mensuales de estado en PDF.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-teal-400" />
                                    Solución rápida de incidentes criticos.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-cyan-400 font-bold hover:text-white transition-colors border-b border-cyan-400 hover:border-white pb-1"
                            >
                                Hablar con un experto <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="cyan" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Tu Seguro Digital</h2>
                    <p className="text-cyan-200/60 max-w-2xl mx-auto mb-16">
                        Planes mensuales para que te dediques a vender, no a arreglar la web.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-cyan-500/30 p-10 rounded-3xl max-w-md w-full hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all"></div>

                            <div className="text-cyan-400 text-sm font-bold tracking-widest uppercase mb-4">Plan Mantenimiento</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Soporte PRO</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$50 / mes</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Backups Diarios", "Actualización Semanal", "Seguridad Malware/Hackeos", "1h de cambios mensuales", "Soporte Prioritario"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-teal-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/50 hover:shadow-cyan-500/25"
                            >
                                Contratar Soporte
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-cyan-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="cyan" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Support;

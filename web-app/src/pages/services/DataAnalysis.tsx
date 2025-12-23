import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, PieChart, Activity, TrendingUp,
    Smartphone, Database, HelpCircle,
    Zap, Share2, Eye
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-fuchsia-900/30 border border-fuchsia-500/30 text-fuchsia-400 font-bold hover:bg-fuchsia-500/10 hover:border-fuchsia-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const DataAnalysis = () => {
    const comparisonData = [
        {
            title: "Decisiones por Intuición",
            icon: <Activity className="w-6 h-6 text-gray-400" />,
            features: [
                "Basadas en 'co-razonadas'",
                "Difícil de justificar a socios",
                "Riesgo alto de error",
                "Sin visión del futuro"
            ],
            isHighlight: false
        },
        {
            title: "Decisiones por Datos (TechNova)",
            icon: <PieChart className="w-6 h-6 text-fuchsia-400" />,
            features: [
                "Basadas en hechos históricos",
                "Dashboards interactivos claros",
                "Predicción de tendencias",
                "Optimización de recursos"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Qué herramientas utilizan?",
            a: "Trabajamos con los líderes de la industria: Power BI (Microsoft), Tableau y Google Looker Studio para visualizaciones web rápidas."
        },
        {
            q: "¿Necesito tener una base de datos?",
            a: "No necesariamente. Podemos conectar tus Dashboards a Excels, Google Sheets, CRMs o cualquier fuente de datos que ya tengas."
        },
        {
            q: "¿Es seguro compartir mis datos?",
            a: "Totalmente. Firmamos acuerdos de confidencialidad (NDA) y utilizamos conexiones encriptadas. Tus datos nunca salen de tu entorno seguro."
        },
        {
            q: "¿Puedo ver los reportes en mi celular?",
            a: "Sí. Diseñamos dashboards 'Mobile First' para que directores y gerentes puedan monitorear KPIs clave desde cualquier lugar."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Análisis de Datos & BI | TechNova Solutions</title>
                <meta name="description" content="Transforma datos en decisiones. Business Intelligence, Dashboards en PowerBI y Tableau." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-900/10 via-transparent to-fuchsia-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-fuchsia-500/10 border border-fuchsia-400/20 backdrop-blur-sm"
                    >
                        <PieChart className="w-12 h-12 text-pink-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Tus Datos Cuentan <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400">
                            Una Historia
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-fuchsia-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Deja de adivinar y empieza a saber.
                        <br />
                        <span className="text-pink-300 font-semibold">Business Intelligence, Dashboards en tiempo real y Predicción de tendencias.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-fuchsia-600 to-pink-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Ver mis Datos <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Intuición vs. Realidad</h2>
                        <p className="text-fuchsia-200/60 max-w-2xl mx-auto text-lg">
                            Lo que no se mide, no se puede mejorar.
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
                                    ? 'bg-fuchsia-900/20 border-fuchsia-500/50 shadow-[0_0_30px_rgba(217,70,239,0.15)] transform md:-translate-y-4'
                                    : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-fuchsia-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-pink-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN DASHBOARDS Y DATA --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Inteligencia de Negocios</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-fuchsia-500 to-pink-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Eye className="w-8 h-8 text-fuchsia-400" />,
                                title: "Visualización Clara",
                                desc: "Transformamos tablas de Excel infinitas en gráficos interactivos que se entienden en 5 segundos."
                            },
                            {
                                icon: <Database className="w-8 h-8 text-pink-400" />,
                                title: "Unificación de Fuentes",
                                desc: "Conectamos tu CRM, web, redes sociales y ERP en un solo lugar. Una sola verdad para toda la empresa."
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-rose-400" />,
                                title: "Predicción",
                                desc: "Analizamos tendencias históricas para proyectar ventas futuras y detectar problemas antes de que ocurran."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-fuchsia-500/10 hover:border-fuchsia-500/30 transition-colors group"
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

                    <SectionCTA text="Centralizar mis Datos" />
                </div>
            </section>

            {/* --- SECCIÓN MOBILE INTELLIGENCE --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Tu Empresa en <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                                    Tiempo Real
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Los directores no están siempre en la oficina. Diseñamos dashboards optimizados para celular para que puedas ver tus KPIs mientras viajas.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-pink-400" />
                                    Acceso móvil seguro 24/7.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-pink-400" />
                                    Alertas automáticas al detectar anomalías.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Share2 className="w-5 h-5 text-pink-400" />
                                    Reportes PDF compartibles en un clic.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-fuchsia-400 font-bold hover:text-white transition-colors border-b border-fuchsia-400 hover:border-white pb-1"
                            >
                                Controlar mi Negocio <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="fuchsia" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,70,239,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Claridad Empresarial</h2>
                    <p className="text-fuchsia-200/60 max-w-2xl mx-auto mb-16">
                        Soluciones de Business Intelligence escalables.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-fuchsia-500/30 p-10 rounded-3xl max-w-md w-full hover:border-fuchsia-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(217,70,239,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-fuchsia-500/20 rounded-full blur-3xl group-hover:bg-fuchsia-500/30 transition-all"></div>

                            <div className="text-fuchsia-400 text-sm font-bold tracking-widest uppercase mb-4">Pack Analytics</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Dashboard Corporativo</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$800 - $1,500</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Integración con Excel/SQL", "Diseño en PowerBI / Looker", "Hasta 3 páginas de reporte", "Vista Móvil Incluida", "Capacitación de Lectura"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-pink-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-900/50 hover:shadow-fuchsia-500/25"
                            >
                                Empezar Análisis
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-fuchsia-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="fuchsia" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default DataAnalysis;

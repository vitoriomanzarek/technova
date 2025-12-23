import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Code2, Database, Smartphone,
    AppWindow, HelpCircle, Zap, Server, Play
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-sky-400 font-bold hover:bg-indigo-500/10 hover:border-indigo-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const WebApp = () => {
    const comparisonData = [
        {
            title: "Hojas de Cálculo (Excel)",
            icon: <Database className="w-6 h-6 text-gray-400" />,
            features: [
                "Propenso a errores humanos",
                "Difícil de compartir en tiempo real",
                "Datos desorganizados y duplicados",
                "Seguridad nula"
            ],
            isHighlight: false
        },
        {
            title: "Software a Medida (TechNova)",
            icon: <Code2 className="w-6 h-6 text-indigo-400" />,
            features: [
                "Automatización de procesos",
                "Acceso multi-usuario controlado",
                "Base de datos centralizada",
                "Encriptación y Backups"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Desarrollan Apps Móviles?",
            a: "¡Sí! Creamos aplicaciones nativas para Android (Google Play) y iOS (App Store), asegurando que tu software esté en el bolsillo de tus usuarios."
        },
        {
            q: "¿Es seguro subir mis datos a la nube?",
            a: "Absolutamente. Usamos encriptación de grado militar y servidores seguros (AWS/Google Cloud) para que tus datos empresariales estén blindados."
        },
        {
            q: "¿Puedo conectar mi software con otros?",
            a: "Sí. Desarrollamos APIs para conectar tu App con sistemas externos como CRMs, facturación electrónica, pasarelas de pago, etc."
        },
        {
            q: "¿Qué pasa si mi empresa crece?",
            a: "Nuestro software es escalable. Arquitectura diseñada para soportar desde 10 empleados hasta miles de usuarios simultáneos sin colapsar."
        }
    ];

    return (
        <>
            <Helmet>
                <title>Desarrollo Web & Apps | TechNova Solutions</title>
                <meta name="description" content="Software a medida que transforma tu negocio. Web Apps y Aplicaciones móviles (Android/iOS)." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/10 via-transparent to-indigo-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-indigo-500/10 border border-indigo-400/20 backdrop-blur-sm"
                    >
                        <Code2 className="w-12 h-12 text-sky-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Software que <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-blue-500">
                            Potencia tu Empresa
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Deja de luchar con Excel.
                        <br />
                        <span className="text-sky-300 font-semibold">Web Apps, Android & iOS diseñadas para operar tu negocio.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-indigo-600 to-sky-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Digitalizar mi Negocio <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Caos vs. Control</h2>
                        <p className="text-indigo-200/60 max-w-2xl mx-auto text-lg">
                            ¿Tu empresa opera en hojas de cálculo frágiles? Es hora de evolucionar.
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
                                    ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)] transform md:-translate-y-4'
                                    : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-indigo-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-sky-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN TECNOLOGÍA --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Ecosistema Multi-Plataforma</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-sky-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <AppWindow className="w-8 h-8 text-sky-400" />,
                                title: "Web Apps Progresivas",
                                desc: "Accede a tu sistema desde cualquier navegador. Sin instalaciones, siempre actualizado y rapidísimo."
                            },
                            {
                                icon: <Smartphone className="w-8 h-8 text-indigo-400" />,
                                title: "Android & iOS",
                                desc: "Aplicaciones nativas publicadas en las tiendas. Aprovecha la cámara, GPS y notificaciones del celular."
                            },
                            {
                                icon: <Database className="w-8 h-8 text-blue-400" />,
                                title: "Datos Centralizados",
                                desc: "Una sola fuente de verdad. Lo que capturas en el celular aparece al instante en la web de administración."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-colors group"
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
                                Potencia en la palma <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-400">
                                    de tu mano
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Tus empleados de campo, vendedores o usuarios no siempre tienen una laptop. Dales herramientas móviles poderosas.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Play className="w-5 h-5 text-sky-400" />
                                    Apps publicadas en Google Play Store.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <AppWindow className="w-5 h-5 text-sky-400" />
                                    Apps publicadas en Apple App Store.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-sky-400" />
                                    Funcionamiento Offline (sin internet).
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-white transition-colors border-b border-indigo-400 hover:border-white pb-1"
                            >
                                Crear mi App Móvil <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="indigo" />
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
                        className="bg-gradient-to-r from-indigo-900/20 to-sky-900/20 border border-indigo-500/20 rounded-3xl p-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">Infraestructura Cloud <Server className="inline-block ml-2 text-indigo-400 mb-1" /></h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Tus datos viven en la misma infraestructura que usan gigantes como Netflix o Airbnb.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-indigo-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-sky-400"></div> API Restful
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Conectividad total. Integra tu sistema con facturación, logística o cualquier software de terceros.
                                </p>
                            </div>
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-indigo-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400"></div> Encriptación
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Seguridad de nivel corporativo. Tus secretos industriales y datos de clientes están a salvo.
                                </p>
                            </div>
                        </div>

                        <SectionCTA text="Desarrollar Software Seguro" />
                    </motion.div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión en Productividad</h2>
                    <p className="text-indigo-200/60 max-w-2xl mx-auto mb-16">
                        Desarrollo a medida que reduce costos operativos y errores.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-indigo-500/30 p-10 rounded-3xl max-w-md w-full hover:border-indigo-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>

                            <div className="text-indigo-400 text-sm font-bold tracking-widest uppercase mb-4">Pack Software a Medida</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Web + Apps</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$2,000 - $5,000</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Panel Web Administrativo", "App Android Nativa", "App iOS Nativa", "Base de Datos Cloud", "Soporte Técnico 1 año"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-500/25"
                            >
                                Empezar Desarrollo
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-indigo-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="indigo" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default WebApp;

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ParticleBackground from '../../components/home/ParticleBackground';

const Marketing = () => {
    const processSteps = [
        { step: 1, title: "Auditoría", desc: "Análisis profundo de tu presencia actual." },
        { step: 2, title: "Estrategia", desc: "Definición de canales, mensajes y KPIs." },
        { step: 3, title: "Ejecución", desc: "Lanzamiento de campañas y contenidos." },
        { step: 4, title: "Optimización", desc: "Ajustes continuos basados en métricas." }
    ];

    const features = [
        "SEO On-Page y Off-Page (Posicionamiento Orgánico)",
        "Campañas SEM (Google Ads, Meta Ads)",
        "Email Marketing y Automatización",
        "Gestión de Redes Sociales (Community Management)",
        "Estrategia de Contenidos (Inbound Marketing)",
        "Informes mensuales de rendimiento detallados"
    ];

    return (
        <>
            <Helmet>
                <title>Marketing Digital 360° | TechNova Solutions</title>
                <meta name="description" content="Estrategias que conectan, enganchan y convierten." />
            </Helmet>

            {/* HERO SECTION - Tema Naranja/Rojo */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />

                {/* Overlay Naranja Sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-900/10 via-transparent to-orange-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl md:text-8xl mb-6 mx-auto block"
                    >
                        🚀
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Marketing Digital <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-amber-500">
                            360°
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-orange-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        No basta con existir, el mundo debe encontrarte.
                        <br />
                        <span className="text-red-300 font-semibold">Visibilidad, Tráfico y Fidelización de Clientes.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#pricing"
                            className="bg-gradient-to-r from-orange-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Ver Planes
                        </a>
                        <Link
                            to="/#servicios"
                            className="border-2 border-orange-500/50 text-orange-400 px-8 py-4 rounded-xl font-bold hover:bg-orange-500/10 hover:border-orange-400 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Volver a Servicios
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 2: CARACTERÍSTICAS */}
            <section className="py-24 bg-gradient-to-b from-[#190F0B] to-[#100604] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            Resultados que se <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-red-400">
                                pueden medir
                            </span>
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Nuestras estrategias integrales de marketing digital están diseñadas para aumentar tu visibilidad, atraer tráfico de calidad y fidelizar a tus clientes. Convertimos likes en ventas y visitantes en embajadores de marca.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 bg-orange-900/10 p-4 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-colors"
                                >
                                    <span className="text-red-400 mt-1">✓</span>
                                    <span className="text-gray-200 text-sm font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors duration-500"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-9xl mb-4 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">📈</div>
                                <div className="text-orange-200 font-mono text-sm tracking-widest uppercase">Growth Hacking</div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-red-500/30 rounded-full animate-ping [animation-duration:3s]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-orange-500/30 rounded-full animate-pulse"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 3: PROCESO */}
            <section className="py-24 bg-gradient-to-b from-[#100604] to-[#190F0B] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ciclo de Crecimiento</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {processSteps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent rounded-2xl transform group-hover:-translate-y-2 transition-transform duration-300"></div>
                                <div className="bg-[#1E120E] border border-orange-500/10 p-8 rounded-2xl relative z-10 h-full hover:border-red-500/40 transition-colors duration-300">
                                    <div className="text-6xl font-bold text-orange-900/30 absolute top-4 right-4 select-none group-hover:text-orange-500/10 transition-colors">
                                        {step.step}
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-orange-500/20">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-red-400 transition-colors">
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

            {/* SECCIÓN 4: INVERSIÓN (PRICING) */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-[#190F0B] to-[#0F0402] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión Estimada</h2>
                        <p className="text-orange-200/60 max-w-2xl mx-auto">
                            Comienza a escalar tu negocio en redes y buscadores.
                        </p>
                    </motion.div>

                    <div className="flex justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#241610] to-[#190F0B] border border-orange-500/30 p-10 rounded-3xl max-w-md w-full hover:border-red-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all"></div>

                            <div className="text-red-400 text-sm font-bold tracking-widest uppercase mb-4">Paquete Crecimiento</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Marketing Starter</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">$800</span>
                                <span className="text-gray-500">/ mes</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-8"></div>

                            <ul className="space-y-4 mb-10">
                                {["Gestión de 2 Redes Sociales", "Estrategia SEO Básica", "1 Campaña de Ads (Setup + Gestión)", "Creación de contenido mensual", "Informe Mensual de Resultados"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <span className="text-orange-400 mt-1 shadow-orange-500/50 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]">●</span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <a href="#contacto" className="block w-full text-center bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/50 hover:shadow-red-500/25">
                                Impulsar mi Marca
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Marketing;

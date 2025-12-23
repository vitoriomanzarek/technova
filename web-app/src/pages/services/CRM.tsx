import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ParticleBackground from '../../components/home/ParticleBackground';

const CRM = () => {
    // Proceso inferido
    const processSteps = [
        { step: 1, title: "Diagnóstico", desc: "Mapeo de tus procesos de venta actuales." },
        { step: 2, title: "Setup", desc: "Configuración técnica del CRM." },
        { step: 3, title: "Migración", desc: "Importación segura de tu base de clientes." },
        { step: 4, title: "Capacitación", desc: "Entrenamiento a tu equipo comercial." }
    ];

    const features = [
        "Configuración inicial experta (HubSpot, Zoho, Salesforce)",
        "Migración y limpieza de bases de datos de clientes",
        "Automatización de flujos de ventas (Pipelines)",
        "Integración con Email Marketing y Sitio Web",
        "Segmentación avanazada de audiencias",
        "Dashboards de rendimiento comercial"
    ];

    return (
        <>
            <Helmet>
                <title>Implementación de CRM | TechNova Solutions</title>
                <meta name="description" content="Gestiona tus relaciones con clientes como un experto." />
            </Helmet>

            {/* HERO SECTION - Tema Rosa/Rojo */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />

                {/* Overlay Rosa Sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-rose-900/10 via-transparent to-rose-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl md:text-8xl mb-6 mx-auto block"
                    >
                        🤝
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Implementación <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-400 to-pink-500">
                            de CRM
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-rose-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Centraliza, organiza y vende más.
                        <br />
                        <span className="text-pink-300 font-semibold">Transforma contactos en clientes leales.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#pricing"
                            className="bg-gradient-to-r from-rose-600 to-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Ver Soluciones
                        </a>
                        <Link
                            to="/#servicios"
                            className="border-2 border-rose-500/50 text-rose-400 px-8 py-4 rounded-xl font-bold hover:bg-rose-500/10 hover:border-rose-400 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Volver a Servicios
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 2: CARACTERÍSTICAS */}
            <section className="py-24 bg-gradient-to-b from-[#1A0A0F] to-[#0F0406] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            Relaciones que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-red-400">
                                valen oro
                            </span>
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Centraliza toda la información de tus clientes en un solo lugar. Implementamos y configuramos sistemas CRM para que tu equipo de ventas cierre más tratos y tu equipo de soporte sea más eficiente.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 bg-rose-900/10 p-4 rounded-lg border border-rose-500/10 hover:border-rose-500/30 transition-colors"
                                >
                                    <span className="text-pink-400 mt-1">✓</span>
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
                        <div className="bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors duration-500"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-9xl mb-4 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]">❤️</div>
                                <div className="text-rose-200 font-mono text-sm tracking-widest uppercase">Customer Love</div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-pink-500/30 rounded-full animate-ping [animation-duration:3s]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-rose-500/30 rounded-full animate-pulse"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 3: PROCESO */}
            <section className="py-24 bg-gradient-to-b from-[#0F0406] to-[#1A0A0F] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Adopción Exitosa</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-rose-500 to-pink-500 mx-auto rounded-full"></div>
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
                                <div className="absolute inset-0 bg-gradient-to-b from-rose-600/10 to-transparent rounded-2xl transform group-hover:-translate-y-2 transition-transform duration-300"></div>
                                <div className="bg-[#1F080C] border border-rose-500/10 p-8 rounded-2xl relative z-10 h-full hover:border-pink-500/40 transition-colors duration-300">
                                    <div className="text-6xl font-bold text-rose-900/30 absolute top-4 right-4 select-none group-hover:text-rose-500/10 transition-colors">
                                        {step.step}
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-rose-500/20">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-pink-400 transition-colors">
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
            <section id="pricing" className="py-24 bg-gradient-to-b from-[#1A0A0F] to-[#0A0204] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(244,63,94,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión Estimada</h2>
                        <p className="text-rose-200/60 max-w-2xl mx-auto">
                            Organización profesional para equipos ambiciosos.
                        </p>
                    </motion.div>

                    <div className="flex justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#240C12] to-[#1A0A0F] border border-rose-500/30 p-10 rounded-3xl max-w-md w-full hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(244,63,94,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-all"></div>

                            <div className="text-pink-400 text-sm font-bold tracking-widest uppercase mb-4">Implementación Starter</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">CRM Profesional</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Desde $1,000</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-rose-500/30 to-transparent mb-8"></div>

                            <ul className="space-y-4 mb-10">
                                {["Configuración de cuenta y usuarios", "Importación de base de contactos", "Diseño de 1 Pipeline de Ventas", "Integración con formularios web", "Capacitación remota de 2 horas"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <span className="text-rose-400 mt-1 shadow-rose-500/50 drop-shadow-[0_0_5px_rgba(244,63,94,0.5)]">●</span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <a href="#contacto" className="block w-full text-center bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/50 hover:shadow-pink-500/25">
                                Organizar Ventas
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CRM;

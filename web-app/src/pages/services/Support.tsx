import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ParticleBackground from '../../components/home/ParticleBackground';

const Support = () => {
    // Proceso inferido
    const processSteps = [
        { step: 1, title: "Onboarding", desc: "Auditoría de seguridad y accesos." },
        { step: 2, title: "Monitoreo", desc: "Vigilancia 24/7 de tus sistemas." },
        { step: 3, title: "Prevención", desc: "Actualizaciones y backups regulares." },
        { step: 4, title: "Soporte", desc: "Resolución prioritaria de incidencias." }
    ];

    const features = [
        "Monitoreo 24/7 de disponibilidad (Uptime)",
        "Actualizaciones de seguridad y plugins críticas",
        "Copias de seguridad diarias (Backups Cloud)",
        "Optimización de velocidad y rendimiento continua",
        "Resolución de incidencias y errores críticos",
        "Asesoría técnica prioritaria por expertos"
    ];

    return (
        <>
            <Helmet>
                <title>Soporte Técnico y Mantenimiento | TechNova Solutions</title>
                <meta name="description" content="Tu tranquilidad tecnológica garantizada." />
            </Helmet>

            {/* HERO SECTION - Tema Cian/Teal */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />

                {/* Overlay Cian Sutil */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/10 via-transparent to-cyan-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-6xl md:text-8xl mb-6 mx-auto block"
                    >
                        🛠️
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Soporte Técnico <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500">
                            y Mantenimiento
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-cyan-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        La tecnología requiere cuidado constante.
                        <br />
                        <span className="text-teal-300 font-semibold">Tu tranquilidad tecnológica garantizada 24/7.</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <a
                            href="#pricing"
                            className="bg-gradient-to-r from-cyan-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Ver Planes
                        </a>
                        <Link
                            to="/#servicios"
                            className="border-2 border-cyan-500/50 text-cyan-400 px-8 py-4 rounded-xl font-bold hover:bg-cyan-500/10 hover:border-cyan-400 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                        >
                            Volver a Servicios
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 2: CARACTERÍSTICAS */}
            <section className="py-24 bg-gradient-to-b from-[#051515] to-[#020D0D] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                            Cero preocupaciones, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-400">
                                máxima eficiencia
                            </span>
                        </h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            Nuestro servicio de soporte asegura que tus sistemas, sitio web o aplicación funcionen siempre a la perfección, previniendo fallos y resolviendo incidencias rápidamente antes de que afecten a tus usuarios.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-3 bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/10 hover:border-cyan-500/30 transition-colors"
                                >
                                    <span className="text-teal-400 mt-1">✓</span>
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
                        <div className="bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-3xl p-8 aspect-square flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
                            <div className="relative z-10 text-center">
                                <div className="text-9xl mb-4 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">🛡️</div>
                                <div className="text-cyan-200 font-mono text-sm tracking-widest uppercase">Seguridad Total</div>
                            </div>

                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-teal-500/30 rounded-full animate-ping [animation-duration:3s]"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border border-cyan-500/30 rounded-full animate-pulse"></div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* SECCIÓN 3: PROCESO */}
            <section className="py-24 bg-gradient-to-b from-[#020D0D] to-[#051515] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Ciclo de Protección</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto rounded-full"></div>
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
                                <div className="absolute inset-0 bg-gradient-to-b from-cyan-600/10 to-transparent rounded-2xl transform group-hover:-translate-y-2 transition-transform duration-300"></div>
                                <div className="bg-[#0A1A1A] border border-cyan-500/10 p-8 rounded-2xl relative z-10 h-full hover:border-teal-500/40 transition-colors duration-300">
                                    <div className="text-6xl font-bold text-cyan-900/30 absolute top-4 right-4 select-none group-hover:text-cyan-500/10 transition-colors">
                                        {step.step}
                                    </div>
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-xl font-bold mb-6 shadow-lg shadow-cyan-500/20">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-teal-400 transition-colors">
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
            <section id="pricing" className="py-24 bg-gradient-to-b from-[#051515] to-[#010808] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 relative z-10"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión Estimada</h2>
                        <p className="text-cyan-200/60 max-w-2xl mx-auto">
                            Soporte técnico profesional por una fracción del costo de un empleado.
                        </p>
                    </motion.div>

                    <div className="flex justify-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#0D2424] to-[#051515] border border-cyan-500/30 p-10 rounded-3xl max-w-md w-full hover:border-teal-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-all"></div>

                            <div className="text-teal-400 text-sm font-bold tracking-widest uppercase mb-4">Mantenimiento Mensual</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Soporte Pro</h3>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">$150</span>
                                <span className="text-gray-500">/ mes</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-8"></div>

                            <ul className="space-y-4 mb-10">
                                {["Soporte Ilimitado vía Ticket", "Backups Diarios en la Nube", "Actualización de Plugins y CMS", "Monitoreo de Seguridad 24/7", "Informe Mensual de Estado"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <span className="text-cyan-400 mt-1 shadow-cyan-500/50 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">●</span>
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <a href="#contacto" className="block w-full text-center bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-cyan-900/50 hover:shadow-teal-500/25">
                                Contratar Soporte
                            </a>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Support;

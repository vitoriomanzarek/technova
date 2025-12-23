import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from './ParticleBackground';
import { Link } from 'react-router-dom';

export const BenefitsSection = () => (
    <section id="beneficios" className="relative py-32 overflow-hidden bg-[#030305]">
        {/* Fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        {/* Elementos decorativos animados de fondo */}
        <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Grid de puntos decorativo */}
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle, rgba(106,13,173,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
        }}></div>

        <div className="container mx-auto px-4 relative z-10">
            {/* Header mejorado */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-block mb-6"
                >
                    <span className="bg-gradient-to-r from-primary via-accent to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(106,13,173,0.6)]">
                        Nuestras Ventajas
                    </span>
                </motion.div>
                <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                    ¿Por qué elegir TechNova?
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Te ofrecemos tecnología avanzada, experiencia en marketing digital y resultados reales.
                </p>
            </motion.div>

            {/* Cards con diseño 3D mejorado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {[
                    {
                        icon: '✨',
                        title: 'Soluciones personalizadas',
                        desc: 'Cada estrategia está diseñada para las necesidades específicas de tu negocio.',
                        gradient: 'from-purple-500/20 to-pink-500/20',
                        glowColor: 'rgba(168,85,247,0.4)',
                        delay: 0
                    },
                    {
                        icon: '📈',
                        title: 'Resultados medibles',
                        desc: 'Maximizamos tu inversión con análisis y métricas claras.',
                        gradient: 'from-blue-500/20 to-cyan-500/20',
                        glowColor: 'rgba(59,130,246,0.4)',
                        delay: 0.2
                    },
                    {
                        icon: '🤝',
                        title: 'Soporte continuo',
                        desc: 'Te acompañamos en cada paso, desde la creación hasta la optimización.',
                        gradient: 'from-emerald-500/20 to-teal-500/20',
                        glowColor: 'rgba(16,185,129,0.4)',
                        delay: 0.4
                    },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: item.delay, type: "spring", bounce: 0.4 }}
                        whileHover={{
                            y: -15,
                            scale: 1.02,
                            transition: { duration: 0.3 }
                        }}
                        className="group relative"
                    >
                        {/* Glow effect de fondo */}
                        <div
                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                            style={{
                                background: `radial-gradient(circle at center, ${item.glowColor}, transparent 70%)`
                            }}
                        ></div>

                        {/* Card principal */}
                        <div className={`relative bg-gradient-to-br ${item.gradient} backdrop-blur-xl border border-white/20 rounded-3xl p-8 h-full shadow-2xl group-hover:border-white/40 transition-all duration-500`}>
                            {/* Efecto de brillo superior */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

                            {/* Background pattern */}
                            <div className="absolute inset-0 opacity-5 rounded-3xl" style={{
                                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}></div>

                            {/* Contenido */}
                            <div className="relative z-10">
                                {/* Icono mejorado */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-8xl mb-8 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] inline-block"
                                >
                                    {item.icon}
                                </motion.div>

                                {/* Título con gradiente */}
                                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
                                    {item.title}
                                </h3>

                                {/* Descripción */}
                                <p className="text-gray-300 leading-relaxed text-base">
                                    {item.desc}
                                </p>

                                {/* Indicador de hover */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "100%" }}
                                    transition={{ delay: item.delay + 0.5, duration: 0.8 }}
                                    className="h-1 bg-gradient-to-r from-accent via-primary to-blue-500 rounded-full mt-6 opacity-50 group-hover:opacity-100 transition-opacity"
                                ></motion.div>
                            </div>

                            {/* Elemento decorativo flotante */}
                            <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Estadísticas adicionales (opcional) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            >
                {[
                    { number: '500+', label: 'Proyectos completados' },
                    { number: '98%', label: 'Clientes satisfechos' },
                    { number: '24/7', label: 'Soporte disponible' },
                    { number: '5★', label: 'Calificación promedio' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                        className="text-center group cursor-default"
                    >
                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                            {stat.number}
                        </div>
                        <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

export const ProjectsSection = () => (
    <section id="proyectos" className="relative py-24 bg-[#030305] overflow-hidden">
        {/* Fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a0b2e] to-transparent pointer-events-none z-10"></div>
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Nuestros Clientes, Nuestros Casos de Éxito
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: 'Landing Page',
                        res: 'Incremento del 40% en leads',
                        image: '/images/case-landing-page.png',
                        hoverGradient: 'from-cyan-500/20 to-blue-500/20',
                        hoverBorder: 'border-cyan-400/50',
                        textGradient: 'from-cyan-400 to-blue-400'
                    },
                    {
                        title: 'Tienda eCommerce',
                        res: 'Ventas duplicadas en 3 meses',
                        image: '/images/case-ecommerce.png',
                        hoverGradient: 'from-purple-500/20 to-pink-500/20',
                        hoverBorder: 'border-purple-400/50',
                        textGradient: 'from-purple-400 to-pink-400'
                    },
                    {
                        title: 'Estrategia SEO',
                        res: 'Posicionamiento Top 3 en Google',
                        image: '/images/case-seo.png',
                        hoverGradient: 'from-emerald-500/20 to-teal-500/20',
                        hoverBorder: 'border-emerald-400/50',
                        textGradient: 'from-emerald-400 to-teal-400'
                    },
                ].map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                    >
                        {/* Imagen del proyecto */}
                        <div className="h-72 overflow-hidden bg-black/30 flex items-center justify-center relative">
                            {/* Overlay con gradiente al hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${p.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <img
                                src={p.image}
                                alt={p.title}
                                className="w-full h-full object-contain scale-85 group-hover:scale-110 transition-transform duration-500 relative z-10"
                            />
                        </div>

                        {/* Contenido */}
                        <div className={`p-6 border-t-2 border-transparent group-hover:${p.hoverBorder} transition-colors duration-300`}>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                                {p.title}
                            </h3>
                            <p className={`bg-gradient-to-r ${p.textGradient} bg-clip-text text-transparent font-medium text-lg`}>
                                {p.res}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const ProcessSection = () => {
    const [hoveredStep, setHoveredStep] = React.useState<number | null>(null);

    return (
        <section id="proceso" className="py-24 bg-[#030305] relative overflow-hidden">
            {/* Background Effects matching Landing Page */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Fixed Particles for consistent parallax feel */}
                <div className="absolute inset-0">
                    <ParticleBackground className="absolute top-0 left-0 w-full h-full opacity-100" />
                </div>

                {/* Overlay Azul Sutil idéntico a Landing Page */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-blue-900/10 pointer-events-none"></div>

                {/* Additional depth overlay */}
                <div className="absolute inset-0 bg-darker/40 mix-blend-multiply"></div>
            </div>

            {/* Content Fade Transitions */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#1a0b2e] to-transparent pointer-events-none z-20"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-20"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                >
                    Nuestro Proceso
                </motion.h2>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Trabajamos de forma colaborativa y estructurada.</p>

                <div className="flex flex-col md:flex-row justify-between relative gap-8">
                    {/* Línea conectora base (estática) */}
                    <div className="hidden md:block absolute top-[40px] left-10 right-10 h-0.5 -z-0">
                        <div className="absolute inset-0 bg-white/10"></div>
                    </div>

                    {[
                        { step: 1, title: 'Análisis', desc: 'Evaluamos tu negocio y necesidades.' },
                        { step: 2, title: 'Estrategia', desc: 'Diseñamos un plan personalizado.' },
                        { step: 3, title: 'Diseño', desc: 'Implementamos soluciones efectivas.' },
                        { step: 4, title: 'Lanzamiento', desc: 'Medimos, optimizamos y escalamos.' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="flex-1 text-center relative z-10"
                            onMouseEnter={() => setHoveredStep(s.step)}
                            onMouseLeave={() => setHoveredStep(null)}
                        >
                            {/* Botón circular con animaciones */}
                            <motion.div
                                whileHover={{ scale: 1.15 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="relative w-20 h-20 mx-auto mb-6 group cursor-pointer"
                            >
                                {/* Glow exterior animado */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 blur-lg"
                                    animate={{
                                        opacity: hoveredStep === s.step ? 0.8 : 0,
                                        scale: hoveredStep === s.step ? 1.3 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Ring exterior brillante */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{
                                        boxShadow: hoveredStep === s.step
                                            ? '0 0 30px rgba(6,182,212,0.8), 0 0 60px rgba(6,182,212,0.4)'
                                            : '0 0 20px rgba(0,212,255,0.2)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Círculo principal */}
                                <motion.div
                                    className="relative w-full h-full bg-dark border-2 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden"
                                    animate={{
                                        borderColor: hoveredStep === s.step ? 'rgba(6,182,212,1)' : 'rgba(0,212,255,0.5)',
                                        backgroundColor: hoveredStep === s.step ? 'rgba(6,182,212,0.1)' : 'rgba(10,10,10,1)',
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Efecto shimmer */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                        animate={{
                                            x: hoveredStep === s.step ? ['-200%', '200%'] : '-200%',
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            ease: "easeInOut",
                                        }}
                                    />

                                    {/* Número */}
                                    <motion.span
                                        className="relative z-10"
                                        animate={{
                                            color: hoveredStep === s.step ? 'rgba(255,255,255,1)' : 'rgba(0,212,255,1)',
                                            textShadow: hoveredStep === s.step
                                                ? '0 0 20px rgba(6,182,212,0.8)'
                                                : 'none',
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {s.step}
                                    </motion.span>
                                </motion.div>
                            </motion.div>

                            {/* Texto */}
                            <motion.h3
                                className="text-xl font-bold mb-2"
                                animate={{
                                    color: hoveredStep === s.step ? 'rgba(6,182,212,1)' : 'rgba(255,255,255,1)',
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {s.title}
                            </motion.h3>
                            <p className="text-gray-400 text-sm px-4">{s.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Process */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 text-center"
                >
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        ¿Listo para llevar tu negocio al siguiente nivel? <span className="text-cyan-400">Optimiza tu flujo de trabajo y escala hoy mismo.</span>
                    </p>
                    <Link
                        to="/start-project"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all uppercase tracking-wider text-sm md:text-base"
                    >
                        Empezar Proyecto
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export const TestimonialsSection = () => (
    <section id="testimonios" className="py-24 bg-[#030305] relative overflow-hidden">
        {/* Fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#1a0b2e] to-transparent pointer-events-none z-20"></div>

        {/* Fondo con partículas flotantes */}
        <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4 text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
                Lo que dicen nuestros clientes
            </motion.h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Resultados reales de empresas que confiaron en nosotros.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        name: 'María González',
                        role: 'CEO, Boutique Fashion',
                        testimony: 'TechNova transformó completamente nuestra presencia digital. En 3 meses incrementamos nuestras ventas online un 150%. Su equipo es profesional y siempre disponible.',
                        rating: 5,
                        avatar: '/images/testimonials/maria.png',
                        gradient: 'from-cyan-500/10 to-blue-500/10',
                        glowColor: 'rgba(6,182,212,0.5)',
                        borderGlow: 'shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                    },
                    {
                        name: 'Carlos Mendoza',
                        role: 'Director de Marketing, InnovaHealth',
                        testimony: 'La estrategia de redes sociales que desarrollaron superó nuestras expectativas. Pasamos de 500 a 15,000 seguidores orgánicos en 6 meses.',
                        rating: 5,
                        avatar: '/images/testimonials/carlos.png',
                        gradient: 'from-purple-500/10 to-pink-500/10',
                        glowColor: 'rgba(168,85,247,0.5)',
                        borderGlow: 'shadow-[0_0_30px_rgba(168,85,247,0.3)]'
                    },
                    {
                        name: 'Ana Martínez',
                        role: 'Fundadora, EcoStore',
                        testimony: 'El diseño de nuestra tienda online es simplemente espectacular. La automatización de procesos nos ahorra 20 horas semanales. ¡Excelente inversión!',
                        rating: 5,
                        avatar: '/images/testimonials/ana.png',
                        gradient: 'from-emerald-500/10 to-teal-500/10',
                        glowColor: 'rgba(16,185,129,0.5)',
                        borderGlow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    },
                ].map((testimonial, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                            delay: idx * 0.15,
                            type: "spring",
                            stiffness: 100,
                            damping: 15
                        }}
                        whileHover={{
                            y: -12,
                            scale: 1.03,
                            transition: { duration: 0.3 }
                        }}
                        className="group relative"
                    >
                        {/* Glow exterior animado */}
                        <div
                            className={`absolute -inset-1 bg-gradient-to-r ${testimonial.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${testimonial.borderGlow}`}
                        ></div>

                        {/* Card principal */}
                        <div className={`relative bg-gradient-to-br ${testimonial.gradient} backdrop-blur-xl border-2 border-white/20 rounded-3xl p-8 h-full shadow-2xl group-hover:border-white/40 transition-all duration-500 overflow-hidden`}>
                            {/* Efecto shimmer/shine que cruza la card */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"
                                    style={{ width: '50%' }}
                                ></div>
                            </div>

                            {/* Brillo superior */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"></div>

                            {/* Partículas flotantes de fondo */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
                                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white rounded-full animate-ping" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
                                <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
                            </div>

                            {/* Contenido */}
                            <div className="relative z-10">
                                {/* Estrellas con animación de brillo */}
                                <div className="flex mb-4 gap-1">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <motion.span
                                            key={i}
                                            initial={{ opacity: 0, scale: 0 }}
                                            whileInView={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.15 + i * 0.1 }}
                                            className="text-yellow-400 text-2xl filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] hover:scale-125 transition-transform cursor-default"
                                        >
                                            ★
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Testimonio */}
                                <p className="text-gray-100 mb-6 italic leading-relaxed text-base font-light">
                                    "{testimonial.testimony}"
                                </p>

                                {/* Avatar y nombre */}
                                <div className="flex items-center gap-4">
                                    {/* Avatar con ring animado */}
                                    <div className="relative">
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-spin" style={{ animationDuration: '3s', padding: '2px' }}></div>
                                        <div className="relative w-14 h-14 rounded-full overflow-hidden bg-dark p-0.5">
                                            <img
                                                src={testimonial.avatar}
                                                alt={testimonial.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="font-bold text-white text-lg bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {testimonial.name}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Decoración de esquina */}
                            <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute -bottom-3 -left-3 w-16 h-16 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const TeamSection = () => (
    <section id="equipo" className="relative py-24 bg-[#030305] overflow-hidden">
        {/* Fade transitions */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0f172a] to-transparent pointer-events-none z-10"></div>
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nuestro Equipo</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Expertos apasionados por la tecnología y el marketing digital.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    {
                        name: 'Alejandro Ruiz',
                        role: 'CEO & Fundador',
                        specialty: 'Estrategia Digital',
                        image: '/images/team/alejandro.png'
                    },
                    {
                        name: 'Sofia Vargas',
                        role: 'CTO',
                        specialty: 'Desarrollo & Automatización',
                        image: '/images/team/sofia.png'
                    },
                    {
                        name: 'David López',
                        role: 'Director de Marketing',
                        specialty: 'SEO & Redes Sociales',
                        image: '/images/team/david.png'
                    },
                    {
                        name: 'Isabella Torres',
                        role: 'Lead Designer',
                        specialty: 'UX/UI & Branding',
                        image: '/images/team/isabella.png'
                    },
                ].map((member, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group"
                    >
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:border-highlight/30 hover:-translate-y-2 transition-all duration-300">
                            <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white/10 shadow-lg group-hover:shadow-2xl group-hover:scale-105 group-hover:border-highlight/50 transition-all duration-300">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                            <p className="text-highlight font-medium mb-2">{member.role}</p>
                            <p className="text-sm text-gray-400">{member.specialty}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

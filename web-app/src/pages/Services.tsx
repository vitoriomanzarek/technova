import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const developmentServices = [
    {
        icon: '📄',
        title: 'Landing Pages',
        description: 'Páginas de aterrizaje optimizadas para convertir visitantes en clientes. Diseño profesional, rápido y efectivo.',
        features: ['Diseño responsive', 'Optimización SEO', 'Formularios integrados'],
        link: '/services/landing-page',
        color: 'from-emerald-500 to-teal-500'
    },
    {
        icon: '🛒',
        title: 'eCommerce',
        description: 'Tu tienda en línea lista para vender. Carrito de compras, pasarelas de pago y gestión de inventario.',
        features: ['Pasarelas de pago', 'Gestión de productos', 'Panel administrativo'],
        link: '/services/ecommerce',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: '📚',
        title: 'LMS',
        description: 'Plataformas de aprendizaje en línea. Cursos, evaluaciones y seguimiento de estudiantes todo en un lugar.',
        features: ['Gestión de cursos', 'Evaluaciones', 'Certificados'],
        link: '/services/lms',
        color: 'from-teal-500 to-cyan-500'
    },
    {
        icon: '💻',
        title: 'Web Apps',
        description: 'Aplicaciones web personalizadas para tu negocio. Automatiza procesos y mejora la productividad.',
        features: ['100% personalizable', 'Escalable', 'Soporte continuo'],
        link: '/services/web-app',
        color: 'from-emerald-600 to-green-500'
    },
];

const solutionServices = [
    {
        icon: '📧',
        title: 'Marketing Digital',
        description: 'Campañas integrales de marketing digital. Email marketing, redes sociales y estrategias de contenido.',
        features: ['Email campaigns', 'Social media', 'Analytics'],
        link: '/services/marketing',
        color: 'from-green-500 to-emerald-600'
    },
    {
        icon: '📊',
        title: 'Data Analysis',
        description: 'Análisis de datos y reportes inteligentes. Toma decisiones basadas en información real.',
        features: ['Dashboards', 'Reportes custom', 'Insights'],
        link: '/services/data-analysis',
        color: 'from-cyan-500 to-teal-600'
    },
    {
        icon: '🛠️',
        title: 'Soporte Técnico',
        description: 'Mantenimiento y asistencia continua. Tu tranquilidad es nuestra prioridad.',
        features: ['24/7 disponible', 'Actualizaciones', 'Backups'],
        link: '/services/support',
        color: 'from-teal-500 to-emerald-500'
    },
    {
        icon: '👥',
        title: 'CRM',
        description: 'Sistema de gestión de relaciones con clientes. Organiza, automatiza y escala tu negocio.',
        features: ['Gestión de leads', 'Automatización', 'Integraciones'],
        link: '/services/crm',
        color: 'from-emerald-500 to-green-600'
    },
    {
        icon: '🤖',
        title: 'Chatbot AI',
        description: 'Asistentes virtuales inteligentes. Atiende a tus clientes 24/7 con IA avanzada.',
        features: ['IA conversacional', 'Integración multi-canal', 'Personalizable'],
        link: '/services/chatbot',
        color: 'from-green-600 to-teal-500'
    },
];

const Services = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F1F1E] to-[#0A0A0A]">
            {/* Hero Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.1),transparent_50%)]"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Nuestros Servicios
                        </h1>
                        <p className="text-xl text-gray-300 mb-8">
                            Soluciones digitales completas para llevar tu negocio al siguiente nivel.
                            Desde desarrollo web hasta inteligencia artificial.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/start-project"
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105"
                            >
                                Empezar Proyecto
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Development Services */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-emerald-400">
                            DESARROLLO
                        </h2>
                        <p className="text-gray-400 max-w-2xl">
                            Creamos experiencias digitales que impulsan tu negocio
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {developmentServices.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link to={service.link} className="block">
                                    <div className="bg-white/5 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-8 h-full hover:border-emerald-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                                                    <span className="text-emerald-400">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="text-emerald-400 font-semibold text-sm uppercase tracking-wide group-hover:text-cyan-400 transition-colors">
                                            Ver Detalles →
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Solution Services */}
            <section className="py-16 relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-cyan-400">
                            SOLUCIONES
                        </h2>
                        <p className="text-gray-400 max-w-2xl">
                            Herramientas y estrategias para optimizar tu operación
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {solutionServices.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <Link to={service.link} className="block">
                                    <div className="bg-white/5 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 h-full hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                                            {service.description}
                                        </p>
                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                                                    <span className="text-cyan-400">✓</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="text-cyan-400 font-semibold text-sm uppercase tracking-wide group-hover:text-emerald-400 transition-colors">
                                            Ver Detalles →
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.15),transparent_70%)]"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            ¿Listo para comenzar?
                        </h2>
                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                            Trabajemos juntos para llevar tu proyecto al siguiente nivel
                        </p>
                        <Link
                            to="/start-project"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 px-10 py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-105"
                        >
                            Iniciar Proyecto →
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Services;

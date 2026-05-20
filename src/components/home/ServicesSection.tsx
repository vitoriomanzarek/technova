"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
    {
        icon: '📄',
        title: 'Landing Pages',
        desc: 'Diseñamos páginas de aterrizaje optimizadas para convertir visitantes en clientes.',
        link: '/services/landing-page',
    },
    {
        icon: '🛒',
        title: 'eCommerce',
        desc: 'Tu tienda en línea lista para vender en pocos días, con todas las funcionalidades esenciales.',
        link: '/services/ecommerce',
    },
    {
        icon: '🔍',
        title: 'SEO & SEM',
        desc: 'Mejora tu visibilidad en línea con estrategias de posicionamiento y campañas pagadas.',
        link: '/services/marketing',
    },
    {
        icon: '📧',
        title: 'Marketing Digital',
        desc: 'Campañas personalizadas para mantener a tus clientes comprometidos.',
        link: '/services/marketing',
    },
];

const ServicesSection = () => {
    return (
        <section id="servicios" className="py-24 bg-[#030305] relative overflow-hidden">
            {/* Gradientes de fondo verde */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.08),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.08),transparent_50%)]"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Nuestras Soluciones Digitales</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        En TechNova Solutions ofrecemos una gama completa de servicios diseñados para llevar tu negocio al siguiente nivel digital.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-emerald-500/20 p-8 rounded-2xl hover:bg-white/10 hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300 text-center group hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]"
                        >
                            <div className="text-4xl mb-6 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4 group-hover:text-emerald-400 transition-colors">{service.title}</h3>
                            <p className="text-gray-400 text-sm mb-6">{service.desc}</p>
                            <Link href={service.link} className="text-emerald-400 font-semibold hover:text-cyan-400 transition-colors text-sm uppercase tracking-wide">
                                Ver Detalles &rarr;
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link href="/servicios" className="inline-block border border-emerald-500 text-emerald-400 px-8 py-3 rounded-lg font-bold hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 uppercase text-sm">
                        Ver todos los servicios
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;






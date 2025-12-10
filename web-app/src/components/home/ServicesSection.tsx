import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        title: 'Email Marketing',
        desc: 'Campañas personalizadas para mantener a tus clientes comprometidos.',
        link: '/services/marketing',
    },
];

const ServicesSection = () => {
    return (
        <section id="servicios" className="py-24 bg-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestras Soluciones Digitales</h2>
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
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-accent hover:-translate-y-2 transition-all duration-300 text-center group"
                        >
                            <div className="text-4xl mb-6 bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                            <p className="text-gray-400 text-sm mb-6">{service.desc}</p>
                            <Link to={service.link} className="text-highlight font-semibold hover:text-white transition-colors text-sm uppercase tracking-wide">
                                Ver Detalles &rarr;
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link to="/services/landing-page" className="inline-block border border-highlight text-highlight px-8 py-3 rounded-lg font-bold hover:bg-highlight/10 transition-colors uppercase text-sm">
                        Ver todos los servicios
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;

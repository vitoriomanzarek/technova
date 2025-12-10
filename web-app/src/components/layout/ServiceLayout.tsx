// import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface ServiceLayoutProps {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    process?: { step: number; title: string; desc: string }[];
    pricing: { title: string; price: string; features: string[] }[];
    ctaText?: string;
    icon?: string;
}

const ServiceLayout = ({
    title,
    subtitle,
    description,
    features,
    process,
    pricing,
    ctaText = "Empezar Proyecto",
    icon = "🚀"
}: ServiceLayoutProps) => {
    return (
        <>
            <Helmet>
                <title>{title} | TechNova Solutions</title>
                <meta name="description" content={subtitle} />
            </Helmet>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-dark overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Link to="/#servicios" className="inline-block mb-8 text-sm text-gray-400 hover:text-white transition-colors">
                        &larr; Volver a Servicios
                    </Link>
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl mb-6"
                    >
                        {icon}
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-6xl font-bold mb-6 font-heading"
                    >
                        {title}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto"
                    >
                        {subtitle}
                    </motion.p>
                </div>
            </section>

            {/* Overview & Features */}
            <section className="py-20 bg-darker">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6 text-highlight">¿Qué incluye este servicio?</h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            {description}
                        </p>
                        <ul className="space-y-4">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="text-accent mt-1">✓</span>
                                    <span className="text-gray-200">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 h-full flex items-center justify-center min-h-[400px]">
                        {/* Placeholder for Service Image/Visual */}
                        <div className="text-center">
                            <div className="text-6xl mb-4 opacity-50">{icon}</div>
                            <p className="text-gray-500 font-mono text-sm">Visualización del Servicio</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process (Optional) */}
            {process && (
                <section className="py-20 bg-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center">Cómo trabajamos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {process.map((step, idx) => (
                                <div key={idx} className="bg-white/5 p-6 rounded-xl border border-white/5 relative">
                                    <div className="text-5xl font-bold text-white/5 absolute top-4 right-4">{step.step}</div>
                                    <h3 className="text-xl font-bold mb-2 text-highlight relative z-10">{step.title}</h3>
                                    <p className="text-gray-400 text-sm relative z-10">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing */}
            <section className="py-20 bg-darker">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-12 text-center">Inversión Estimada</h2>
                    <div className="flex flex-wrap justify-center gap-8">
                        {pricing.map((tier, idx) => (
                            <div key={idx} className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 p-8 rounded-2xl max-w-sm w-full hover:border-accent transition-colors">
                                <h3 className="text-2xl font-bold mb-4">{tier.title}</h3>
                                <div className="text-4xl font-bold text-highlight mb-6">{tier.price}</div>
                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feat, i) => (
                                        <li key={i} className="text-gray-300 text-sm flex gap-2">
                                            <span className="text-accent">•</span> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <a href="/#contacto" className="block w-full text-center bg-primary hover:bg-primary/80 text-white py-3 rounded-lg font-bold transition-colors">
                                    {ctaText}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ServiceLayout;

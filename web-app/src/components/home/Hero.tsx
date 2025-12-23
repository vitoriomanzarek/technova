import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from './ParticleBackground';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
            <ParticleBackground />
            <div className="container mx-auto px-4 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold mb-6 font-heading leading-tight"
                >
                    Impulsa tu presencia digital con <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-accent">
                        soluciones integrales
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
                >
                    Creamos experiencias digitales únicas a través de Landing Pages, eCommerce, SEO & SEM y Marketing Digital. Sencillo. Efectivo. Listo para crecer contigo.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        to="/start-project"
                        className="bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                    >
                        Solicita una consulta gratuita
                    </Link>
                    <Link
                        to="/servicios"
                        className="border-2 border-highlight text-highlight px-8 py-3 rounded-xl font-bold hover:bg-highlight/10 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider"
                    >
                        Descubre nuestros servicios
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

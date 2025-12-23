import { motion } from 'framer-motion';
import { Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NovaAISection = () => {
    return (
        <section className="relative py-32 overflow-hidden bg-[#030305]">
            {/* Animated Background Nebula */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-5xl mx-auto">

                    {/* Main Content Grid */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        {/* Left Side - NOVA Avatar */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative flex justify-center"
                        >
                            {/* Orbiting Particles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="w-80 h-80"
                                >
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `rotate(${i * 45}deg) translateY(-160px)`,
                                            }}
                                            animate={{
                                                scale: [1, 1.5, 1],
                                                opacity: [0.5, 1, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            </div>


                            {/* Central NOVA Orb - Clickeable */}
                            <Link to="/start-project" className="block">
                                <motion.div
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        boxShadow: [
                                            '0 0 60px rgba(0, 212, 255, 0.4), 0 0 120px rgba(125, 47, 189, 0.3)',
                                            '0 0 80px rgba(0, 212, 255, 0.6), 0 0 160px rgba(125, 47, 189, 0.5)',
                                            '0 0 60px rgba(0, 212, 255, 0.4), 0 0 120px rgba(125, 47, 189, 0.3)',
                                        ],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="relative w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-cyan-600 flex items-center justify-center cursor-pointer"
                                >
                                    {/* Inner Glow */}
                                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-300/30 to-purple-400/30 backdrop-blur-xl border border-white/20"></div>

                                    {/* NOVA Text */}
                                    <div className="relative z-10 text-center">
                                        <motion.div
                                            animate={{ rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                        >
                                            <Sparkles className="w-16 h-16 text-white mx-auto mb-2" />
                                        </motion.div>
                                        <h3 className="text-4xl font-bold text-white tracking-wider">NOVA</h3>
                                        <p className="text-cyan-200 text-sm mt-1">AI Assistant</p>
                                    </div>

                                    {/* Pulse Rings */}
                                    <motion.div
                                        animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border-2 border-cyan-400"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                        className="absolute inset-0 rounded-full border-2 border-purple-400"
                                    />
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Right Side - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Question Hook */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-400/30">
                                <Zap className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm text-cyan-400 font-medium">¿No sabes por dónde empezar?</span>
                            </div>

                            {/* Main Headline */}
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                                Conoce a{' '}
                                <span className="text-gradient">NOVA AI</span>
                                <br />
                                <span className="text-gray-400 text-3xl">tu asesor digital inteligente</span>
                            </h2>

                            {/* Description */}
                            <p className="text-lg text-gray-300 leading-relaxed">
                                NOVA AI analiza tu negocio, responde tus preguntas y te guía paso a paso para construir la presencia online perfecta.
                                <span className="text-cyan-400 font-medium"> Disponible 24/7.</span>
                            </p>

                            {/* Benefits List */}
                            <ul className="space-y-3">
                                {[
                                    'Asesoramiento personalizado para tu negocio',
                                    'Respuestas instantáneas a tus dudas',
                                    'Recomendaciones basadas en IA avanzada',
                                ].map((benefit, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="flex items-center gap-3 text-gray-300"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                                            <ArrowRight className="w-3 h-3 text-white" />
                                        </div>
                                        {benefit}
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA Section */}
                            <div className="pt-6">
                                <p className="text-sm text-gray-400 mb-3 tracking-wider uppercase">Conoce</p>

                                {/* Super Shiny Button */}
                                <Link to="/start-project">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="group relative inline-flex items-center gap-3 px-10 py-5 text-xl font-bold text-white overflow-hidden rounded-2xl cursor-pointer"
                                    >
                                        {/* Animated Background Gradient */}
                                        <motion.div
                                            animate={{
                                                background: [
                                                    'linear-gradient(135deg, #00D4FF 0%, #7D2FBD 100%)',
                                                    'linear-gradient(135deg, #7D2FBD 0%, #00D4FF 100%)',
                                                    'linear-gradient(135deg, #00D4FF 0%, #7D2FBD 100%)',
                                                ],
                                            }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                            className="absolute inset-0"
                                        />

                                        {/* Moving Shine Effect */}
                                        <motion.div
                                            animate={{ x: [-200, 400] }}
                                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                            className="absolute inset-0 w-32 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                                        />

                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute inset-0 bg-cyan-400/20 blur-xl"></div>
                                            <div className="absolute inset-0 bg-purple-500/20 blur-xl"></div>
                                        </div>

                                        {/* Pulse Border */}
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="absolute inset-0 rounded-2xl border-2 border-white/50"
                                        />

                                        {/* Button Content */}
                                        <span className="relative z-10 flex items-center gap-3">
                                            NOVA AI
                                            <motion.div
                                                animate={{ x: [0, 5, 0] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            >
                                                <ArrowRight className="w-6 h-6" />
                                            </motion.div>
                                        </span>
                                    </motion.div>
                                </Link>

                                {/* Subtext */}
                                <p className="text-xs text-gray-500 mt-3">
                                    ✨ Comienza una conversación que transformará tu negocio
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-20, -60, -20],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}
        </section>
    );
};

export default NovaAISection;

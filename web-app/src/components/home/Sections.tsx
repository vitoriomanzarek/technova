import { motion } from 'framer-motion';

export const BenefitsSection = () => (
    <section id="beneficios" className="py-24 bg-darker">
        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegir TechNova?</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Te ofrecemos tecnología avanzada, experiencia en marketing digital y resultados reales.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {[
                    { icon: '✨', title: 'Soluciones personalizadas', desc: 'Cada estrategia está diseñada para las necesidades específicas de tu negocio.' },
                    { icon: '📈', title: 'Resultados medibles', desc: 'Maximizamos tu inversión con análisis y métricas claras.' },
                    { icon: '🤝', title: 'Soporte continuo', desc: 'Te acompañamos en cada paso, desde la creación hasta la optimización.' },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="p-6"
                    >
                        <div className="text-6xl mb-6">{item.icon}</div>
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-gray-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const ProjectsSection = () => (
    <section id="proyectos" className="py-24 bg-dark">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Nuestros Clientes, Nuestros Casos de Éxito</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Landing Page Cliente A', res: 'Incremento del 40% en leads', color: 'bg-gradient-to-br from-primary to-blue-600' },
                    { title: 'Tienda eCommerce B', res: 'Ventas duplicadas en 3 meses', color: 'bg-gradient-to-br from-accent to-purple-400' },
                    { title: 'Estrategia SEO C', res: 'Posicionamiento Top 3 en Google', color: 'bg-gradient-to-br from-gray-800 to-gray-600' },
                ].map((p, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                        <div className={`h-48 ${p.color}`}></div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                            <p className="text-highlight font-medium">{p.res}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export const ProcessSection = () => (
    <section id="proceso" className="py-24 bg-darker">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Nuestro Proceso</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Trabajamos de forma colaborativa y estructurada.</p>

            <div className="flex flex-col md:flex-row justify-between relative gap-8">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-[40px] left-10 right-10 h-0.5 bg-white/10 -z-0"></div>

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
                    >
                        <div className="w-20 h-20 bg-dark border-2 border-highlight rounded-full flex items-center justify-center text-2xl font-bold text-highlight mx-auto mb-6 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                            {s.step}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                        <p className="text-gray-400 text-sm px-4">{s.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

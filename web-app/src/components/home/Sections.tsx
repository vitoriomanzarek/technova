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

export const TestimonialsSection = () => (
    <section id="testimonios" className="py-24 bg-dark">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">Resultados reales de empresas que confiaron en nosotros.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        name: 'María González',
                        role: 'CEO, Boutique Fashion',
                        testimony: 'TechNova transformó completamente nuestra presencia digital. En 3 meses incrementamos nuestras ventas online un 150%. Su equipo es profesional y siempre disponible.',
                        rating: 5
                    },
                    {
                        name: 'Carlos Mendoza',
                        role: 'Director de Marketing, InnovaHealth',
                        testimony: 'La estrategia de redes sociales que desarrollaron superó nuestras expectativas. Pasamos de 500 a 15,000 seguidores orgánicos en 6 meses.',
                        rating: 5
                    },
                    {
                        name: 'Ana Martínez',
                        role: 'Fundadora, EcoStore',
                        testimony: 'El diseño de nuestra tienda online es simplemente espectacular. La automatización de procesos nos ahorra 20 horas semanales. ¡Excelente inversión!',
                        rating: 5
                    },
                ].map((testimonial, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-highlight/30 transition-all duration-300"
                    >
                        <div className="flex mb-4">
                            {[...Array(testimonial.rating)].map((_, i) => (
                                <span key={i} className="text-highlight text-xl">★</span>
                            ))}
                        </div>
                        <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.testimony}"</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                                {testimonial.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-white">{testimonial.name}</p>
                                <p className="text-sm text-gray-400">{testimonial.role}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

export const TeamSection = () => (
    <section id="equipo" className="py-24 bg-darker">
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

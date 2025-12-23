import Hero from '../components/home/Hero';
import { Link } from 'react-router-dom';
import NovaAISection from '../components/home/NovaAISection';
import ServicesSection from '../components/home/ServicesSection';
import { BenefitsSection, ProjectsSection, TestimonialsSection, ProcessSection, TeamSection } from '../components/home/Sections';

const Home = () => {
    return (
        <>
            {/* 1. Hero section */}
            <Hero />

            {/* 2. NOVA AI Section */}
            <NovaAISection />

            {/* 3. Servicios */}
            <ServicesSection />

            {/* 4. Por qué elegirnos */}
            <BenefitsSection />

            {/* 5. Proyectos destacados */}
            <ProjectsSection />

            {/* 6. Testimonios */}
            <TestimonialsSection />

            {/* 7. Metodología */}
            <ProcessSection />

            {/* 8. Equipo */}
            <TeamSection />

            {/* 9. Final CTA */}
            <section id="contacto" className="relative py-32 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-cyan-400/30 mb-8">
                            <span className="text-sm text-cyan-400 font-medium">🚀 ¿Listo para el despegue?</span>
                        </div>

                        {/* Headline */}
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Haz crecer tu negocio con{' '}
                            <span className="text-gradient">TechNova</span>
                        </h2>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Ya sea que estés comenzando o buscando mejorar tu presencia digital,
                            <span className="text-cyan-400 font-semibold"> tenemos la solución perfecta para ti.</span>
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                            {/* Primary CTA - Cuéntanos Tu Proyecto */}
                            <Link to="/start-project" className="group relative px-10 py-5 text-lg font-bold text-white overflow-hidden rounded-xl">
                                {/* Animated Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]"></div>

                                {/* Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                                </div>

                                {/* Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl bg-cyan-400/50"></div>

                                {/* Button Text */}
                                <span className="relative z-10 flex items-center gap-2">
                                    Cuéntanos Tu Proyecto
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                        </div>

                        {/* Trust Badge */}
                        <p className="text-sm text-gray-500">
                            ✨ Sin compromiso. Respuesta en menos de 24 horas.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;

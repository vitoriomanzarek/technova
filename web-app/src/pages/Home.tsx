import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import { BenefitsSection, ProjectsSection, TestimonialsSection, ProcessSection, TeamSection } from '../components/home/Sections';

const Home = () => {
    return (
        <>
            {/* 1. Hero section */}
            <Hero />

            {/* 2. Servicios */}
            <ServicesSection />

            {/* 3. Por qué elegirnos */}
            <BenefitsSection />

            {/* 4. Proyectos destacados */}
            <ProjectsSection />

            {/* 5. Testimonios */}
            <TestimonialsSection />

            {/* 6. Metodología */}
            <ProcessSection />

            {/* 7. Equipo */}
            <TeamSection />

            {/* 8. Final CTA */}
            <section id="contacto" className="py-24 text-center">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Haz crecer tu negocio con TechNova</h2>
                    <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">Ya sea que estés comenzando o buscando mejorar tu presencia digital, tenemos la solución perfecta.</p>
                    <div className="flex justify-center gap-4">
                        <button className="bg-gradient-to-r from-primary to-accent px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                            Agenda una consulta
                        </button>
                        <button className="border border-white/20 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
                            Contacta a un experto
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;

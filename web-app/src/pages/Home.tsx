import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import { BenefitsSection, ProjectsSection, ProcessSection } from '../components/home/Sections';

const Home = () => {
    return (
        <>
            <Hero />
            <ServicesSection />
            <BenefitsSection />
            <ProjectsSection />
            <ProcessSection />

            {/* AI Assistant Preview */}
            <section className="py-24 bg-gradient-to-br from-dark to-[#1a052b] border-y border-white/5">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Automatización Inteligente</h2>
                        <p className="text-gray-300 mb-8">Con nuestras herramientas inteligentes, la gestión de tu presencia en línea se vuelve más fácil.</p>
                        <div className="bg-white/5 p-6 rounded-2xl border-l-4 border-highlight max-w-md mx-auto md:mx-0">
                            <p className="font-mono text-highlight">"Hola, ¿cómo puedo ayudarte hoy a mejorar tu presencia en línea?"</p>
                        </div>
                        <button className="mt-8 bg-gradient-to-r from-primary to-accent text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-accent/50 transition-all">
                            Habla con nuestro asistente
                        </button>
                    </div>
                    <div className="flex-1 flex justify-center">
                        {/* Visual Placeholder */}
                        <div className="w-80 h-80 rounded-full bg-radial-gradient from-highlight/20 to-transparent blur-3xl bg-highlight/10 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* CTA */}
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

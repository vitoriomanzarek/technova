import { FileSearch, ArrowRight } from 'lucide-react';

const LeadMagnetSection = () => {
    return (
        <section className="py-24 relative overflow-hidden bg-dark">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 max-w-5xl mx-auto backdrop-blur-sm flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-cyan-900/20">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 text-sm font-bold mb-6">
                            <FileSearch className="w-4 h-4" />
                            Auditoría Web Express Gratis
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">¿Tu sitio web está perdiendo clientes?</h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Déjanos tu correo y analizaremos la velocidad, el SEO y la experiencia de usuario de tu web actual. Te enviaremos un reporte rápido con 3 acciones clave para mejorar hoy mismo.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Tu correo electrónico..." 
                                className="flex-1 bg-dark/50 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                                required
                            />
                            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105 whitespace-nowrap">
                                Quiero mi Auditoría
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4">No enviamos spam. Solo valor real para tu negocio.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LeadMagnetSection;

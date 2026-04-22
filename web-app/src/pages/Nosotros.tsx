import { Target, Eye, Rocket, Users, ShieldCheck, Zap } from 'lucide-react';

const Nosotros = () => {
    return (
        <div className="pt-24 pb-16 overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-dark to-dark pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 font-heading">
                        Conecta con el <span className="text-gradient">Futuro</span> del Espacio Digital
                    </h1>
                    <p className="text-xl text-gray-300 leading-relaxed">
                        En TechNova Solutions somos más que una agencia; somos tu socio estratégico para el crecimiento digital. 
                        Combinamos tecnología avanzada con una visión futurista para ofrecer soluciones integrales.
                    </p>
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-accent/50 transition-all group">
                            <div className="bg-accent/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-accent" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Nuestra Misión</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Ofrecer soluciones digitales integrales que cubran todas las áreas clave para el éxito de un negocio en línea. 
                                Desde desarrollo web hasta estrategias de marketing y análisis de datos, ayudamos a nuestros clientes a construir, 
                                optimizar y hacer crecer su presencia digital de manera efectiva.
                            </p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:border-cyan-400/50 transition-all group">
                            <div className="bg-cyan-400/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Eye className="w-8 h-8 text-cyan-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Nuestra Visión</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Ser una agencia confiable y líder en soluciones digitales integrales, ayudando a empresas y emprendedores a construir, 
                                optimizar y hacer crecer su presencia en línea. Nos enfocamos en estrategias completas y funcionales que aseguran 
                                resultados sostenibles en el entorno digital.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Nuestros Valores</h2>
                        <p className="text-gray-400">El ADN que impulsa cada línea de código y cada estrategia.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { icon: Rocket, title: "Innovación", desc: "Uso de tecnología actualizada y enfoques creativos para resolver problemas." },
                            { icon: ShieldCheck, title: "Confianza", desc: "Relaciones duraderas y transparentes con cada uno de nuestros clientes." },
                            { icon: Zap, title: "Excelencia", desc: "Soluciones de alta calidad que superan las expectativas del mercado." },
                            { icon: Users, title: "Compromiso", desc: "Trabajo colaborativo y dedicación total para alcanzar tus metas comerciales." }
                        ].map((item, index) => (
                            <div key={index} className="bg-gradient-to-b from-white/5 to-transparent border border-white/10 p-6 rounded-xl hover:-translate-y-2 transition-transform">
                                <item.icon className="w-10 h-10 text-cyan-400 mb-4" />
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Nosotros;

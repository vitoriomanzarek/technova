import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contacto = () => {
    return (
        <div className="pt-24 pb-16 overflow-hidden">
            {/* Header */}
            <div className="text-center py-16">
                <h1 className="text-4xl md:text-6xl font-bold mb-4 font-heading">
                    Hablemos de tu <span className="text-gradient">Proyecto</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    ¿Tienes una idea en mente o necesitas ayuda con tu estrategia digital? 
                    Escríbenos y nuestro equipo se pondrá en contacto contigo lo antes posible.
                </p>
            </div>

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    
                    {/* Información de Contacto */}
                    <div className="space-y-8">
                        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                            <h3 className="text-2xl font-bold mb-6">Información de Contacto</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="bg-accent/20 p-3 rounded-lg">
                                        <Mail className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <a href="mailto:hola@technova.com" className="text-lg font-medium hover:text-accent transition-colors">
                                            hola@technova.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-cyan-400/20 p-3 rounded-lg">
                                        <Phone className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Teléfono</p>
                                        <a href="tel:+1234567890" className="text-lg font-medium hover:text-cyan-400 transition-colors">
                                            +1 (234) 567-890
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="bg-purple-500/20 p-3 rounded-lg">
                                        <MapPin className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Ubicación</p>
                                        <p className="text-lg font-medium">
                                            100% Remoto, Global.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Wizard */}
                        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-accent/30 p-8 rounded-2xl text-center">
                            <h4 className="text-xl font-bold mb-3">¿Quieres un presupuesto rápido?</h4>
                            <p className="text-gray-400 mb-6 text-sm">
                                Utiliza nuestro cotizador inteligente y descubre el alcance y costo estimado de tu proyecto en minutos.
                            </p>
                            <a href="/start-project" className="inline-block bg-white text-dark font-bold px-6 py-3 rounded-lg hover:scale-105 transition-transform">
                                Ir al Cotizador
                            </a>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm">
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    placeholder="John Doe"
                                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    placeholder="john@ejemplo.com"
                                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-300">Mensaje</label>
                                <textarea 
                                    rows={4}
                                    placeholder="Cuéntanos un poco más sobre tus necesidades..."
                                    className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all resize-none"
                                ></textarea>
                            </div>

                            <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
                                <Send className="w-5 h-5" />
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contacto;

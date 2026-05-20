import Wizard from '@/components/funnel/Wizard';
import ParticleBackground from '@/components/home/ParticleBackground';

export default function StartProjectPage() {
    return (
        <div className="min-h-screen bg-dark relative flex items-center justify-center pt-20 pb-20">
            {/* Background elements */}
            <div className="absolute inset-0 z-0">
                <ParticleBackground />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Descubre tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Solución Ideal</span>
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Responde 2 preguntas rápidas y te recomendaremos el plan exacto que necesitas para multiplicar tus ventas y optimizar tu negocio.
                    </p>
                </div>

                <Wizard />
            </div>
        </div>
    );
}

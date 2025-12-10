import { useProjectCalculator } from '@/hooks/useProjectCalculator';
import NavigatorLayout from '@/components/navigator/NavigatorLayout';
import { motion } from 'framer-motion';

const StartProject = () => {
    const { state, setAnswer, nextStep, prevStep } = useProjectCalculator();
    const { step, answers, recommendations, totalCost, totalHours } = state;

    return (
        <>
            {step === 1 && (
                <NavigatorLayout currentStep={1} totalSteps={5} title="Infraestructura y Cimientos" onNext={nextStep}>
                    <div className="space-y-6">
                        <p className="text-gray-300 text-lg text-center mb-8">¿Cuál es el estado actual de tu dominio web (el nombre de tu sitio)?</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <OptionCard
                                selected={answers.domainStatus === 'none'}
                                onClick={() => setAnswer('domainStatus', 'none')}
                                icon="🌐"
                                title="No tengo dominio"
                                desc="Necesito ayuda para comprarlo Configurar todo."
                            />
                            <OptionCard
                                selected={answers.domainStatus === 'owned_lost'}
                                onClick={() => setAnswer('domainStatus', 'owned_lost')}
                                icon="🤷‍♂️"
                                title="Lo tengo pero no sé"
                                desc="Tengo el nombre pero no sé acceder a los DNS."
                            />
                            <OptionCard
                                selected={answers.domainStatus === 'owned_ok'}
                                onClick={() => setAnswer('domainStatus', 'owned_ok')}
                                icon="✅"
                                title="Tengo el control"
                                desc="Tengo acceso a mi proveedor de dominios."
                            />
                        </div>
                    </div>
                </NavigatorLayout>
            )}

            {step === 2 && (
                <NavigatorLayout currentStep={2} totalSteps={5} title="Identidad de Marca" onNext={nextStep} onPrev={prevStep}>
                    <div className="space-y-6">
                        <p className="text-gray-300 text-lg text-center mb-8">¿Cuentas con un logotipo y manual de marca?</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <OptionCard
                                selected={answers.brandStatus === 'none'}
                                onClick={() => setAnswer('brandStatus', 'none')}
                                icon="🎨"
                                title="Desde Cero"
                                desc="Necesito que diseñen mi logo y marca."
                            />
                            <OptionCard
                                selected={answers.brandStatus === 'basic'}
                                onClick={() => setAnswer('brandStatus', 'basic')}
                                icon="📂"
                                title="Tengo lo Básico"
                                desc="Tengo mi logo pero no un manual completo."
                            />
                            <OptionCard
                                selected={answers.brandStatus === 'complete'}
                                onClick={() => setAnswer('brandStatus', 'complete')}
                                icon="✨"
                                title="Design System"
                                desc="Tengo todos los archivos editables listos."
                            />
                        </div>
                    </div>
                </NavigatorLayout>
            )}

            {step === 3 && (
                <NavigatorLayout currentStep={3} totalSteps={5} title="Tipo de Proyecto" onNext={nextStep} onPrev={prevStep}>
                    <div className="space-y-8">
                        <div>
                            <p className="text-gray-300 text-lg mb-4">¿Cuál es el objetivo principal?</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <OptionCard
                                    selected={answers.projectType === 'landing'}
                                    onClick={() => setAnswer('projectType', 'landing')}
                                    icon="📄"
                                    title="Landing Page"
                                    desc="Captar leads o presentar información."
                                />
                                <OptionCard
                                    selected={answers.projectType === 'ecommerce'}
                                    onClick={() => setAnswer('projectType', 'ecommerce')}
                                    icon="🛒"
                                    title="Tienda (eCommerce)"
                                    desc="Vender productos con carrito de compras."
                                />
                                <OptionCard
                                    selected={answers.projectType === 'lms'}
                                    onClick={() => setAnswer('projectType', 'lms')}
                                    icon="🎓"
                                    title="Cursos (LMS)"
                                    desc="Vender y gestionar cursos online."
                                />
                                <OptionCard
                                    selected={answers.projectType === 'webapp'}
                                    onClick={() => setAnswer('projectType', 'webapp')}
                                    icon="💻"
                                    title="Web App / SaaS"
                                    desc="Software a medida con funciones complejas."
                                />
                            </div>
                        </div>
                    </div>
                </NavigatorLayout>
            )}

            {step === 4 && (
                <NavigatorLayout currentStep={4} totalSteps={5} title="Funcionalidades Extra" onNext={nextStep} onPrev={prevStep}>
                    <div className="space-y-6">
                        <p className="text-gray-300 text-lg text-center mb-8">¿Qué herramientas adicionales necesitas?</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CheckboxCard
                                checked={answers.features.includes('chatbot')}
                                onChange={() => {
                                    const newFeatures = answers.features.includes('chatbot')
                                        ? answers.features.filter(f => f !== 'chatbot')
                                        : [...answers.features, 'chatbot'];
                                    setAnswer('features', newFeatures);
                                }}
                                icon="🤖"
                                title="Chatbot AI"
                                desc="Asistente virtual 24/7."
                            />
                            <CheckboxCard
                                checked={answers.features.includes('blog')}
                                onChange={() => {
                                    const newFeatures = answers.features.includes('blog')
                                        ? answers.features.filter(f => f !== 'blog')
                                        : [...answers.features, 'blog'];
                                    setAnswer('features', newFeatures);
                                }}
                                icon="✍️"
                                title="Blog de Contenidos"
                                desc="Para estrategia SEO y noticias."
                            />
                        </div>
                    </div>
                </NavigatorLayout>
            )}

            {step === 5 && (
                <NavigatorLayout currentStep={5} totalSteps={5} title="Tu Plan de Vuelo" onNext={() => alert('¡Enviado! Nos pondremos en contacto.')} onPrev={prevStep} canNext={false}>
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-2">Estimación Preliminar</h3>
                            <div className="text-5xl font-bold text-highlight mb-2">${totalCost.toLocaleString()} USD</div>
                            <p className="text-gray-400">Tiempo estimado: {Math.ceil(totalHours / 30)} - {Math.ceil(totalHours / 20)} semanas</p>
                        </div>

                        <div className="bg-black/20 rounded-xl p-6">
                            <h4 className="font-bold mb-4 text-accent">Desglose de Inversión</h4>
                            <ul className="space-y-3">
                                {recommendations.map((item, idx) => (
                                    <li key={idx} className="flex justify-between text-sm border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-400 w-12 text-center">{item.id}</span>
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-mono text-gray-300 min-w-[80px] text-right">${item.cost}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between font-bold text-lg">
                                <span>Total Estimado</span>
                                <span className="text-highlight">${totalCost.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button onClick={() => window.print()} className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                                Descargar PDF
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent rounded-lg font-bold shadow-lg hover:scale-105 transition-transform">
                                Confirmar y Agendar
                            </button>
                        </div>
                    </div>
                </NavigatorLayout>
            )}
        </>
    );
};

// Helper Components
const OptionCard = ({ selected, onClick, icon, title, desc }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`cursor-pointer p-6 rounded-xl border transition-all ${selected ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(106,13,173,0.3)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
    >
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
);

const CheckboxCard = ({ checked, onChange, icon, title, desc }: any) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onChange}
        className={`cursor-pointer p-6 rounded-xl border transition-all flex items-center gap-4 ${checked ? 'bg-accent/20 border-accent' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
    >
        <div className={`w-6 h-6 rounded border flex items-center justify-center ${checked ? 'bg-accent border-accent' : 'border-gray-500'}`}>
            {checked && <span>✓</span>}
        </div>
        <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
        <div className="ml-auto text-2xl">{icon}</div>
    </motion.div>
);

export default StartProject;

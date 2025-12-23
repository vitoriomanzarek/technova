import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
    return (
        <>
            <Helmet>
                <title>Política de Privacidad | TechNova Solutions</title>
                <meta name="description" content="Política de privacidad y protección de datos de TechNova Solutions." />
            </Helmet>

            <section className="pt-32 pb-24 min-h-screen bg-darker">
                <div className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12 text-center"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Política de Privacidad
                        </h1>
                        <p className="text-gray-400">Última actualización: Diciembre 2024</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-[#0F1522] border border-blue-500/10 rounded-2xl p-8 md:p-12 space-y-8 text-gray-300 leading-relaxed text-lg"
                    >
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Recolección de Información</h2>
                            <p>
                                Recopilamos información que usted nos proporciona directamente, como cuando completa un formulario de contacto, se suscribe a nuestro boletín o contrata nuestros servicios. Esta información puede incluir su nombre, dirección de correo electrónico, número de teléfono y detalles de la empresa.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Uso de la Información</h2>
                            <p>
                                Utilizamos la información recopilada para:
                            </p>
                            <ul className="list-disc list-inside mt-4 space-y-2 ml-4">
                                <li>Proveer, mantener y mejorar nuestros servicios.</li>
                                <li>Comunicarnos con usted sobre productos, servicios, ofertas y eventos.</li>
                                <li>Responder a sus comentarios y consultas.</li>
                                <li>Monitorear y analizar tendencias, uso y actividades relacionadas con nuestros servicios.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Protección de Datos</h2>
                            <p>
                                TechNova Solutions toma medidas razonables para ayudar a proteger su información personal contra pérdida, robo, uso indebido y acceso no autorizado, divulgación, alteración y destrucción.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies y Tecnologías Similares</h2>
                            <p>
                                Usamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio y mantener cierta información. Usted puede instruir a su navegador para que rechace todas las cookies o para que le indique cuándo se envía una cookie.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Compartir Información</h2>
                            <p>
                                No compartimos su información personal con terceros, excepto en los siguientes casos: con su consentimiento; para cumplir con las leyes; para proteger nuestros derechos; o con proveedores de servicios de confianza que trabajan en nuestro nombre y están obligados a mantener la confidencialidad.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Derechos del Usuario</h2>
                            <p>
                                Dependiendo de su ubicación, puede tener derechos relacionados con sus datos personales, incluyendo el derecho a acceder, corregir, eliminar o restringir el uso de sus datos personales.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contacto</h2>
                            <p>
                                Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos a través de nuestro sitio web.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Privacy;

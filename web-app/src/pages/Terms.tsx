import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
    return (
        <>
            <Helmet>
                <title>Términos y Condiciones | TechNova Solutions</title>
                <meta name="description" content="Términos y condiciones de uso de los servicios de TechNova Solutions." />
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
                            Términos y Condiciones
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
                            <h2 className="text-2xl font-bold text-white mb-4">1. Introducción</h2>
                            <p>
                                Bienvenido a TechNova Solutions. Al acceder a nuestro sitio web y utilizar nuestros servicios, aceptas cumplir y estar sujeto a los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Servicios</h2>
                            <p>
                                TechNova Solutions ofrece servicios de desarrollo web, marketing digital, implementación de ecommerce y soluciones de software personalizadas. Nos reservamos el derecho de modificar o discontinuar cualquier servicio en cualquier momento sin previo aviso.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Propiedad Intelectual</h2>
                            <p>
                                Todo el contenido, características y funcionalidad (incluyendo pero no limitado a información, software, texto, gráficos, logos e imágenes) son propiedad exclusiva de TechNova Solutions y están protegidos por leyes de derechos de autor internacionales.
                            </p>
                            <p className="mt-4">
                                El código fuente y los entregables finales de los proyectos desarrollados para clientes pasarán a ser propiedad del cliente una vez realizado el pago total acordado, salvo que se especifique lo contrario en el contrato de servicio.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Pagos y Reembolsos</h2>
                            <p>
                                Los términos de pago específicos se detallan en cada propuesta o contrato de servicio. Generalmente, requerimos un anticipo para comenzar el trabajo. Los reembolsos solo se otorgarán según lo estipulado en el acuerdo de servicio específico firmado por ambas partes.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Limitación de Responsabilidad</h2>
                            <p>
                                En ningún caso TechNova Solutions, ni sus directores, empleados, socios o agentes, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad u otras pérdidas intangibles.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Ley Aplicable</h2>
                            <p>
                                Estos Términos se regirán e interpretarán de acuerdo con las leyes vigentes, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contacto</h2>
                            <p>
                                Si tienes alguna pregunta sobre estos Términos, por favor contáctanos a través de nuestro formulario en el sitio web o directamente por correo electrónico.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default Terms;

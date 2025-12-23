import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, Globe, ShoppingCart, CreditCard,
    Smartphone, Palette, HelpCircle,
    Zap, Layout, TrendingUp, Package, ShieldCheck, DollarSign
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 font-bold hover:bg-emerald-500/10 hover:border-emerald-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const Ecommerce = () => {
    const comparisonData = [
        {
            title: "Tienda Física Tradicional",
            icon: <Globe className="w-6 h-6 text-gray-400" />,
            features: [
                "Horario limitado (8-10 horas/día)",
                "Alcance local (solo tu barrio)",
                "Altos costos fijos (Renta, Luz)",
                "Gestión manual de inventario"
            ],
            isHighlight: false
        },
        {
            title: "E-Commerce TechNova",
            icon: <ShoppingCart className="w-6 h-6 text-emerald-400" />,
            features: [
                "Ventas 24/7/365 Automáticas",
                "Alcance Global (Vende a todo el país)",
                "Sin costos de alquiler físico",
                "Control total de Stock y Caja"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Qué pasarelas de pago integran?",
            a: "Integramos las líderes del mercado: Stripe, MercadoPago, PayPal y transferencias directas. Tu dinero llega seguro a tu cuenta."
        },
        {
            q: "¿Es difícil subir productos?",
            a: "Para nada. Te entregamos un panel de control intuitivo donde puedes agregar productos, fotos, precios y stock en minutos."
        },
        {
            q: "¿Cómo calculo los envíos?",
            a: "Automatizamos el cálculo según peso y destino. Podemos integrar APIs de paqueterías (DHL, FedEx) o configurar tarifas fijas."
        },
        {
            q: "¿Es seguro para mis clientes?",
            a: "Totalmente. Implementamos encripción SSL (el candado verde) y cumplimos con estándares de seguridad para que compren con confianza."
        }
    ];

    return (
        <>
            <Helmet>
                <title>E-Commerce & Tiendas Online | TechNova Solutions</title>
                <meta name="description" content="Vende 24/7 con una tienda online optimizada para ventas y gestión total." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-transparent to-emerald-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-400/20 backdrop-blur-sm"
                    >
                        <ShoppingCart className="w-12 h-12 text-emerald-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Tu Tienda Abierta <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-teal-500">
                            24 Horas al Día
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-emerald-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Convierte visitantes en compradores recurrentes.
                        <br />
                        <span className="text-emerald-300 font-semibold">Pagos seguros, gestión de envíos y control total de tu negocio.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Crear mi Tienda <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Negocio Local vs. Global</h2>
                        <p className="text-emerald-200/60 max-w-2xl mx-auto text-lg">
                            No te limites a vender solo a quienes pasan por tu calle.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {comparisonData.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className={`p-8 rounded-3xl border transition-all duration-300 ${item.isHighlight
                                        ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] transform md:-translate-y-4'
                                        : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-emerald-500/20' : 'bg-gray-800'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className={`text-2xl font-bold ${item.isHighlight ? 'text-white' : 'text-gray-400'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                                <ul className="space-y-4">
                                    {item.features.map((feat, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            {item.isHighlight ? (
                                                <Check className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
                                            ) : (
                                                <div className="w-5 h-5 flex items-center justify-center mt-1 shrink-0">
                                                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                                                </div>
                                            )}
                                            <span className={item.isHighlight ? 'text-gray-200' : 'text-gray-500'}>
                                                {feat}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN GESTIÓN Y TECNOLOGÍA --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Control Total de tu Negocio</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Package className="w-8 h-8 text-emerald-400" />,
                                title: "Inventario Inteligente",
                                desc: "Olvídate de contar cajas. Tu stock se actualiza automáticamente con cada venta. Recibe alertas cuando queda poco producto."
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-teal-400" />,
                                title: "Flujo de Caja Real",
                                desc: "Dashboard financiero integrado. Visualiza ingresos diarios, productos más vendidos y márgenes de ganancia al instante."
                            },
                            {
                                icon: <CreditCard className="w-8 h-8 text-green-400" />,
                                title: "Pasarelas de Pago",
                                desc: "Acepta tarjetas de crédito, débito, transferencias y efectivo. Integración fluida con Stripe, MercadoPago y PayPal."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 transition-colors group"
                            >
                                <div className="mb-6 bg-gray-900/50 w-16 h-16 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN MOBILE FIRST: RESPONSIVE --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Tu Tienda en el <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                                    Bolsillo del Cliente
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                El 73% de las compras online se realizan desde un celular. Diseñamos una experiencia de compra fluida y adictiva para dispositivos móviles.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-emerald-400" />
                                    Checkout optimizado en un clic.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                    Catálogo ultra-rápido.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Layout className="w-5 h-5 text-emerald-400" />
                                    Navegación intuitiva por categorías.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-emerald-400 font-bold hover:text-white transition-colors border-b border-emerald-400 hover:border-white pb-1"
                            >
                                Quiero vender en móvil <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="emerald" />
                        </div>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN INFRAESTRUCTURA --- */}
            <section className="py-24 bg-[#0B0F19] relative">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-500/20 rounded-3xl p-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">Seguridad Bancaria <ShieldCheck className="inline-block ml-2 text-emerald-400 mb-1" /></h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Tanto para ti como para tus clientes. Garantizamos transacciones encriptadas y protección de datos.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-emerald-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-400"></div> Certificado SSL
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    El "Candado Verde" que le dice a tus clientes que su tarjeta está segura. Incluido.
                                </p>
                            </div>
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-emerald-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-teal-400"></div> Envíos Automatizados
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Calculadoras de envío en tiempo real y generación de guías para acelerar tu logística.
                                </p>
                            </div>
                        </div>

                        <SectionCTA text="Asegurar mi E-Commerce" />
                    </motion.div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Inversión Inteligente</h2>
                    <p className="text-emerald-200/60 max-w-2xl mx-auto mb-16">
                        Recupera tu inversión con tus primeras ventas.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-emerald-500/30 p-10 rounded-3xl max-w-md w-full hover:border-emerald-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all"></div>

                            <div className="text-emerald-400 text-sm font-bold tracking-widest uppercase mb-4">Pack E-Commerce</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Tienda Completa</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$1,200 - $2,500</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Catálogo Ilimitado", "Pasarelas de Pago Configuradas", "Panel de Administración", "Integración Envíos", "Capacitación de Uso"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/50 hover:shadow-emerald-500/25"
                            >
                                Empezar a Vender
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-emerald-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="emerald" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Ecommerce;

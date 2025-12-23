import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
    Check, ArrowRight, GraduationCap, Users, Video,
    Smartphone, Award, HelpCircle,
    BookOpen, Clock, Shield
} from 'lucide-react';
import ParticleBackground from '../../components/home/ParticleBackground';
import DeviceMockup from '../../components/shared/DeviceMockup';
import AccordionItem from '../../components/shared/AccordionItem';

const SectionCTA = ({ text = "Iniciar Proyecto" }) => (
    <div className="flex justify-center mt-12">
        <Link
            to="/start-project"
            className="group flex items-center gap-2 px-8 py-3 rounded-full bg-violet-900/30 border border-violet-500/30 text-amber-400 font-bold hover:bg-violet-500/10 hover:border-violet-400 hover:scale-105 transition-all duration-300"
        >
            {text} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    </div>
);

const LMS = () => {
    const comparisonData = [
        {
            title: "Cursos Presenciales / Zoom",
            icon: <Users className="w-6 h-6 text-gray-400" />,
            features: [
                "Horario fijo y rígido",
                "Ingresos limitados por tu tiempo",
                "Gestión manual de pagos",
                "Difícil de escalar"
            ],
            isHighlight: false
        },
        {
            title: "Academia Digital (LMS)",
            icon: <GraduationCap className="w-6 h-6 text-violet-400" />,
            features: [
                "Disponible 24/7 para el alumno",
                "Ingresos Pasivos y Escalables",
                "Cobros automáticos",
                "Certificación inmediata"
            ],
            isHighlight: true
        }
    ];

    const faqs = [
        {
            q: "¿Cómo evalúo a mis alumnos?",
            a: "El sistema permite crear exámenes tipo quiz, tareas entregables y foros de discusión. Puedes configurar la calificación automática o manual."
        },
        {
            q: "¿Qué pasa con los certificados?",
            a: "¡Automáticos! Al completar un curso, el sistema genera un PDF personalizado con tu logo, firma y el nombre del alumno listo para descargar."
        },
        {
            q: "¿Puedo tener múltiples instructores?",
            a: "Sí. Puedes asignar roles de 'Profesor' para que otros suban su contenido sin tener acceso a la administración total de la plataforma."
        },
        {
            q: "¿El contenido está seguro?",
            a: "Implementamos medidas para evitar descargas no autorizadas de video y controlamos el acceso concurrente para proteger tu propiedad intelectual."
        }
    ];

    return (
        <>
            <Helmet>
                <title>LMS & Plataformas Educativas | TechNova Solutions</title>
                <meta name="description" content="Crea tu propia academia online. Gestión de alumnos, certificados automáticos y pagos integrados." />
            </Helmet>

            {/* --- HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20">
                <ParticleBackground className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 via-transparent to-violet-900/10 pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="mb-6 mx-auto inline-block p-4 rounded-full bg-violet-500/10 border border-violet-400/20 backdrop-blur-sm"
                    >
                        <GraduationCap className="w-12 h-12 text-amber-400" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-7xl font-bold mb-6 font-heading leading-tight"
                    >
                        Tu Propia Universidad <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-amber-400">
                            Digital
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-2xl text-violet-100 max-w-3xl mx-auto mb-10 leading-relaxed"
                    >
                        Monetiza tu conocimiento.
                        <br />
                        <span className="text-amber-300 font-semibold">Cursos ilimitados, gestión de alumnos y certificados automáticos.</span>
                    </motion.p>

                    <div className="flex justify-center">
                        <Link
                            to="/start-project"
                            className="bg-gradient-to-r from-violet-600 to-amber-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all text-sm md:text-base uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            Lanzar mi Academia <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- SECCIÓN EDUCACIÓN --- */}
            <section className="py-24 bg-gradient-to-b from-[#0B0F19] to-[#080B14] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">De Instructor a Empresario</h2>
                        <p className="text-violet-200/60 max-w-2xl mx-auto text-lg">
                            Deja de intercambiar tiempo por dinero. Construye un activo digital.
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
                                    ? 'bg-violet-900/20 border-violet-500/50 shadow-[0_0_30px_rgba(139,92,246,0.15)] transform md:-translate-y-4'
                                    : 'bg-[#0F1522]/50 border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl ${item.isHighlight ? 'bg-violet-500/20' : 'bg-gray-800'}`}>
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
                                                <Check className="w-5 h-5 text-amber-400 mt-1 shrink-0" />
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

            {/* --- SECCIÓN GESTIÓN ACADÉMICA --- */}
            <section className="py-24 bg-[#080B14] relative">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Experiencia de Aprendizaje Premium</h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-violet-500 to-amber-500 mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Award className="w-8 h-8 text-amber-400" />,
                                title: "Certificados con Tu Marca",
                                desc: "Generación automática de diplomas al finalizar el curso. Valida el conocimiento de tus alumnos bajo tu propia institución."
                            },
                            {
                                icon: <BookOpen className="w-8 h-8 text-violet-400" />,
                                title: "Planes Personalizados",
                                desc: "Estructura el contenido por módulos, lecciones y quizzes. Libera contenido por goteo (drip content) semana a semana."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-fuchsia-400" />,
                                title: "Gestión Total",
                                desc: "Panel para maestros y alumnos. Sigue el progreso individual, revisa tareas y gestiona las inscripciones fácilmente."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="bg-[#0F1522] p-8 rounded-2xl border border-violet-500/10 hover:border-violet-500/30 transition-colors group"
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

            {/* --- SECCIÓN MOBILE FIRST: LEARNING ON THE GO --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#0B0F19] relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Aprende donde sea, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-amber-400">
                                    cuando sea.
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                Tus alumnos no siempre están frente al PC. Nuestra plataforma permite estudiar desde el celular en el transporte, en el sofá o en un café.
                            </p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Smartphone className="w-5 h-5 text-amber-400" />
                                    Interfaz móvil 100% adaptada.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Video className="w-5 h-5 text-amber-400" />
                                    Reproductor de video optimizado.
                                </li>
                                <li className="flex items-center gap-3 text-gray-300">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                    Progreso guardado automáticamente.
                                </li>
                            </ul>

                            <Link
                                to="/start-project"
                                className="inline-flex items-center gap-2 text-violet-400 font-bold hover:text-white transition-colors border-b border-violet-400 hover:border-white pb-1"
                            >
                                Crear Experiencia Móvil <ArrowRight className="w-4 h-4" />
                            </Link>
                        </motion.div>

                        <div className="relative">
                            <DeviceMockup color="violet" />
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
                        className="bg-gradient-to-r from-violet-900/20 to-amber-900/20 border border-violet-500/20 rounded-3xl p-10 max-w-4xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-6">Infraestructura Robusta <Shield className="inline-block ml-2 text-violet-400 mb-1" /></h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Soporta desde 10 hasta 10,000 alumnos simultáneos sin interrupciones.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-violet-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-400"></div> Video Hosting
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Streaming de alta velocidad adaptable a la conexión del usuario.
                                </p>
                            </div>
                            <div className="bg-[#080B14] p-6 rounded-2xl border border-violet-500/10">
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-violet-400"></div> Escalabilidad
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Crece sin miedo. Tu plataforma aguantará picos de tráfico de lanzamientos.
                                </p>
                            </div>
                        </div>

                        <SectionCTA text="Escalar mi Negocio Educativo" />
                    </motion.div>
                </div>
            </section>

            {/* --- PRICING --- */}
            <section className="py-24 bg-gradient-to-b from-[#080B14] to-[#05070A] relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] [mask-image:linear-gradient(to_bottom,transparent,black_20%)]"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Invierte en tu Academia</h2>
                    <p className="text-violet-200/60 max-w-2xl mx-auto mb-16">
                        Un activo que te generará ingresos recurrentes por años.
                    </p>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-b from-[#161B28] to-[#0F1522] border border-violet-500/30 p-10 rounded-3xl max-w-md w-full hover:border-violet-400 transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)] group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all"></div>

                            <div className="text-violet-400 text-sm font-bold tracking-widest uppercase mb-4">Pack Academia PRO</div>
                            <h3 className="text-3xl font-bold mb-2 text-white">Plataforma LMS</h3>
                            <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-8">$1,500 - $3,000</div>

                            <ul className="space-y-4 mb-10 text-left">
                                {["Usuarios Ilimitados", "Certificados PDF Automáticos", "Quizzes y Evaluaciones", "Pasarela de Pagos", "Diseño Personalizado"].map((feat, i) => (
                                    <li key={i} className="text-gray-300 flex gap-3 items-start">
                                        <Check className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to="/start-project"
                                className="block w-full text-center bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-violet-900/50 hover:shadow-violet-500/25"
                            >
                                Empezar mi Academia
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* --- FAQ --- */}
            <section className="py-24 bg-[#05070A]">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
                        Preguntas Frecuentes <HelpCircle className="w-8 h-8 text-violet-500/50" />
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <AccordionItem key={idx} question={faq.q} answer={faq.a} color="violet" />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

export default LMS;

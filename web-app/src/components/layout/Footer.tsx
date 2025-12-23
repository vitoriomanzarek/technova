import { Link } from 'react-router-dom';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { useState, useRef } from 'react';

const Footer = () => {
    const [mouseX, setMouseX] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const footerRef = useRef<HTMLElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (footerRef.current) {
            const rect = footerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = (x / rect.width) * 100;
            setMouseX(percentage);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <footer
            ref={footerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative bg-[#050505] border-t border-transparent overflow-hidden"
        >
            {/* Gradient Border Effect */}
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
                {/* Base dim line */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-purple-600/20"></div>

                {/* Interactive glowing line that follows mouse */}
                <div
                    className="absolute top-0 left-0 h-full transition-all duration-300 ease-out"
                    style={{
                        width: isHovering ? `${mouseX}%` : '0%',
                        background: 'linear-gradient(90deg, rgba(0, 212, 255, 0) 0%, rgba(0, 212, 255, 0.8) 50%, rgba(0, 212, 255, 1) 100%)',
                        boxShadow: isHovering ? '0 0 20px rgba(0, 212, 255, 0.8), 0 0 40px rgba(0, 212, 255, 0.4)' : 'none',
                    }}
                ></div>
            </div>

            <div className="container mx-auto px-6 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Company Info */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gradient mb-2">TechNova</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Conectando tu negocio con el futuro digital
                            </p>
                        </div>

                        {/* Social Media Icons */}
                        <div className="flex gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                                aria-label="GitHub"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                                aria-label="LinkedIn"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="mailto:info@technova.com"
                                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-400/20"
                                aria-label="Email"
                            >
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Development Services */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Desarrollo
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/services/landing-page"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Landing Page
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/ecommerce"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    E-commerce
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/lms"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    LMS
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/web-app"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Aplicación Web
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Solutions */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Soluciones
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/services/marketing"
                                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Marketing Digital
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/data-analysis"
                                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Análisis de Datos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/support"
                                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Soporte Técnico
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/crm"
                                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    CRM
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/services/chatbot"
                                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Chatbot IA
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 relative inline-block">
                            Navegación
                            <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-transparent"></div>
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/servicios"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Todos los Servicios
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/start-project"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Empezar Proyecto
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="/#proyectos"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Proyectos
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/#contacto"
                                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 text-sm hover:translate-x-1 inline-block"
                                >
                                    Contacto
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col md:flex-row gap-4 text-center md:text-left">
                            <p className="text-gray-500 text-sm">
                                © {new Date().getFullYear()} TechNova. Todos los derechos reservados.
                            </p>
                            <div className="hidden md:block w-px h-4 bg-gray-800 self-center"></div>
                            <div className="flex gap-4 justify-center md:justify-start text-sm">
                                <Link to="/terminos" className="text-gray-600 hover:text-cyan-400 transition-colors">Términos</Link>
                                <Link to="/privacidad" className="text-gray-600 hover:text-cyan-400 transition-colors">Privacidad</Link>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm flex items-center gap-2">
                            Hecho con <span className="text-cyan-400 animate-pulse">💙</span> y tecnología espacial
                        </p>
                    </div>
                </div>
            </div>

            {/* Subtle Background Glow */}
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </footer>
    );
};

export default Footer;

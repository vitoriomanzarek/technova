import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const serviceLinks = {
        development: [
            { name: 'Landing Pages', href: '/services/landing-page' },
            { name: 'eCommerce', href: '/services/ecommerce' },
            { name: 'LMS', href: '/services/lms' },
            { name: 'Web Apps', href: '/services/web-app' },
        ],
        additional: [
            { name: 'Marketing Digital', href: '/services/marketing' },
            { name: 'Data Analysis', href: '/services/data-analysis' },
            { name: 'Soporte Técnico', href: '/services/support' },
            { name: 'CRM', href: '/services/crm' },
            { name: 'Chatbot AI', href: '/services/chatbot' },
        ]
    };

    return (
        <header
            className={clsx(
                'fixed w-full top-0 z-50 transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-dark/95 backdrop-blur-md border-white/10 py-2 shadow-lg'
                    : 'bg-transparent border-transparent py-4'
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="TechNova" className="h-[70px] w-auto transform transition hover:scale-105" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {/* Services Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-gray-300 hover:text-highlight transition-colors font-medium text-sm lg:text-base py-4">
                            Servicios
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform"><path d="m6 9 6 6 6-6" /></svg>
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[500px] bg-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-highlight font-heading font-bold mb-4 uppercase text-xs tracking-wider">Desarrollo</h4>
                                <ul className="space-y-2">
                                    {serviceLinks.development.map(link => (
                                        <li key={link.name}>
                                            <Link to={link.href} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all block text-sm">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-accent font-heading font-bold mb-4 uppercase text-xs tracking-wider">Soluciones</h4>
                                <ul className="space-y-2">
                                    {serviceLinks.additional.map(link => (
                                        <li key={link.name}>
                                            <Link to={link.href} className="text-gray-300 hover:text-white hover:translate-x-1 transition-all block text-sm">
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <a href="/#beneficios" className="text-gray-300 hover:text-highlight transition-colors font-medium text-sm lg:text-base">Beneficios</a>
                    <a href="/#proyectos" className="text-gray-300 hover:text-highlight transition-colors font-medium text-sm lg:text-base">Proyectos</a>
                    <a href="/#proceso" className="text-gray-300 hover:text-highlight transition-colors font-medium text-sm lg:text-base">Proceso</a>

                    <Link
                        to="/start-project"
                        className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg font-bold shadow-[0_4px_15px_rgba(106,13,173,0.3)] hover:shadow-[0_6px_20px_rgba(106,13,173,0.5)] hover:-translate-y-0.5 transition-all text-sm lg:text-base uppercase tracking-wide"
                    >
                        Empezar
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? '✖' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-lg border-b border-white/10 overflow-hidden shadow-2xl">
                    <div className="flex flex-col p-4">
                        {/* Mobile Services Accordion */}
                        <button
                            onClick={() => setServicesOpen(!servicesOpen)}
                            className="flex justify-between items-center text-gray-300 hover:text-highlight font-medium text-lg py-3 border-b border-white/5"
                        >
                            Servicios
                            <span className={clsx("transition-transform", servicesOpen && "rotate-180")}>▼</span>
                        </button>

                        {servicesOpen && (
                            <div className="bg-white/5 rounded-lg my-2 p-4 grid grid-cols-1 gap-4">
                                <div>
                                    <h4 className="text-highlight text-xs font-bold uppercase mb-2">Desarrollo</h4>
                                    <ul className="space-y-2 pl-2">
                                        {serviceLinks.development.map(link => (
                                            <li key={link.name}>
                                                <Link to={link.href} onClick={() => setMobileMenuOpen(false)} className="text-gray-400 block text-sm">{link.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="text-accent text-xs font-bold uppercase mb-2">Soluciones</h4>
                                    <ul className="space-y-2 pl-2">
                                        {serviceLinks.additional.map(link => (
                                            <li key={link.name}>
                                                <Link to={link.href} onClick={() => setMobileMenuOpen(false)} className="text-gray-400 block text-sm">{link.name}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        <a href="/#beneficios" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-highlight font-medium text-lg py-3 border-b border-white/5">Beneficios</a>
                        <a href="/#proyectos" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-highlight font-medium text-lg py-3 border-b border-white/5">Proyectos</a>
                        <Link
                            to="/start-project"
                            onClick={() => setMobileMenuOpen(false)}
                            className="bg-primary text-center text-white py-3 rounded-lg font-bold mt-4 shadow-lg"
                        >
                            Empezar Proyecto
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;

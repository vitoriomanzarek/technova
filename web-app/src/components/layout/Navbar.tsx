import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
// import { Menu, X } from 'lucide-react'; 
// Actually, I can use simple SVG icons to avoid deps.

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Servicios', href: '/#servicios' }, // Anchor links on home might need handling
        { name: 'Beneficios', href: '/#beneficios' },
        { name: 'Proyectos', href: '/#proyectos' },
        { name: 'Proceso', href: '/#proceso' },
    ];

    return (
        <header
            className={clsx(
                'fixed w-full top-0 z-50 transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-dark/90 backdrop-blur-md border-white/10 py-2'
                    : 'bg-transparent border-transparent py-4'
            )}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                    <img src="/logo.png" alt="TechNova" className="h-[70px] w-auto" />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-highlight transition-colors font-medium text-sm lg:text-base"
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contacto"
                        className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg font-bold shadow-[0_4px_15px_rgba(106,13,173,0.3)] hover:shadow-[0_6px_20px_rgba(106,13,173,0.5)] hover:-translate-y-0.5 transition-all text-sm lg:text-base uppercase tracking-wide"
                    >
                        Agendar Consultoría
                    </a>
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
                <div className="md:hidden absolute top-full left-0 w-full bg-dark/95 backdrop-blur-lg border-b border-white/10 py-4 px-4 flex flex-col gap-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-300 hover:text-highlight font-medium text-lg"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="/#contacto"
                        className="bg-primary text-center text-white py-3 rounded-lg font-bold"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Agendar Consultoría
                    </a>
                </div>
            )}
        </header>
    );
};

export default Navbar;

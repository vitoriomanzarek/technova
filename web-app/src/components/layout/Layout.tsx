// import { ReactNode } from 'react';
import Navbar from './Navbar';
// import Footer from './Footer'; // Need to create Footer first
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen relative overflow-x-hidden">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-[#050505] py-12 text-gray-400 border-t border-white/5">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-white text-lg font-heading font-bold mb-4">TechNova Solutions</h3>
                        <p className="text-sm">Conectando tu negocio con el futuro digital.</p>
                    </div>
                    <div>
                        <h3 className="text-white text-lg font-heading font-bold mb-4">Enlaces Rápidos</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/#servicios" className="hover:text-highlight">Servicios</a></li>
                            <li><a href="/#proyectos" className="hover:text-highlight">Proyectos</a></li>
                            <li><a href="/#contacto" className="hover:text-highlight">Contacto</a></li>
                        </ul>
                    </div>
                    <div>
                        <p>&copy; {new Date().getFullYear()} TechNova. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

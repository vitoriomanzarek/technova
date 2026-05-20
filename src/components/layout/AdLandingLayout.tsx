"use client";
import Link from 'next/link';;

const AdLandingLayout = () => {
    return (
        <div className="min-h-screen bg-dark text-white font-sans flex flex-col">
            {/* Minimal Header */}
            <header className="w-full py-4 bg-dark/95 border-b border-white/5">
                <div className="container mx-auto px-4 flex justify-center items-center">
                    <Link href="/">
                        <img src="/logo.png" alt="TechNova" className="h-[50px] md:h-[60px] w-auto transition-transform hover:scale-105" />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Minimal Footer */}
            <footer className="w-full py-6 bg-dark border-t border-white/5 text-center text-sm text-gray-500">
                <div className="container mx-auto px-4">
                    <p>© {new Date().getFullYear()} TechNova Solutions. Todos los derechos reservados.</p>
                    <div className="flex justify-center gap-4 mt-2">
                        <Link href="/privacidad" className="hover:text-cyan-400 transition-colors">Política de Privacidad</Link>
                        <Link href="/terminos" className="hover:text-cyan-400 transition-colors">Términos y Condiciones</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AdLandingLayout;






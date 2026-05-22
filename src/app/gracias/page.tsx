"use client";
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Gracias = () => {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-8 max-w-lg mx-auto">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-3xl scale-150" />
                    <div className="relative bg-cyan-400/10 p-6 rounded-full border border-cyan-400/30">
                        <CheckCircle className="w-16 h-16 text-cyan-400" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold text-gradient">¡Misión Confirmada!</h1>
                    <p className="text-lg text-gray-400">
                        Tu Plan de Vuelo Digital está en camino. Nuestro equipo revisará tu proyecto y te contactará en menos de 24 horas.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent border border-accent/30">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Gracias por confiar en TechNova</span>
                </div>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                    Volver al inicio <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};

export default Gracias;

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function CheckoutCancelPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-purple-400/10 border border-purple-400/30">
          <XCircle className="w-10 h-10 text-purple-400" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Pago cancelado
        </h1>

        <p className="text-lg text-gray-300 mb-10 leading-relaxed">
          No se cobró nada a tu tarjeta. Si tuviste algún problema o quieres ajustar tu plan, contáctanos y lo resolvemos rápido.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold hover:scale-105 transition-transform"
          >
            Ver planes
          </Link>
          <Link
            href="/contacto"
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
          >
            Hablar con un humano
          </Link>
        </div>
      </div>
    </section>
  );
}

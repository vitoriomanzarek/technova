import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  return <SuccessContent searchParams={searchParams} />;
}

async function SuccessContent({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-cyan-400/10 border border-cyan-400/30">
          <CheckCircle className="w-10 h-10 text-cyan-400" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          ¡Pago confirmado! <span className="text-gradient">Bienvenido a bordo</span>
        </h1>

        <p className="text-lg text-gray-300 mb-4 leading-relaxed">
          Recibimos tu pago correctamente. Te enviamos un correo con el comprobante y los próximos pasos para arrancar tu proyecto.
        </p>

        {session_id && (
          <p className="text-sm text-gray-500 mb-10 font-mono break-all">
            Referencia: {session_id}
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold hover:scale-105 transition-transform"
          >
            Volver al inicio
          </Link>
          <Link
            href="/contacto"
            className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
          >
            Contactar al equipo
          </Link>
        </div>
      </div>
    </section>
  );
}

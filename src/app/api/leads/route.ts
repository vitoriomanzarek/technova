import { NextResponse } from 'next/server';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Guardar en Neon DB
    await db.insert(leads).values({
      name: body.name || 'Usuario Auditoría',
      email: body.email,
      project_type: body.project_type || 'Auditoría Express',
    });

    // Enviar correo con Resend
    await resend.emails.send({
      from: 'TechNova <onboarding@resend.dev>', // Se usa el dominio testing de resend
      to: body.email,
      subject: 'Tu Auditoría Web Express 🚀 (Falta un paso)',
      html: `
        <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
          <h2 style="color: #0ea5e9;">¡Hola! Qué gusto saludarte.</h2>
          <p>Recibí tu solicitud para la <strong>Auditoría Web Express</strong> y estoy listo para revisar tu presencia digital.</p>
          <p>Para poder hacer un análisis preciso y decirte exactamente dónde se está estancando tu negocio, <strong>necesito que respondas este correo con el link (URL) de tu página web.</strong></p>
          <p>En cuanto me respondas, entraré a tu sitio y te responderé con un diagnóstico rápido conteniendo 3 acciones clave que puedes aplicar hoy mismo para multiplicar tus ventas.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p><em>¿No tienes página web aún o prefieres ir directo al grano?</em></p>
          <p>Usa nuestro <a href="https://tudominio.com/start-project" style="color: #8b5cf6; font-weight: bold;">Cotizador Interactivo de 2 minutos</a> para recomendarte el plan ideal según tus objetivos.</p>
          <br/>
          <p>¡Quedo a la espera de tu link!</p>
          <p><strong>Equipo TechNova</strong></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: 'Lead captured and email sent successfully' });
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}

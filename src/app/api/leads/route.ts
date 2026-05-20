import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { welcomeAuditEmail } from '@/lib/emails/leadAuditWelcome';

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

    // Enviar correo con Resend (template en src/lib/emails/)
    const { subject, html } = welcomeAuditEmail();
    await resend.emails.send({
      from: 'TechNova <onboarding@resend.dev>', // dominio testing — pendiente verificar prod
      to: body.email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, message: 'Lead captured and email sent successfully' });
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}

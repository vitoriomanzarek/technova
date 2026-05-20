import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { welcomeAuditEmail } from '@/lib/emails/leadAuditWelcome';

const resend = new Resend(process.env.RESEND_API_KEY);

// Configura RESEND_FROM_EMAIL en .env una vez que el dominio esté verificado en Resend.
// Mientras no esté, cae en el dominio testing y solo se puede enviar al email del owner de la cuenta.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';

const leadSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(1).max(255).optional(),
  phone: z.string().min(1).max(20).optional(),
  project_type: z.string().min(1).max(255).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { email, name, phone, project_type } = parsed.data;

    // Guardar en Neon DB
    await db.insert(leads).values({
      email,
      name: name ?? 'Usuario Auditoría',
      phone: phone ?? null,
      project_type: project_type ?? 'Auditoría Express',
    });

    // Enviar correo con Resend (template en src/lib/emails/)
    const { subject, html } = welcomeAuditEmail();
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      html,
    });

    return NextResponse.json({ success: true, message: 'Lead captured and email sent successfully' });
  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}

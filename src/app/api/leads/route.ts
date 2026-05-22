import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { welcomeAuditEmail } from '@/lib/emails/leadAuditWelcome';
import { newLeadNotificationEmail } from '@/lib/emails/newLeadNotification';

const resend = new Resend(process.env.RESEND_API_KEY);

// FROM_EMAIL: necesita dominio verificado en Resend. Mientras tanto cae en onboarding@resend.dev
// (solo envía al owner de la cuenta Resend — perfecto para pruebas).
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'TechNova <onboarding@resend.dev>';

// Email del equipo que recibe la notificación de cada lead nuevo.
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? 'thisistechnova2026@gmail.com';

const leadSchema = z.object({
  email:        z.string().email('Email inválido'),
  name:         z.string().min(1).max(255).optional(),
  phone:        z.string().min(1).max(20).optional(),
  project_type: z.string().min(1).max(255).optional(),
  message:      z.string().max(5000).optional(),
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

    const { email, name, phone, project_type, message } = parsed.data;

    // 1) Persistir el lead. Si falla esto, devolvemos 500 — el cliente debe reintentar.
    await db.insert(leads).values({
      email,
      name:         name         ?? 'Anónimo',
      phone:        phone        ?? null,
      project_type: project_type ?? null,
      message:      message      ?? null,
    });

    // 2) Emails en paralelo — ninguno bloquea la respuesta si falla.
    //    El lead ya está guardado; perder un email es recuperable.
    const [welcomeResult, notifyResult] = await Promise.allSettled([
      // Email de bienvenida al lead (solo para auditoría web express)
      project_type === 'auditoria-web'
        ? resend.emails.send({
            from:    FROM_EMAIL,
            to:      email,
            subject: welcomeAuditEmail().subject,
            html:    welcomeAuditEmail().html,
          })
        : Promise.resolve(null),

      // Notificación interna al equipo TechNova — SIEMPRE
      resend.emails.send({
        from:    FROM_EMAIL,
        to:      NOTIFY_EMAIL,
        replyTo: email,
        subject: newLeadNotificationEmail({ name, email, phone, project_type, message }).subject,
        html:    newLeadNotificationEmail({ name, email, phone, project_type, message }).html,
      }),
    ]);

    if (notifyResult.status === 'rejected') {
      console.error('[resend] Owner notification failed (lead still captured):', notifyResult.reason);
    }
    if (welcomeResult.status === 'rejected') {
      console.error('[resend] Welcome email failed (lead still captured):', welcomeResult.reason);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead registrado correctamente',
      notified: notifyResult.status === 'fulfilled',
    });

  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}

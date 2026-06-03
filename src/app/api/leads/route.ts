import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { db } from '@/db';
import { leads } from '@/db/schema';
import { welcomeAuditEmail } from '@/lib/emails/leadAuditWelcome';
import { welcomeContactEmail } from '@/lib/emails/leadContactWelcome';
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
  website_url:  z.string().url('URL inválida').max(500).optional().or(z.literal('')).transform(v => v || undefined),
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

    const { email, name, phone, project_type, message, website_url } = parsed.data;

    // 1) Persistir el lead. Si falla esto, devolvemos 500 — el cliente debe reintentar.
    await db.insert(leads).values({
      email,
      name:         name         ?? 'Anónimo',
      phone:        phone        ?? null,
      project_type: project_type ?? null,
      message:      message      ?? null,
      website_url:  website_url  ?? null,
    });

    // 2) Emails en paralelo — ninguno bloquea la respuesta si falla.
    //    El lead ya está guardado; perder un email es recuperable.
    const [welcomeResult, notifyResult] = await Promise.allSettled([
      // Email de bienvenida al lead según el tipo de formulario
      (() => {
        if (project_type === 'auditoria-web') {
          const tpl = welcomeAuditEmail({ name, websiteUrl: website_url });
          return resend.emails.send({ from: FROM_EMAIL, to: email, subject: tpl.subject, html: tpl.html });
        }
        if (project_type === 'contacto') {
          const tpl = welcomeContactEmail({ name, message });
          return resend.emails.send({ from: FROM_EMAIL, to: email, subject: tpl.subject, html: tpl.html });
        }
        return Promise.resolve(null);
      })(),

      // Notificación interna al equipo TechNova — SIEMPRE
      resend.emails.send({
        from:    FROM_EMAIL,
        to:      NOTIFY_EMAIL,
        replyTo: email,
        subject: newLeadNotificationEmail({ name, email, phone, project_type, message, website_url }).subject,
        html:    newLeadNotificationEmail({ name, email, phone, project_type, message, website_url }).html,
      }),
    ]);

    if (notifyResult.status === 'rejected') {
      console.error('[resend] Owner notification failed (lead still captured):', notifyResult.reason);
    } else if (notifyResult.value && 'error' in notifyResult.value && notifyResult.value.error) {
      // Resend SDK fulfills even on API errors — log them so they're visible in Vercel logs
      console.error('[resend] Owner notification API error:', JSON.stringify(notifyResult.value.error));
    } else {
      console.log('[resend] Owner notification sent:', (notifyResult.value as { data?: { id?: string } } | null)?.data?.id);
    }

    if (welcomeResult.status === 'rejected') {
      console.error('[resend] Welcome email failed (lead still captured):', welcomeResult.reason);
    } else if (welcomeResult.value && 'error' in welcomeResult.value && welcomeResult.value.error) {
      console.error('[resend] Welcome email API error:', JSON.stringify(welcomeResult.value.error));
    }

    const notifyOk = notifyResult.status === 'fulfilled' &&
      !(notifyResult.value && 'error' in notifyResult.value && notifyResult.value.error);

    return NextResponse.json({
      success: true,
      message: 'Lead registrado correctamente',
      notified: notifyOk,
    });

  } catch (error) {
    console.error('Error capturing lead:', error);
    return NextResponse.json({ success: false, error: 'Failed to capture lead' }, { status: 500 });
  }
}

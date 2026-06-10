/**
 * Tracking de eventos custom — manda a GA4 (gtag) y Microsoft Clarity a la vez.
 * Ambos scripts se inyectan en layout.tsx; aquí solo se usan si existen.
 *
 * Convención de nombres (snake_case, estilo GA4):
 *   cta_click    { cta }            — clicks en CTAs principales
 *   form_start   { form }           — primera interacción con un formulario
 *   form_submit  { form, ... }      — envío exitoso (conversión)
 *   form_error   { form }           — envío fallido
 *   wizard_*     { segment, step }  — progreso del cotizador /start-project
 *
 * En GA4 aparecen como eventos custom (marcar form_submit como key event).
 * En Clarity aparecen como Smart Events → permiten filtrar grabaciones
 * (ej: "ver sesiones con form_start pero sin form_submit").
 */

type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', name, props);

    if (window.clarity) {
      window.clarity('event', name);
      // Tags para filtrar grabaciones por propiedad (ej: form=contacto)
      for (const [key, value] of Object.entries(props)) {
        if (value !== undefined) window.clarity('set', key, String(value));
      }
    }
  } catch {
    // Analytics nunca debe romper la UI
  }
}

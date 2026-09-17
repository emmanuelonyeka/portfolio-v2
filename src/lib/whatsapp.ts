import { site } from '../config/site'

/**
 * Builds a wa.me link with a pre-filled message.
 *
 * Messages are written as plain readable text at the call site and encoded
 * here exactly once, so no component ever holds a hand-encoded URL string.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Default opener used by the floating button and the general contact CTAs. */
export const WHATSAPP_GENERAL =
  'Hi Emmanuel, I found your portfolio and would love to discuss a project.'

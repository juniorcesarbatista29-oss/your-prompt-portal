/**
 * WhatsApp helpers — single source of truth for phone formatting and link building.
 *
 * Stored format: digits only, with country code (e.g. "5517996015317").
 * Display format: "+55 17 99601-5317".
 * Link format: "https://wa.me/<digits>?text=<encoded>".
 */

const FALLBACK_NUMBER = "5517996015317";

/** Strip all non-digits and ensure country code (defaults to Brazil "55"). */
export function normalizeWhatsapp(input?: string | null): string {
  const digits = (input ?? "").replace(/\D/g, "");
  if (!digits) return FALLBACK_NUMBER;
  // If the user typed without country code (10 or 11 digits), prepend "55".
  if (digits.length <= 11) return `55${digits}`;
  return digits;
}

/**
 * Format for human display.
 * "5517996015317" → "+55 17 99601-5317"
 * Falls back to "+<digits>" if the layout is unexpected.
 */
export function formatWhatsappDisplay(input?: string | null): string {
  const d = normalizeWhatsapp(input);
  // BR full: 55 + DDD(2) + 9 digits
  const br = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (br) return `+55 ${br[1]} ${br[2]}-${br[3]}`;
  return `+${d}`;
}

/** Short national display — "(17) 99601-5317". */
export function formatWhatsappNational(input?: string | null): string {
  const d = normalizeWhatsapp(input);
  const br = d.match(/^55(\d{2})(\d{4,5})(\d{4})$/);
  if (br) return `(${br[1]}) ${br[2]}-${br[3]}`;
  return formatWhatsappDisplay(d);
}

/** Build a wa.me URL with optional pre-filled message. */
export function buildWhatsappUrl(input?: string | null, message?: string): string {
  const d = normalizeWhatsapp(input);
  const base = `https://wa.me/${d}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const DEFAULT_WHATSAPP = FALLBACK_NUMBER;

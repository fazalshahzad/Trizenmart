/**
 * Input Sanitizer and XSS Prevention Utilities
 * Ensures all user inputs, searches, and notes are clean of malicious script injection
 */

export function sanitizeText(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Clean phone to allow only digits and optional leading plus
  const cleaned = phone.replace(/[^\d+]/g, '');
  return cleaned;
}

export function sanitizePrice(val: number | string): number {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return 0;
  }
  return Math.round(num * 100) / 100;
}

export function sanitizeSearchQuery(query: string): string {
  if (!query) return '';
  return query
    .trim()
    .replace(/[^\w\s\-\u0600-\u06FF]/gi, '') // Allows alphanumeric, space, dashes, and Urdu/Arabic characters
    .slice(0, 100);
}

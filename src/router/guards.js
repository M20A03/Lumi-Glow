/**
 * LumiGlow Route Guards, Geo-Routing & Currency Middleware
 */

export const CURRENCY_CONFIG = {
  USD: { symbol: '$', rate: 1.0, locale: 'en-US', name: 'US Dollar' },
  EUR: { symbol: '€', rate: 0.92, locale: 'de-DE', name: 'Euro' },
  GBP: { symbol: '£', rate: 0.79, locale: 'en-GB', name: 'British Pound' },
  INR: { symbol: '₹', rate: 83.5, locale: 'en-IN', name: 'Indian Rupee' },
  CAD: { symbol: 'CA$', rate: 1.36, locale: 'en-CA', name: 'Canadian Dollar' },
  AUD: { symbol: 'AU$', rate: 1.52, locale: 'en-AU', name: 'Australian Dollar' },
};

/**
 * Detect user's country / currency based on browser locale or timezone
 */
export function detectUserGeo() {
  if (typeof window === 'undefined') return { country: 'US', currency: 'USD' };

  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const lang = navigator.language || '';

    if (tz.includes('Calcutta') || tz.includes('Kolkata') || lang.startsWith('hi') || lang === 'en-IN') {
      return { country: 'IN', currency: 'INR' };
    }
    if (tz.includes('London') || lang === 'en-GB') {
      return { country: 'GB', currency: 'GBP' };
    }
    if (tz.includes('Europe') || ['fr', 'de', 'es', 'it', 'nl'].some(l => lang.startsWith(l))) {
      return { country: 'EU', currency: 'EUR' };
    }
    if (tz.includes('Toronto') || tz.includes('Vancouver') || lang === 'en-CA') {
      return { country: 'CA', currency: 'CAD' };
    }
    if (tz.includes('Sydney') || tz.includes('Melbourne') || lang === 'en-AU') {
      return { country: 'AU', currency: 'AUD' };
    }
  } catch {
    // Default fallback
  }

  return { country: 'US', currency: 'USD' };
}

/**
 * Format price in current currency
 */
export function formatPrice(centsOrAmount, currency = 'USD') {
  const config = CURRENCY_CONFIG[currency] || CURRENCY_CONFIG.USD;
  // If input is in cents (e.g. 3499 = $34.99), convert to base dollars first
  const baseDollar = typeof centsOrAmount === 'number' && centsOrAmount > 100 
    ? centsOrAmount / 100 
    : Number(centsOrAmount);

  const converted = baseDollar * config.rate;

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(converted);
}

/**
 * Bot / Crawler Detection
 */
export function isSearchCrawler() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const botPatterns = /bot|googlebot|crawler|spider|robot|crawling|lighthouse/i;
  return botPatterns.test(ua);
}

/**
 * Auth Guard check helper
 */
export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem('lumiglow-user-token'));
  } catch {
    return false;
  }
}

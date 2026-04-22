import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getFlagUrl(currencyCode: string) {
  const code = currencyCode.toLowerCase();
  
  // Specific overrides for common currencies that don't follow the 2-letter rule
  const mapping: Record<string, string> = {
    'eur': 'eu',
    'usd': 'us',
    'gbp': 'gb',
    'aud': 'au',
    'cad': 'ca',
    'jpy': 'jp',
    'inr': 'in',
    'cny': 'cn',
    'hkd': 'hk',
    'nzd': 'nz',
    'rub': 'ru',
    'brl': 'br',
    'zar': 'za',
    'sgd': 'sg',
    'aed': 'ae',
    'chf': 'ch',
    'btc': 'us', // Placeholder
  };

  const countryCode = mapping[code] || code.substring(0, 2);
  return `https://flagcdn.com/w40/${countryCode}.png`;
}

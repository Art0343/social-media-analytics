import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function parseFormattedNumber(value: string): number {
  const cleaned = value.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  
  if (cleaned.endsWith('M')) {
    return num * 1_000_000;
  }
  if (cleaned.endsWith('K')) {
    return num * 1_000;
  }
  return num;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return value.toFixed(1) + '%';
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export const platformIcons: Record<string, string> = {
  instagram: 'photo_camera',
  facebook: 'thumb_up',
  linkedin: 'work',
  youtube: 'smart_display',
  twitter: 'tag',
  tiktok: 'music_note',
};

export { getPlatformColor, PLATFORM_SLUG_COLORS } from './platform-colors';

/** @deprecated Use getPlatformColor(slug) for full slug coverage */
export const platformColors: Record<string, string> = {
  instagram: '#E11D48',
  facebook: '#2563EB',
  linkedin: '#0369A1',
  youtube: '#DC2626',
  twitter: '#475569',
  tiktok: '#18181B',
};

/**
 * Single source of truth for platform colors across charts, tables, and badges.
 * Each slug gets a visually distinct color (organic vs ad variants differ).
 */
export const PLATFORM_SLUG_COLORS: Record<string, string> = {
  instagram: '#E11D48',
  facebook: '#2563EB',
  'meta-ads': '#7C3AED',
  linkedin: '#0369A1',
  'linkedin-ads': '#C026D3',
  youtube: '#DC2626',
  tiktok: '#18181B',
  'tiktok-ads': '#0891B2',
  twitter: '#475569',
  whatsapp: '#16A34A',
  snapchat: '#B45309',
  'snapchat-ads': '#EA580C',
  'google-ads': '#15803D',
  'google-maps': '#0D9488',
};

export function getPlatformColor(slug: string): string {
  return PLATFORM_SLUG_COLORS[slug] ?? '#64748B';
}

/** Line / legend config for follower growth (subset of platforms with demo series). */
export const FOLLOWER_GROWTH_SERIES = [
  { key: 'instagram', name: 'Instagram' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'facebook', name: 'Facebook' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'snapchat', name: 'Snapchat' },
  { key: 'twitter', name: 'X / Twitter' },
] as const;

/** Stacked ad spend keys (must match `adSpendData` columns). */
export const AD_SPEND_STACK_KEYS = [
  { key: 'instagram', name: 'Instagram' },
  { key: 'facebook', name: 'Facebook' },
  { key: 'youtube', name: 'YouTube' },
  { key: 'linkedin', name: 'LinkedIn' },
  { key: 'tiktok', name: 'TikTok' },
  { key: 'twitter', name: 'X' },
  { key: 'whatsapp', name: 'WhatsApp' },
  { key: 'google-ads', name: 'Google Ads' },
  { key: 'meta-ads', name: 'Meta Ads' },
  { key: 'snapchat', name: 'Snapchat' },
] as const;

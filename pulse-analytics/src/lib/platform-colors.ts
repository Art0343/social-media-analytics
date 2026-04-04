/**
 * Single source of truth for platform colors across charts, tables, and badges.
 * Each slug gets a visually distinct color (organic vs ad variants differ).
 */
/** Distinct hues for charts (readability over strict brand match). */
export const PLATFORM_SLUG_COLORS: Record<string, string> = {
  instagram: '#DB2777',
  facebook: '#2563EB',
  'meta-ads': '#9333EA',
  linkedin: '#0891B2',
  'linkedin-ads': '#C026D3',
  youtube: '#EA580C',
  tiktok: '#06B6D4',
  'tiktok-ads': '#0E7490',
  twitter: '#64748B',
  whatsapp: '#16A34A',
  snapchat: '#CA8A04',
  'snapchat-ads': '#EA580C',
  'google-ads': '#65A30D',
  'google-maps': '#0F766E',
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

/**
 * Stacked ad spend chart: dedicated ad / Ads Manager accounts only (not organic social profile slugs).
 * Keys must match `adSpendData` columns and DB `platformSlug` for ad accounts.
 */
export const AD_SPEND_STACK_KEYS = [
  { key: 'meta-ads', name: 'Meta Ads' },
  { key: 'google-ads', name: 'Google Ads' },
  { key: 'linkedin-ads', name: 'LinkedIn Ads' },
  { key: 'tiktok-ads', name: 'TikTok Ads' },
  { key: 'snapchat-ads', name: 'Snapchat Ads' },
] as const;

/** Ads Manager–style accounts (`*-ads`); excludes organic social profile slugs (e.g. instagram, facebook). */
export function isAdAccountPlatformSlug(slug: string): boolean {
  return slug.endsWith('-ads');
}

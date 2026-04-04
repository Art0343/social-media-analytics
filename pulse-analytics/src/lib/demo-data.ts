// Demo / Mock data for development and testing
// Types are defined in @/lib/types

import { getPlatformColor } from './platform-colors';

export {
  type KpiData,
  type PlatformMixItem,
  type PlatformPerformanceItem,
  type Post,
  type InsightCard,
  type ROITableItem,
  type ConnectedAccount,
  type DemoPlatform,
} from '@/lib/types';

export const kpiCards = [
  {
    title: 'Organic Reach',
    value: '260.5K',
    delta: '15.3%',
    deltaPositive: true,
    icon: 'groups',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
  },
  {
    title: 'Organic Impressions',
    value: '385.5K',
    delta: '12.4%',
    deltaPositive: true,
    icon: 'visibility',
    iconBg: 'bg-secondary-fixed',
    iconColor: 'text-secondary',
  },
  {
    title: 'Avg Engagement Rate',
    value: '5.6%',
    delta: '0.8%',
    deltaPositive: true,
    icon: 'bolt',
    iconBg: 'bg-tertiary-fixed',
    iconColor: 'text-tertiary',
  },
  {
    title: 'Follower Growth',
    value: '49.1K',
    delta: '9.3%',
    deltaPositive: true,
    icon: 'person_add',
    iconBg: 'bg-surface-container-highest',
    iconColor: 'text-on-surface',
  },
];

export const platformMixData = [
  { name: 'Instagram', slug: 'instagram', value: 22.0, color: getPlatformColor('instagram'), icon: 'photo_camera' },
  { name: 'TikTok', slug: 'tiktok', value: 20.5, color: getPlatformColor('tiktok'), icon: 'music_note' },
  { name: 'YouTube', slug: 'youtube', value: 12.0, color: getPlatformColor('youtube'), icon: 'smart_display' },
  { name: 'Facebook', slug: 'facebook', value: 11.0, color: getPlatformColor('facebook'), icon: 'thumb_up' },
  { name: 'LinkedIn', slug: 'linkedin', value: 8.5, color: getPlatformColor('linkedin'), icon: 'work' },
  { name: 'Snapchat', slug: 'snapchat', value: 6.2, color: getPlatformColor('snapchat'), icon: 'photo_camera' },
  { name: 'X / Twitter', slug: 'twitter', value: 5.8, color: getPlatformColor('twitter'), icon: 'flutter' },
  { name: 'WhatsApp', slug: 'whatsapp', value: 4.5, color: getPlatformColor('whatsapp'), icon: 'chat_bubble' },
  { name: 'Google Business', slug: 'google-maps', value: 4.0, color: getPlatformColor('google-maps'), icon: 'location_on' },
  { name: 'Meta Ads', slug: 'meta-ads', value: 2.8, color: getPlatformColor('meta-ads'), icon: 'campaign' },
  { name: 'Google Ads', slug: 'google-ads', value: 2.7, color: getPlatformColor('google-ads'), icon: 'ads_click' },
];

export const postsData = [
  // Recent posts (April 2026 - last 7 days)
  {
    id: 'recent-1', platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    date: '2026-04-04', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'Today\'s big announcement is finally here! 🚀', orgReach: 245000, impressions: 380000,
    likes: 18500, comments: 1200, shares: 3200, saves: 8500, engRate: 7.2, isBoosted: true, spend: 1500,
  },
  {
    id: 'recent-2', platform: 'TikTok', platformSlug: 'tiktok', platformColor: getPlatformColor('tiktok'),
    date: '2026-04-01', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'Quick tip that changed my life ✨', orgReach: 520000, impressions: 780000,
    likes: 65000, comments: 2100, shares: 8200, saves: 12400, engRate: 12.5, isBoosted: false, spend: null,
  },
  {
    id: 'recent-3', platform: 'YouTube', platformSlug: 'youtube', platformColor: getPlatformColor('youtube'),
    date: '2026-03-30', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'Behind the scenes of our biggest launch', orgReach: 185000, impressions: 280000,
    likes: 15200, comments: 840, shares: 2100, saves: 11200, engRate: 8.4, isBoosted: false, spend: null,
  },
  {
    id: 'recent-4', platform: 'X / Twitter', platformSlug: 'twitter', platformColor: getPlatformColor('twitter'),
    date: '2026-03-29', type: 'POST', typeBadgeColor: 'bg-slate-100 text-slate-800',
    caption: 'Dark mode ships this week — here is what is new', orgReach: 22000, impressions: 48000,
    likes: 1100, comments: 156, shares: 420, saves: 0, engRate: 3.8, isBoosted: false, spend: null,
  },
  {
    id: 'recent-5', platform: 'Snapchat', platformSlug: 'snapchat', platformColor: getPlatformColor('snapchat'),
    date: '2026-03-28', type: 'STORY', typeBadgeColor: 'bg-yellow-100 text-yellow-800',
    caption: 'Studio tour in 60 seconds', orgReach: 14000, impressions: 24000,
    likes: 0, comments: 0, shares: 0, saves: 0, engRate: 5.2, isBoosted: false, spend: null,
  },
  {
    id: 'recent-6', platform: 'WhatsApp', platformSlug: 'whatsapp', platformColor: getPlatformColor('whatsapp'),
    date: '2026-03-27', type: 'STATUS', typeBadgeColor: 'bg-green-100 text-green-800',
    caption: 'New client report template inside the Pulse dashboard', orgReach: 5100, impressions: 7800,
    likes: 240, comments: 92, shares: 38, saves: 0, engRate: 2.0, isBoosted: false, spend: null,
  },
  // Posts from Feb-Mar 2026 (1-3 months ago)
  {
    id: 'month-1', platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    date: '2026-02-18', type: 'CAROUSEL', typeBadgeColor: 'bg-blue-100 text-blue-700',
    caption: '5 lessons I learned scaling to 100K followers', orgReach: 125000, impressions: 195000,
    likes: 8500, comments: 420, shares: 1800, saves: 9500, engRate: 6.8, isBoosted: false, spend: null,
  },
  {
    id: 'month-2', platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: getPlatformColor('linkedin'),
    date: '2026-02-01', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'The future of social media marketing in 2026', orgReach: 42000, impressions: 65000,
    likes: 2800, comments: 340, shares: 890, saves: 520, engRate: 5.2, isBoosted: true, spend: 800,
  },
  {
    id: 'month-3', platform: 'Facebook', platformSlug: 'facebook', platformColor: getPlatformColor('facebook'),
    date: '2026-01-15', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'Community update: 10K new members this month!', orgReach: 85000, impressions: 125000,
    likes: 4200, comments: 580, shares: 1200, saves: 890, engRate: 4.1, isBoosted: false, spend: null,
  },
  // Posts from Oct-Dec 2025 (3-6 months ago)
  {
    id: 'q2-1', platform: 'TikTok', platformSlug: 'tiktok', platformColor: getPlatformColor('tiktok'),
    date: '2025-12-28', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'This trend never gets old 😂', orgReach: 890000, impressions: 1200000,
    likes: 125000, comments: 4500, shares: 15000, saves: 28000, engRate: 15.2, isBoosted: false, spend: null,
  },
  {
    id: 'q2-2', platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    date: '2025-12-10', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'Product demo: watch until the end!', orgReach: 320000, impressions: 480000,
    likes: 22000, comments: 1800, shares: 4200, saves: 11200, engRate: 8.9, isBoosted: true, spend: 2500,
  },
  {
    id: 'q2-3', platform: 'YouTube', platformSlug: 'youtube', platformColor: getPlatformColor('youtube'),
    date: '2025-11-22', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'Full tutorial: Advanced analytics setup', orgReach: 145000, impressions: 220000,
    likes: 9800, comments: 620, shares: 1400, saves: 15200, engRate: 6.5, isBoosted: false, spend: null,
  },
  {
    id: 'q2-4', platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: getPlatformColor('linkedin'),
    date: '2025-11-05', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'We\'re hiring! Join our amazing team', orgReach: 28000, impressions: 42000,
    likes: 1200, comments: 180, shares: 450, saves: 280, engRate: 4.2, isBoosted: true, spend: 500,
  },
  // Posts from Apr-Oct 2025 (6-12 months ago)
  {
    id: 'year-1', platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    date: '2025-10-15', type: 'CAROUSEL', typeBadgeColor: 'bg-blue-100 text-blue-700',
    caption: 'Year in review: our biggest wins', orgReach: 195000, impressions: 285000,
    likes: 14200, comments: 850, shares: 2100, saves: 8900, engRate: 7.1, isBoosted: false, spend: null,
  },
  {
    id: 'year-2', platform: 'TikTok', platformSlug: 'tiktok', platformColor: getPlatformColor('tiktok'),
    date: '2025-09-20', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'First viral video 🎉 Thank you all!', orgReach: 2100000, impressions: 3200000,
    likes: 285000, comments: 12500, shares: 42000, saves: 65000, engRate: 18.5, isBoosted: false, spend: null,
  },
  {
    id: 'year-3', platform: 'Facebook', platformSlug: 'facebook', platformColor: getPlatformColor('facebook'),
    date: '2025-08-12', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'Customer success story: How we helped them 10x', orgReach: 65000, impressions: 98000,
    likes: 3200, comments: 280, shares: 850, saves: 650, engRate: 3.8, isBoosted: true, spend: 1200,
  },
  {
    id: 'year-4', platform: 'YouTube', platformSlug: 'youtube', platformColor: getPlatformColor('youtube'),
    date: '2025-07-08', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'Getting started guide for beginners', orgReach: 85000, impressions: 135000,
    likes: 5200, comments: 340, shares: 890, saves: 10200, engRate: 5.1, isBoosted: false, spend: null,
  },
  {
    id: 'year-5', platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: getPlatformColor('linkedin'),
    date: '2025-06-05', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'Our company just turned 2 years old!', orgReach: 22000, impressions: 35000,
    likes: 980, comments: 120, shares: 320, saves: 180, engRate: 3.5, isBoosted: false, spend: null,
  },
  {
    id: 'year-6', platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    date: '2025-05-12', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'Throwback to our first office setup', orgReach: 75000, impressions: 115000,
    likes: 5200, comments: 280, shares: 650, saves: 3200, engRate: 4.8, isBoosted: false, spend: null,
  },
  {
    id: 'year-7', platform: 'TikTok', platformSlug: 'tiktok', platformColor: getPlatformColor('tiktok'),
    date: '2025-04-20', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'POV: Your first day at a startup', orgReach: 420000, impressions: 650000,
    likes: 52000, comments: 1800, shares: 6500, saves: 11200, engRate: 9.2, isBoosted: false, spend: null,
  },
];

export const insightCards = [
  {
    id: 'top-performing',
    icon: 'rocket_launch',
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-primary',
    label: 'Performance Hub',
    labelColor: 'text-primary',
    title: 'Top Performing Content',
    description: 'Vertical video continues to dominate engagement cycles. Instagram Reels are currently delivering 3.2× more reach than carousel equivalents.',
  },
  {
    id: 'wasted-spend',
    icon: 'flag',
    iconBg: 'bg-error-container',
    iconColor: 'text-error',
    label: 'Alert',
    labelColor: 'text-error',
    title: 'Wasted Ad Spend Detected',
    description: '3 posts are consuming 28% of the total monthly budget despite having a CPE 45% higher than platform average. Immediate cut recommended.',
  },
  {
    id: 'boost-candidates',
    icon: 'trending_up',
    iconBg: 'bg-tertiary-container',
    iconColor: 'text-on-tertiary-container',
    label: 'Conversion Potential',
    labelColor: 'text-tertiary',
    title: 'Organic → Boost Candidates',
    description: 'TikTok "Replying to haters" video has reached 8.1% ER organically. AI predicts a 12% lower CPV if boosted within the next 24 hours.',
  },
  {
    id: 'budget-reallocation',
    icon: 'electric_bolt',
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
    label: 'Optimization',
    labelColor: 'text-secondary',
    title: 'Budget Reallocation Suggested',
    description: 'AI models suggest shifting funds from underperforming Facebook awareness campaigns to high-growth TikTok consideration ads.',
  },
];

export const roiTableData = [
  {
    id: '1', title: 'New product launch', platform: 'Instagram', platformSlug: 'instagram',
    platformColor: getPlatformColor('instagram'), type: 'Carousel', organicER: '5.4%', paidSpend: '₹1,240',
    cpe: '₹0.12', totalReach: '842k', roiScore: 92, roiColor: 'text-tertiary',
    recommendation: 'Scale up', recColor: 'text-tertiary', recBg: 'bg-tertiary/10',
  },
  {
    id: '2', title: 'Day in my life', platform: 'TikTok', platformSlug: 'tiktok',
    platformColor: getPlatformColor('tiktok'), type: 'Video', organicER: '7.2%', paidSpend: '₹300',
    cpe: '₹0.08', totalReach: '1.2M', roiScore: 87, roiColor: 'text-tertiary',
    recommendation: 'Boost this', recColor: 'text-primary', recBg: 'bg-primary/10',
  },
  {
    id: '3', title: 'Replying to the haters', platform: 'TikTok', platformSlug: 'tiktok',
    platformColor: getPlatformColor('tiktok'), type: 'Video', organicER: '8.1%', paidSpend: '₹0',
    cpe: 'n/a', totalReach: '54k', roiScore: 94, roiColor: 'text-tertiary',
    recommendation: 'Boost this', recColor: 'text-primary', recBg: 'bg-primary/10',
  },
  {
    id: '4', title: '3 mistakes', platform: 'Facebook', platformSlug: 'facebook',
    platformColor: getPlatformColor('facebook'), type: 'Single Image', organicER: '0.8%', paidSpend: '₹420',
    cpe: '₹2.40', totalReach: '12k', roiScore: 48, roiColor: 'text-error',
    recommendation: 'Cut budget', recColor: 'text-error', recBg: 'bg-error/10',
  },
  {
    id: '5', title: 'Product teaser thread', platform: 'X / Twitter', platformSlug: 'twitter',
    platformColor: getPlatformColor('twitter'), type: 'Post', organicER: '3.9%', paidSpend: '₹180',
    cpe: '₹0.55', totalReach: '28k', roiScore: 76, roiColor: 'text-primary',
    recommendation: 'Boost this', recColor: 'text-primary', recBg: 'bg-primary/10',
  },
  {
    id: '6', title: 'Spotlight: BTS shoot', platform: 'Snapchat', platformSlug: 'snapchat',
    platformColor: getPlatformColor('snapchat'), type: 'Spotlight', organicER: '6.4%', paidSpend: '₹95',
    cpe: '₹0.31', totalReach: '18k', roiScore: 81, roiColor: 'text-tertiary',
    recommendation: 'Scale up', recColor: 'text-tertiary', recBg: 'bg-tertiary/10',
  },
];

/** Organic & profile integrations (pages, channels, messaging, local listings) */
export const socialProfileAccountsData = [
  {
    id: 's1', accountKind: 'social' as const, platform: 'Instagram', platformSlug: 'instagram', platformColor: getPlatformColor('instagram'),
    icon: 'photo_camera', accountName: 'Instagram Business', accountHandle: '@pulse_digital_official',
    isConnected: true, lastSynced: '4 mins ago',
  },
  {
    id: 's2', accountKind: 'social' as const, platform: 'Facebook', platformSlug: 'facebook', platformColor: getPlatformColor('facebook'),
    icon: 'thumb_up', accountName: 'Facebook Pages', accountHandle: 'Pulse Analytics Global',
    isConnected: true, lastSynced: '12 mins ago',
  },
  {
    id: 's3', accountKind: 'social' as const, platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: getPlatformColor('linkedin'),
    icon: 'work', accountName: 'LinkedIn Company', accountHandle: 'Pulse Analytics Inc.',
    isConnected: true, lastSynced: '22 mins ago',
  },
  {
    id: 's4', accountKind: 'social' as const, platform: 'TikTok', platformSlug: 'tiktok', platformColor: getPlatformColor('tiktok'),
    icon: 'music_note', accountName: 'TikTok Creator', accountHandle: '@pulse_analytics',
    isConnected: true, lastSynced: '8 mins ago',
  },
  {
    id: 's5', accountKind: 'social' as const, platform: 'YouTube', platformSlug: 'youtube', platformColor: getPlatformColor('youtube'),
    icon: 'smart_display', accountName: 'YouTube Studio', accountHandle: 'Pulse Creative Hub',
    isConnected: true, lastSynced: '2 hours ago',
  },
  {
    id: 's6', accountKind: 'social' as const, platform: 'WhatsApp Business', platformSlug: 'whatsapp', platformColor: getPlatformColor('whatsapp'),
    icon: 'chat_bubble', accountName: 'WhatsApp Business', accountHandle: '+1 555 Pulse',
    isConnected: true, lastSynced: '1 hour ago',
  },
  {
    id: 's7', accountKind: 'social' as const, platform: 'Google Maps', platformSlug: 'google-maps', platformColor: getPlatformColor('google-maps'),
    icon: 'location_on', accountName: 'Google Business Profile', accountHandle: 'Pulse HQ — Austin',
    isConnected: true, lastSynced: '3 hours ago',
  },
  {
    id: 's8', accountKind: 'social' as const, platform: 'Snapchat', platformSlug: 'snapchat', platformColor: getPlatformColor('snapchat'),
    icon: 'photo_camera', accountName: 'Snapchat', accountHandle: '@pulse.official',
    isConnected: true, lastSynced: '35 mins ago',
  },
];

/** Paid media / ads manager connections */
export const adAccountsData = [
  {
    id: 'a1', accountKind: 'ad' as const, platform: 'Meta', platformSlug: 'meta-ads', platformColor: getPlatformColor('meta-ads'),
    icon: 'campaign', accountName: 'Meta Ads', isConnected: true, lastSynced: '18 mins ago',
    subtext: 'Facebook + Instagram', monthlySpendLabel: '$1,070/mo',
  },
  {
    id: 'a2', accountKind: 'ad' as const, platform: 'Google Ads', platformSlug: 'google-ads', platformColor: getPlatformColor('google-ads'),
    icon: 'ads_click', accountName: 'Google Ads', isConnected: true, lastSynced: '45 mins ago',
    subtext: 'Search, Display & YouTube', monthlySpendLabel: '$220/mo',
  },
  {
    id: 'a3', accountKind: 'ad' as const, platform: 'LinkedIn', platformSlug: 'linkedin-ads', platformColor: getPlatformColor('linkedin-ads'),
    icon: 'campaign', accountName: 'LinkedIn Ads', isConnected: true, lastSynced: '1 hour ago',
    subtext: 'Campaign Manager', monthlySpendLabel: '$270/mo',
  },
  {
    id: 'a4', accountKind: 'ad' as const, platform: 'TikTok', platformSlug: 'tiktok-ads', platformColor: getPlatformColor('tiktok-ads'),
    icon: 'campaign', accountName: 'TikTok Ads', isConnected: true, lastSynced: '52 mins ago',
    subtext: 'TikTok for Business', monthlySpendLabel: '$340/mo',
  },
  {
    id: 'a5', accountKind: 'ad' as const, platform: 'Twitter / X', platformSlug: 'twitter', platformColor: getPlatformColor('twitter'),
    icon: 'flutter', accountName: 'X / Twitter Ads', isConnected: true, lastSynced: '2 hours ago',
    subtext: 'X Advertising', monthlySpendLabel: '$190/mo',
  },
  {
    id: 'a6', accountKind: 'ad' as const, platform: 'Snapchat', platformSlug: 'snapchat-ads', platformColor: getPlatformColor('snapchat-ads'),
    icon: 'campaign', accountName: 'Snapchat Ads', isConnected: true, lastSynced: '1 hour ago',
    subtext: 'Snap Audience Network', monthlySpendLabel: '$95/mo',
  },
];

/** Full list for tooling/tests; UI uses `socialProfileAccountsData` and `adAccountsData`. */
export const connectedAccountsData = [...socialProfileAccountsData, ...adAccountsData];

export const demoPlatforms = [
  { id: 'p1', name: 'Instagram', slug: 'instagram', brandColor: getPlatformColor('instagram'), icon: 'photo_camera', isActive: true, isBuiltIn: true },
  { id: 'p2', name: 'Facebook', slug: 'facebook', brandColor: getPlatformColor('facebook'), icon: 'thumb_up', isActive: true, isBuiltIn: true },
  { id: 'p3', name: 'LinkedIn', slug: 'linkedin', brandColor: getPlatformColor('linkedin'), icon: 'work', isActive: true, isBuiltIn: true },
  { id: 'p4', name: 'YouTube', slug: 'youtube', brandColor: getPlatformColor('youtube'), icon: 'smart_display', isActive: true, isBuiltIn: true },
  { id: 'p5', name: 'Twitter / X', slug: 'twitter', brandColor: getPlatformColor('twitter'), icon: 'flutter', isActive: true, isBuiltIn: true },
  { id: 'p6', name: 'WhatsApp Business', slug: 'whatsapp', brandColor: getPlatformColor('whatsapp'), icon: 'chat_bubble', isActive: true, isBuiltIn: true },
  { id: 'p7', name: 'Google Ads', slug: 'google-ads', brandColor: getPlatformColor('google-ads'), icon: 'ads_click', isActive: true, isBuiltIn: true },
  { id: 'p8', name: 'Google Maps', slug: 'google-maps', brandColor: getPlatformColor('google-maps'), icon: 'location_on', isActive: true, isBuiltIn: true },
  { id: 'p9', name: 'TikTok', slug: 'tiktok', brandColor: getPlatformColor('tiktok'), icon: 'music_note', isActive: true, isBuiltIn: true },
  { id: 'p10', name: 'Meta Ads', slug: 'meta-ads', brandColor: getPlatformColor('meta-ads'), icon: 'campaign', isActive: true, isBuiltIn: true },
  { id: 'p11', name: 'LinkedIn Ads', slug: 'linkedin-ads', brandColor: getPlatformColor('linkedin-ads'), icon: 'campaign', isActive: true, isBuiltIn: true },
  { id: 'p12', name: 'TikTok Ads', slug: 'tiktok-ads', brandColor: getPlatformColor('tiktok-ads'), icon: 'campaign', isActive: true, isBuiltIn: true },
  { id: 'p13', name: 'Snapchat Ads', slug: 'snapchat-ads', brandColor: getPlatformColor('snapchat-ads'), icon: 'campaign', isActive: true, isBuiltIn: true },
  { id: 'p14', name: 'Snapchat', slug: 'snapchat', brandColor: getPlatformColor('snapchat'), icon: 'photo_camera', isActive: true, isBuiltIn: true },
];

// Chart data exports for backward compatibility
/** Ad Manager accounts only (matches live chart filter); no organic social profile slugs. */
export const adSpendData = [
  { month: 'Oct', 'meta-ads': 210, 'google-ads': 95, 'linkedin-ads': 58, 'tiktok-ads': 42, 'snapchat-ads': 28 },
  { month: 'Nov', 'meta-ads': 225, 'google-ads': 102, 'linkedin-ads': 62, 'tiktok-ads': 48, 'snapchat-ads': 30 },
  { month: 'Dec', 'meta-ads': 218, 'google-ads': 98, 'linkedin-ads': 55, 'tiktok-ads': 44, 'snapchat-ads': 26 },
  { month: 'Jan', 'meta-ads': 240, 'google-ads': 110, 'linkedin-ads': 68, 'tiktok-ads': 52, 'snapchat-ads': 34 },
  { month: 'Feb', 'meta-ads': 255, 'google-ads': 118, 'linkedin-ads': 72, 'tiktok-ads': 56, 'snapchat-ads': 36 },
  { month: 'Mar', 'meta-ads': 270, 'google-ads': 128, 'linkedin-ads': 78, 'tiktok-ads': 60, 'snapchat-ads': 38 },
];

export const engagementRateData = [
  { platform: 'IG', slug: 'instagram', rate: 5.2, organicRate: 5.8, paidRate: 4.1, color: getPlatformColor('instagram') },
  { platform: 'FB', slug: 'facebook', rate: 2.8, organicRate: 2.1, paidRate: 4.5, color: getPlatformColor('facebook') },
  { platform: 'LI', slug: 'linkedin', rate: 6.1, organicRate: 5.5, paidRate: 7.2, color: getPlatformColor('linkedin') },
  { platform: 'YT', slug: 'youtube', rate: 4.5, organicRate: 4.8, paidRate: 3.2, color: getPlatformColor('youtube') },
  { platform: 'TK', slug: 'tiktok', rate: 7.1, organicRate: 8.4, paidRate: 5.2, color: getPlatformColor('tiktok') },
  { platform: 'X', slug: 'twitter', rate: 3.4, organicRate: 3.1, paidRate: 3.9, color: getPlatformColor('twitter') },
  { platform: 'SC', slug: 'snapchat', rate: 5.6, organicRate: 5.9, paidRate: 4.8, color: getPlatformColor('snapchat') },
  { platform: 'WA', slug: 'whatsapp', rate: 2.2, organicRate: 2.0, paidRate: 2.5, color: getPlatformColor('whatsapp') },
  { platform: 'GMB', slug: 'google-maps', rate: 1.9, organicRate: 1.7, paidRate: 2.1, color: getPlatformColor('google-maps') },
];

export const followerGrowthData = [
  { month: 'Oct', instagram: 12500, tiktok: 4200, youtube: 850, facebook: 6200, linkedin: 2100, snapchat: 1800, twitter: 3200 },
  { month: 'Nov', instagram: 14200, tiktok: 5800, youtube: 920, facebook: 6400, linkedin: 2280, snapchat: 1950, twitter: 3450 },
  { month: 'Dec', instagram: 13800, tiktok: 6200, youtube: 880, facebook: 6300, linkedin: 2240, snapchat: 1920, twitter: 3380 },
  { month: 'Jan', instagram: 18400, tiktok: 8400, youtube: 1100, facebook: 7100, linkedin: 2560, snapchat: 2240, twitter: 3900 },
  { month: 'Feb', instagram: 22100, tiktok: 11200, youtube: 1350, facebook: 7800, linkedin: 2890, snapchat: 2510, twitter: 4200 },
  { month: 'Mar', instagram: 26300, tiktok: 14500, youtube: 1680, facebook: 8400, linkedin: 3100, snapchat: 2780, twitter: 4580 },
];

export const reachOverTimeData = [
  { month: 'Oct', organic: 120000, paid: 45000, combined: 165000 },
  { month: 'Nov', organic: 145000, paid: 58000, combined: 203000 },
  { month: 'Dec', organic: 135000, paid: 52000, combined: 187000 },
  { month: 'Jan', organic: 180000, paid: 68000, combined: 248000 },
  { month: 'Feb', organic: 220000, paid: 82000, combined: 302000 },
  { month: 'Mar', organic: 260000, paid: 95000, combined: 355000 },
];

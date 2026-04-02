// ============================
// Demo / Mock data for all pages
// ============================

export interface KpiData {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export const kpiCards: KpiData[] = [
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

export interface PlatformMixItem {
  name: string;
  slug: string;
  value: number;
  color: string;
  icon: string;
}

export const platformMixData: PlatformMixItem[] = [
  { name: 'Instagram', slug: 'instagram', value: 32.0, color: '#E1306C', icon: 'photo_camera' },
  { name: 'TikTok', slug: 'tiktok', value: 31.2, color: '#000000', icon: 'music_note' },
  { name: 'YouTube', slug: 'youtube', value: 15.1, color: '#FF0000', icon: 'smart_display' },
  { name: 'Facebook', slug: 'facebook', value: 13.8, color: '#1877F2', icon: 'thumb_up' },
  { name: 'LinkedIn', slug: 'linkedin', value: 7.9, color: '#0A66C2', icon: 'work' },
];

export interface ReachOverTimeItem {
  month: string;
  organic: number;
  paid: number;
  combined: number;
}

export const reachOverTimeData: ReachOverTimeItem[] = [
  { month: 'Oct', organic: 120000, paid: 45000, combined: 165000 },
  { month: 'Nov', organic: 145000, paid: 58000, combined: 203000 },
  { month: 'Dec', organic: 135000, paid: 52000, combined: 187000 },
  { month: 'Jan', organic: 180000, paid: 68000, combined: 248000 },
  { month: 'Feb', organic: 220000, paid: 82000, combined: 302000 },
  { month: 'Mar', organic: 260000, paid: 95000, combined: 355000 },
];

export interface EngRateItem {
  platform: string;
  slug: string;
  rate: number;
  color: string;
}

export const engagementRateData: EngRateItem[] = [
  { platform: 'IG', slug: 'instagram', rate: 5.2, color: '#E1306C' },
  { platform: 'FB', slug: 'facebook', rate: 2.8, color: '#1877F2' },
  { platform: 'LI', slug: 'linkedin', rate: 6.1, color: '#0A66C2' },
  { platform: 'YT', slug: 'youtube', rate: 4.5, color: '#FF0000' },
  { platform: 'TK', slug: 'tiktok', rate: 7.1, color: '#000000' },
];

export interface AdSpendItem {
  month: string;
  instagram: number;
  facebook: number;
  youtube: number;
  linkedin: number;
  tiktok: number;
}

export const adSpendData: AdSpendItem[] = [
  { month: 'Oct', instagram: 280, facebook: 200, youtube: 120, linkedin: 80, tiktok: 60 },
  { month: 'Nov', instagram: 350, facebook: 250, youtube: 150, linkedin: 100, tiktok: 80 },
  { month: 'Dec', instagram: 480, facebook: 320, youtube: 180, linkedin: 120, tiktok: 100 },
  { month: 'Jan', instagram: 550, facebook: 380, youtube: 200, linkedin: 150, tiktok: 120 },
  { month: 'Feb', instagram: 600, facebook: 400, youtube: 210, linkedin: 200, tiktok: 140 },
  { month: 'Mar', instagram: 650, facebook: 420, youtube: 220, linkedin: 270, tiktok: 160 },
];

export interface FollowerGrowthItem {
  month: string;
  instagram: number;
  tiktok: number;
  youtube: number;
  facebook: number;
  linkedin: number;
}

export const followerGrowthData: FollowerGrowthItem[] = [
  { month: 'Oct', instagram: 12000, tiktok: 8000, youtube: 5000, facebook: 9500, linkedin: 3000 },
  { month: 'Nov', instagram: 13500, tiktok: 10200, youtube: 5800, facebook: 9800, linkedin: 3200 },
  { month: 'Dec', instagram: 14200, tiktok: 12400, youtube: 6200, facebook: 10000, linkedin: 3500 },
  { month: 'Jan', instagram: 15800, tiktok: 15000, youtube: 6800, facebook: 10200, linkedin: 3800 },
  { month: 'Feb', instagram: 17000, tiktok: 18500, youtube: 7400, facebook: 10500, linkedin: 4100 },
  { month: 'Mar', instagram: 18500, tiktok: 22000, youtube: 8200, facebook: 10800, linkedin: 4500 },
];

export interface PlatformPerformanceItem {
  name: string;
  slug: string;
  color: string;
  icon: string;
  orgReach: number;
  paidReach: number;
  spend: number;
}

export const platformPerformanceData: PlatformPerformanceItem[] = [
  { name: 'Instagram', slug: 'instagram', color: '#E1306C', icon: 'photo_camera', orgReach: 71000, paidReach: 52000, spend: 650 },
  { name: 'TikTok', slug: 'tiktok', color: '#000000', icon: 'music_note', orgReach: 105000, paidReach: 15000, spend: 160 },
  { name: 'YouTube', slug: 'youtube', color: '#FF0000', icon: 'smart_display', orgReach: 40000, paidReach: 18000, spend: 220 },
  { name: 'Facebook', slug: 'facebook', color: '#1877F2', icon: 'thumb_up', orgReach: 26000, paidReach: 27000, spend: 420 },
  { name: 'LinkedIn', slug: 'linkedin', color: '#0A66C2', icon: 'work', orgReach: 18500, paidReach: 12000, spend: 270 },
];

export interface PostItem {
  id: string;
  platform: string;
  platformSlug: string;
  platformColor: string;
  date: string;
  type: string;
  typeBadgeColor: string;
  caption: string;
  orgReach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engRate: number;
  isBoosted: boolean;
  spend: number | null;
}

export const postsData: PostItem[] = [
  {
    id: '1', platform: 'Instagram', platformSlug: 'instagram', platformColor: '#E1306C',
    date: '2026-03-22', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'New product launch event highlights...', orgReach: 428102, impressions: 612440,
    likes: 12402, comments: 842, shares: 2110, saves: 5320, engRate: 5.82, isBoosted: true, spend: 1200,
  },
  {
    id: '2', platform: 'TikTok', platformSlug: 'tiktok', platformColor: '#000000',
    date: '2026-03-20', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'Day in my life as a founder...', orgReach: 892300, impressions: 1204110,
    likes: 142000, comments: 4320, shares: 18500, saves: 12100, engRate: 14.2, isBoosted: false, spend: null,
  },
  {
    id: '3', platform: 'Instagram', platformSlug: 'instagram', platformColor: '#E1306C',
    date: '2026-03-18', type: 'CAROUSEL', typeBadgeColor: 'bg-blue-100 text-blue-700',
    caption: 'Behind the scenes of our creative studio', orgReach: 45102, impressions: 72400,
    likes: 3204, comments: 156, shares: 420, saves: 890, engRate: 4.10, isBoosted: false, spend: null,
  },
  {
    id: '4', platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: '#0A66C2',
    date: '2026-03-17', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: 'Why we stopped cold emailing in 2026', orgReach: 12400, impressions: 18200,
    likes: 842, comments: 94, shares: 122, saves: 210, engRate: 2.44, isBoosted: false, spend: null,
  },
  {
    id: '5', platform: 'YouTube', platformSlug: 'youtube', platformColor: '#FF0000',
    date: '2026-03-15', type: 'VIDEO', typeBadgeColor: 'bg-red-100 text-red-700',
    caption: 'How we grew to 1M users in 6 months', orgReach: 245000, impressions: 382000,
    likes: 22100, comments: 1840, shares: 3400, saves: 15200, engRate: 9.20, isBoosted: false, spend: null,
  },
  {
    id: '6', platform: 'Facebook', platformSlug: 'facebook', platformColor: '#1877F2',
    date: '2026-03-14', type: 'POST', typeBadgeColor: 'bg-green-100 text-green-700',
    caption: '3 mistakes every new entrepreneur makes', orgReach: 152400, impressions: 245100,
    likes: 5320, comments: 482, shares: 810, saves: 1100, engRate: 3.80, isBoosted: true, spend: 450,
  },
  {
    id: '7', platform: 'TikTok', platformSlug: 'tiktok', platformColor: '#000000',
    date: '2026-03-12', type: 'REEL', typeBadgeColor: 'bg-purple-100 text-purple-700',
    caption: 'Replying to the haters (storytime)...', orgReach: 1240000, impressions: 1820000,
    likes: 240000, comments: 8400, shares: 32100, saves: 24500, engRate: 18.4, isBoosted: false, spend: null,
  },
];

export interface InsightCard {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor: string;
  title: string;
  description: string;
  extra?: string;
}

export const insightCards: InsightCard[] = [
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

export interface ROITableItem {
  id: string;
  title: string;
  platform: string;
  platformSlug: string;
  platformColor: string;
  type: string;
  organicER: string;
  paidSpend: string;
  cpe: string;
  totalReach: string;
  roiScore: number;
  roiColor: string;
  recommendation: string;
  recColor: string;
  recBg: string;
}

export const roiTableData: ROITableItem[] = [
  {
    id: '1', title: 'New product launch', platform: 'Instagram', platformSlug: 'instagram',
    platformColor: '#E1306C', type: 'Carousel', organicER: '5.4%', paidSpend: '$1,240',
    cpe: '$0.12', totalReach: '842k', roiScore: 92, roiColor: 'text-tertiary',
    recommendation: 'Scale up', recColor: 'text-tertiary', recBg: 'bg-tertiary/10',
  },
  {
    id: '2', title: 'Day in my life', platform: 'TikTok', platformSlug: 'tiktok',
    platformColor: '#000000', type: 'Video', organicER: '7.2%', paidSpend: '$300',
    cpe: '$0.08', totalReach: '1.2M', roiScore: 87, roiColor: 'text-tertiary',
    recommendation: 'Boost this', recColor: 'text-primary', recBg: 'bg-primary/10',
  },
  {
    id: '3', title: 'Replying to the haters', platform: 'TikTok', platformSlug: 'tiktok',
    platformColor: '#000000', type: 'Video', organicER: '8.1%', paidSpend: '$0',
    cpe: 'n/a', totalReach: '54k', roiScore: 94, roiColor: 'text-tertiary',
    recommendation: 'Boost this', recColor: 'text-primary', recBg: 'bg-primary/10',
  },
  {
    id: '4', title: '3 mistakes', platform: 'Facebook', platformSlug: 'facebook',
    platformColor: '#1877F2', type: 'Single Image', organicER: '0.8%', paidSpend: '$420',
    cpe: '$2.40', totalReach: '12k', roiScore: 48, roiColor: 'text-error',
    recommendation: 'Cut budget', recColor: 'text-error', recBg: 'bg-error/10',
  },
];

export interface ConnectedAccountData {
  id: string;
  platform: string;
  platformSlug: string;
  platformColor: string;
  icon: string;
  accountName: string;
  accountHandle?: string;
  isConnected: boolean;
  lastSynced?: string;
  description?: string;
}

export const connectedAccountsData: ConnectedAccountData[] = [
  {
    id: '1', platform: 'Instagram', platformSlug: 'instagram', platformColor: '#E1306C',
    icon: 'photo_camera', accountName: 'Instagram Business', accountHandle: '@pulse_digital_official',
    isConnected: true, lastSynced: '4 mins ago',
  },
  {
    id: '2', platform: 'Facebook', platformSlug: 'facebook', platformColor: '#1877F2',
    icon: 'thumb_up', accountName: 'Facebook Pages', accountHandle: 'Pulse Analytics Global',
    isConnected: true, lastSynced: '12 mins ago',
  },
  {
    id: '3', platform: 'LinkedIn', platformSlug: 'linkedin', platformColor: '#0A66C2',
    icon: 'work', accountName: 'LinkedIn Company', isConnected: false,
    description: 'Track corporate reach and employee advocacy metrics.',
  },
  {
    id: '4', platform: 'TikTok', platformSlug: 'tiktok', platformColor: '#000000',
    icon: 'music_note', accountName: 'TikTok Creator', isConnected: false,
    description: 'Analyze short-form video performance and viral trends.',
  },
  {
    id: '5', platform: 'YouTube', platformSlug: 'youtube', platformColor: '#FF0000',
    icon: 'smart_display', accountName: 'YouTube Studio', accountHandle: 'Pulse Creative Hub',
    isConnected: true, lastSynced: '2 hours ago',
  },
  {
    id: '6', platform: 'Twitter / X', platformSlug: 'twitter', platformColor: '#000000',
    icon: 'tag', accountName: 'X / Twitter Ads', isConnected: false,
    description: 'Measure real-time engagement and paid campaign impact.',
  },
];

export interface DemoPlatform {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  icon: string;
  isActive: boolean;
  isBuiltIn: boolean;
}

export const demoPlatforms: DemoPlatform[] = [
  { id: 'p1', name: 'Instagram', slug: 'instagram', brandColor: '#E1306C', icon: 'photo_camera', isActive: true, isBuiltIn: true },
  { id: 'p2', name: 'Facebook', slug: 'facebook', brandColor: '#1877F2', icon: 'thumb_up', isActive: true, isBuiltIn: true },
  { id: 'p3', name: 'LinkedIn', slug: 'linkedin', brandColor: '#0A66C2', icon: 'work', isActive: true, isBuiltIn: true },
  { id: 'p4', name: 'YouTube', slug: 'youtube', brandColor: '#FF0000', icon: 'smart_display', isActive: true, isBuiltIn: true },
  { id: 'p5', name: 'Twitter / X', slug: 'twitter', brandColor: '#000000', icon: 'tag', isActive: true, isBuiltIn: true },
];

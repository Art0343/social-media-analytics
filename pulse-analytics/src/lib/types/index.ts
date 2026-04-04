// Type definitions shared across the application

export interface KpiData {
  title: string;
  value: string;
  delta: string;
  deltaPositive: boolean;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface PlatformMixItem {
  name: string;
  slug: string;
  value: number;
  color: string;
  icon: string;
}

export interface PlatformPerformanceItem {
  name: string;
  slug: string;
  color: string;
  icon: string;
  orgReach: number;
  paidReach: number;
  spend: number;
}

export interface Post {
  id: string;
  title: string;
  platform: string;
  platformSlug: string;
  platformColor: string;
  type: string;
  date: string;
  reach: string;
  engagement: string;
  typeBadgeColor: string;
}

export interface InsightCard {
  id: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  labelColor: string;
  title: string;
  description: string;
}

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

export interface ConnectedAccount {
  id: string;
  /** Organic / profile integrations vs paid media ad accounts */
  accountKind: 'social' | 'ad';
  platform: string;
  platformSlug: string;
  platformColor: string;
  icon: string;
  accountName: string;
  accountHandle?: string;
  isConnected: boolean;
  lastSynced?: string;
  description?: string;
  /** e.g. ad network scope: "Facebook + Instagram" */
  subtext?: string;
  /** Shown for connected ad accounts, e.g. "$1,070/mo" */
  monthlySpendLabel?: string;
  /** Set when loaded from API — used for disconnect */
  remoteAccountId?: string;
}

export interface DemoPlatform {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  icon: string;
  isActive: boolean;
  isBuiltIn: boolean;
}

import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import DashboardClient from './DashboardClient';
import {
  getActiveConnectedPlatformSlugs,
  summaryWhereForConnectedPlatforms,
  postWhereConnected,
} from '@/lib/connected-analytics';

interface KpiData {
  title: string;
  value: string;
  delta: { value: string; positive: boolean };
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface PlatformMixItem {
  name: string;
  slug: string;
  value: number;
  color: string;
  icon: string;
}

interface Totals {
  orgReach: number;
  paidReach: number;
  impressions: number;
  followers: number;
  adSpend: number;
}

async function getDashboardData(days: number = 30, workspaceId: string = 'ws-demo-pulse') {
  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const activeSlugs = await getActiveConnectedPlatformSlugs(workspaceId);

  // Aggregate metrics from PlatformDailySummary (only connected platforms)
  const summaries = await prisma.platformDailySummary.findMany({
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: startDate,
      lte: endDate,
    }),
  });

  console.log('DEBUG - Date range:', { startDate, endDate, days });
  console.log('DEBUG - WorkspaceId:', workspaceId);
  console.log('DEBUG - Summaries count:', summaries.length);
  console.log('DEBUG - First summary:', summaries[0]);
  console.log('DEBUG - Last summary:', summaries[summaries.length - 1]);

  // Calculate totals
  const totals = summaries.reduce<Totals>(
    (acc: Totals, summary: { orgReach: number | null; paidReach: number | null; impressions: number | null; followers: number | null; adSpend: number | null }) => ({
      orgReach: acc.orgReach + (summary.orgReach || 0),
      paidReach: acc.paidReach + (summary.paidReach || 0),
      impressions: acc.impressions + (summary.impressions || 0),
      adSpend: acc.adSpend + (summary.adSpend || 0),
      followers: Math.max(acc.followers, summary.followers || 0),
    }),
    { orgReach: 0, paidReach: 0, impressions: 0, adSpend: 0, followers: 0 }
  );

  // Get previous period for delta calculation
  const prevStartDate = subDays(startDate, days);
  const prevSummaries = await prisma.platformDailySummary.findMany({
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: prevStartDate,
      lt: startDate,
    }),
  });

  const prevTotals = prevSummaries.reduce<Totals>(
    (acc: Totals, summary: { orgReach: number | null; paidReach: number | null; impressions: number | null; followers: number | null; adSpend: number | null }) => ({
      orgReach: acc.orgReach + (summary.orgReach || 0),
      paidReach: acc.paidReach + (summary.paidReach || 0),
      impressions: acc.impressions + (summary.impressions || 0),
      adSpend: acc.adSpend + (summary.adSpend || 0),
      followers: Math.max(acc.followers, summary.followers || 0),
    }),
    { orgReach: 0, paidReach: 0, impressions: 0, adSpend: 0, followers: 0 }
  );

  // Calculate deltas
  const calcDelta = (current: number, previous: number) => {
    if (previous === 0) return { value: '0%', positive: true };
    const change = ((current - previous) / previous) * 100;
    return {
      value: `${Math.abs(change).toFixed(1)}%`,
      positive: change >= 0,
    };
  };

  // Calculate engagement rate from posts
  const posts = await prisma.post.findMany({
    where: postWhereConnected(workspaceId, {
      gte: startDate,
      lte: endDate,
    }),
  });

  const avgEngRate =
    posts.length > 0
      ? posts.reduce((sum: number, post: { engRate: number | null }) => sum + (post.engRate || 0), 0) / posts.length
      : 0;

  const prevPosts = await prisma.post.findMany({
    where: postWhereConnected(workspaceId, {
      gte: prevStartDate,
      lt: startDate,
    }),
  });

  const prevAvgEngRate =
    prevPosts.length > 0
      ? prevPosts.reduce((sum: number, post: { engRate: number | null }) => sum + (post.engRate || 0), 0) / prevPosts.length
      : 0;

  // Get follower growth
  const startOfPeriodSummary = await prisma.platformDailySummary.findFirst({
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: startDate,
    }),
    orderBy: { date: 'asc' },
  });

  const followerGrowth =
    totals.followers - (startOfPeriodSummary?.followers || totals.followers);

  const kpis: KpiData[] = [
    {
      title: 'Organic Reach',
      value: formatNumber(totals.orgReach),
      delta: calcDelta(totals.orgReach, prevTotals.orgReach),
      icon: 'groups',
      iconBg: 'bg-primary-fixed',
      iconColor: 'text-primary',
    },
    {
      title: 'Impressions',
      value: formatNumber(totals.impressions),
      delta: calcDelta(totals.impressions, prevTotals.impressions),
      icon: 'visibility',
      iconBg: 'bg-secondary-fixed',
      iconColor: 'text-secondary',
    },
    {
      title: 'Avg Engagement Rate',
      value: `${avgEngRate.toFixed(1)}%`,
      delta: calcDelta(avgEngRate, prevAvgEngRate),
      icon: 'bolt',
      iconBg: 'bg-tertiary-fixed',
      iconColor: 'text-tertiary',
    },
    {
      title: 'Follower Growth',
      value: formatNumber(followerGrowth),
      delta: calcDelta(totals.followers, prevTotals.followers),
      icon: 'person_add',
      iconBg: 'bg-surface-container-highest',
      iconColor: 'text-on-surface',
    },
  ];

  // Platform Mix
  const groupedSummaries = await prisma.platformDailySummary.groupBy({
    by: ['platformSlug'],
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: startDate,
      lte: endDate,
    }),
    _sum: {
      orgReach: true,
      paidReach: true,
    },
  });

  const platforms = await prisma.socialPlatform.findMany({
    where: { isActive: true },
  });

  const totalReach = groupedSummaries.reduce(
    (sum: number, s: { _sum: { orgReach: number | null; paidReach: number | null } }) => sum + ((s._sum.orgReach || 0) + (s._sum.paidReach || 0)),
    0
  );

  const platformColorMap: Record<string, string> = {
    instagram: '#E1306C',
    tiktok: '#000000',
    youtube: '#FF0000',
    facebook: '#1877F2',
    linkedin: '#0A66C2',
    twitter: '#000000',
    whatsapp: '#25D366',
    'google-ads': '#4285F4',
    'google-maps': '#4285F4',
    snapchat: '#000000',
    'meta-ads': '#1877F2',
    'linkedin-ads': '#0A66C2',
    'tiktok-ads': '#000000',
    'snapchat-ads': '#e5e500',
  };

  const platformIconMap: Record<string, string> = {
    instagram: 'photo_camera',
    tiktok: 'music_note',
    youtube: 'smart_display',
    facebook: 'thumb_up',
    linkedin: 'work',
    twitter: 'flutter',
    whatsapp: 'chat_bubble',
    'google-ads': 'ads_click',
    'google-maps': 'location_on',
    snapchat: 'photo_camera',
    'meta-ads': 'campaign',
    'linkedin-ads': 'campaign',
    'tiktok-ads': 'campaign',
    'snapchat-ads': 'campaign',
  };

  const platformMix: PlatformMixItem[] = groupedSummaries.map((s: { platformSlug: string; _sum: { orgReach: number | null; paidReach: number | null } }) => {
    const platform = platforms.find((p: { slug: string }) => p.slug === s.platformSlug);
    const reach = (s._sum.orgReach || 0) + (s._sum.paidReach || 0);
    const percentage = totalReach > 0 ? (reach / totalReach) * 100 : 0;

    return {
      name: platform?.name || s.platformSlug,
      slug: s.platformSlug,
      value: parseFloat(percentage.toFixed(1)),
      color: platform?.brandColor || platformColorMap[s.platformSlug] || '#666',
      icon: platformIconMap[s.platformSlug] || 'public',
    };
  });

  return { kpis, platformMix, totals, summaries, platforms };
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Promise<{ days?: string }>;
}) {
  const params = await searchParams;
  const days = parseInt(params?.days || '30', 10);
  const data = await getDashboardData(days);

  return <DashboardClient initialData={data} days={days} />;
}

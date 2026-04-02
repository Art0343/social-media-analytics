import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import PaidClient from './PaidClient';

async function getPaidData(days: number = 30, workspaceId: string = 'demo-workspace') {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Get platform summaries for paid metrics
  const summaries = await prisma.platformDailySummary.findMany({
    where: {
      workspaceId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Calculate totals
  const totalSpend = summaries.reduce((sum: number, s: { adSpend: number | null }) => sum + (s.adSpend || 0), 0);
  const totalPaidReach = summaries.reduce((sum: number, s: { paidReach: number | null }) => sum + (s.paidReach || 0), 0);

  // Get boosted posts
  const boostedPosts = await prisma.post.findMany({
    where: {
      workspaceId,
      isBoosted: true,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { paidSpend: 'desc' },
    take: 10,
  });

  // Get platforms for color mapping
  const platforms = await prisma.socialPlatform.findMany({
    where: { isActive: true },
  });

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
  };

  // Calculate platform performance
  const platformData = platforms.map((platform: { slug: string; name: string; brandColor: string | null }) => {
    const platformSummaries = summaries.filter((s: { platformSlug: string }) => s.platformSlug === platform.slug);
    const spend = platformSummaries.reduce((sum: number, s: { adSpend: number | null }) => sum + (s.adSpend || 0), 0);
    const paidReach = platformSummaries.reduce((sum: number, s: { paidReach: number | null }) => sum + (s.paidReach || 0), 0);
    const orgReach = platformSummaries.reduce((sum: number, s: { orgReach: number | null }) => sum + (s.orgReach || 0), 0);

    return {
      name: platform.name,
      slug: platform.slug,
      color: platform.brandColor || platformColorMap[platform.slug] || '#666',
      spend,
      paidReach,
      orgReach,
    };
  }).filter((p: { spend: number }) => p.spend > 0);

  // Calculate previous period for comparison
  const prevStartDate = subDays(startDate, days);
  const prevSummaries = await prisma.platformDailySummary.findMany({
    where: {
      workspaceId,
      date: {
        gte: prevStartDate,
        lt: startDate,
      },
    },
  });

  const prevSpend = prevSummaries.reduce((sum: number, s: { adSpend: number | null }) => sum + (s.adSpend || 0), 0);
  const prevPaidReach = prevSummaries.reduce((sum: number, s: { paidReach: number | null }) => sum + (s.paidReach || 0), 0);

  // Calculate metrics
  const avgCPE = totalPaidReach > 0 ? totalSpend / (totalPaidReach / 1000) : 0;
  const prevAvgCPE = prevPaidReach > 0 ? prevSpend / (prevPaidReach / 1000) : 0;

  // Format boosted posts with platform info
  const formattedBoostedPosts = boostedPosts.map((post: { id: string; platformSlug: string; caption: string; orgReach: number; paidReach: number | null; paidSpend: number | null }) => {
    const platform = platforms.find((p: { slug: string }) => p.slug === post.platformSlug);
    const cpe = post.paidReach && post.paidSpend
      ? post.paidSpend / (post.paidReach / 1000)
      : 0;

    return {
      id: post.id,
      title: post.caption.slice(0, 50) + (post.caption.length > 50 ? '...' : ''),
      platform: platform?.name || post.platformSlug,
      color: platform?.brandColor || platformColorMap[post.platformSlug] || '#666',
      orgReach: post.orgReach,
      paidReach: post.paidReach || 0,
      spend: post.paidSpend || 0,
      cpe,
      perf: cpe < 1 ? 'Excellent' : cpe < 3 ? 'Good' : 'Below Avg',
    };
  });

  return {
    totalSpend,
    totalPaidReach,
    avgCPE,
    prevSpend,
    prevPaidReach,
    prevAvgCPE,
    platformData,
    boostedPosts: formattedBoostedPosts,
  };
}

export default async function PaidPage() {
  const data = await getPaidData(30);
  return <PaidClient data={data} />;
}

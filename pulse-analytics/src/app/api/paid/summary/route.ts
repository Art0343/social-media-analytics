import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import {
  getActiveConnectedPlatformSlugs,
  summaryWhereForConnectedPlatforms,
  postWhereConnected,
} from '@/lib/connected-analytics';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  const workspaceId = searchParams.get('workspaceId') || 'ws-demo-pulse';

  const endDate = new Date();
  const startDate = subDays(endDate, days);
  const activeSlugs = await getActiveConnectedPlatformSlugs(workspaceId);

  // Get platform summaries for paid metrics (connected platforms only)
  const summaries = await prisma.platformDailySummary.findMany({
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: startDate,
      lte: endDate,
    }),
  });

  // Calculate totals
  const totalSpend = summaries.reduce((sum, s) => sum + (s.adSpend || 0), 0);
  const totalPaidReach = summaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);

  // Get boosted posts
  const boostedPosts = await prisma.post.findMany({
    where: {
      ...postWhereConnected(workspaceId, {
        gte: startDate,
        lte: endDate,
      }),
      isBoosted: true,
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
    snapchat: '#000000',
    'meta-ads': '#1877F2',
    'linkedin-ads': '#0A66C2',
    'tiktok-ads': '#000000',
    'snapchat-ads': '#e5e500',
  };

  // Calculate platform performance
  const platformData = platforms.map((platform) => {
    const platformSummaries = summaries.filter((s) => s.platformSlug === platform.slug);
    const spend = platformSummaries.reduce((sum, s) => sum + (s.adSpend || 0), 0);
    const paidReach = platformSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);
    const orgReach = platformSummaries.reduce((sum, s) => sum + (s.orgReach || 0), 0);

    return {
      name: platform.name,
      slug: platform.slug,
      color: platform.brandColor || platformColorMap[platform.slug] || '#666',
      spend,
      paidReach,
      orgReach,
    };
  }).filter((p) => p.spend > 0);

  // Calculate previous period for comparison
  const prevStartDate = subDays(startDate, days);
  const prevSummaries = await prisma.platformDailySummary.findMany({
    where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
      gte: prevStartDate,
      lt: startDate,
    }),
  });

  const prevSpend = prevSummaries.reduce((sum, s) => sum + (s.adSpend || 0), 0);
  const prevPaidReach = prevSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);

  // Calculate metrics
  const avgCPE = totalPaidReach > 0 ? totalSpend / (totalPaidReach / 1000) : 0;
  const prevAvgCPE = prevPaidReach > 0 ? prevSpend / (prevPaidReach / 1000) : 0;

  /** Proxy for blended ROAS (no revenue in DB): reach-per-spend efficiency scaled to a “×” readout */
  const blendedRoas = totalSpend > 0 ? totalPaidReach / (20 * totalSpend) : 0;
  const prevBlendedRoas = prevSpend > 0 ? prevPaidReach / (20 * prevSpend) : 0;

  // Format boosted posts with platform info
  const formattedBoostedPosts = boostedPosts.map((post) => {
    const platform = platforms.find((p) => p.slug === post.platformSlug);
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

  return NextResponse.json({
    totalSpend,
    totalPaidReach,
    avgCPE,
    blendedRoas,
    prevBlendedRoas,
    prevSpend,
    prevPaidReach,
    prevAvgCPE,
    platformData,
    boostedPosts: formattedBoostedPosts,
  });
}

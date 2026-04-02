import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, DEFAULT_CONFIG } from '@/lib/rate-limit';

interface Totals {
  orgReach: number;
  paidReach: number;
  impressions: number;
  adSpend: number;
  followers: number;
}

// GET /api/dashboard/summary?days=30&workspaceId=xxx
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `dashboard-summary:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, DEFAULT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, DEFAULT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const workspaceId = searchParams.get('workspaceId') || 'demo-workspace';

    // Verify user has access to this workspace
    const workspaceUser = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
      },
    });

    if (!workspaceUser) {
      return NextResponse.json(
        { error: 'Access denied to this workspace' },
        { status: 403 }
      );
    }

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Aggregate metrics from PlatformDailySummary
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
    const totals = summaries.reduce<Totals>(
      (acc: Totals, summary: { orgReach: number | null; paidReach: number | null; impressions: number | null; adSpend: number | null; followers: number | null }) => ({
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
      where: {
        workspaceId,
        date: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
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
      where: {
        workspaceId,
        publishedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const avgEngRate =
      posts.length > 0
        ? posts.reduce((sum: number, post: { engRate: number | null }) => sum + (post.engRate || 0), 0) / posts.length
        : 0;

    const prevPosts = await prisma.post.findMany({
      where: {
        workspaceId,
        publishedAt: {
          gte: prevStartDate,
          lt: startDate,
        },
      },
    });

    const prevAvgEngRate =
      prevPosts.length > 0
        ? prevPosts.reduce((sum: number, post: { engRate: number | null }) => sum + (post.engRate || 0), 0) / prevPosts.length
        : 0;

    // Get follower growth (current vs start of period)
    const startOfPeriodSummary = await prisma.platformDailySummary.findFirst({
      where: {
        workspaceId,
        date: {
          gte: startDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const followerGrowth =
      totals.followers - (startOfPeriodSummary?.followers || totals.followers);

    const followerDelta = calcDelta(totals.followers, prevTotals.followers);

    return NextResponse.json({
      kpis: [
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
          delta: followerDelta,
          icon: 'person_add',
          iconBg: 'bg-surface-container-highest',
          iconColor: 'text-on-surface',
        },
      ],
      platformMix: await getPlatformMix(workspaceId, startDate, endDate),
    }, { headers });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}

interface GroupedSummary {
  _sum: {
    orgReach: number | null;
    paidReach: number | null;
  };
  platformSlug: string;
}

interface PlatformInfo {
  slug: string;
  name: string;
  brandColor: string | null;
}

async function getPlatformMix(
  workspaceId: string,
  startDate: Date,
  endDate: Date
): Promise<Array<{ name: string; slug: string; value: number; color: string; icon: string }>> {
  const summaries = await prisma.platformDailySummary.groupBy({
    by: ['platformSlug'],
    where: {
      workspaceId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      orgReach: true,
      paidReach: true,
    },
  });

  const platforms = await prisma.socialPlatform.findMany({
    where: { isActive: true },
  });

  const totalReach = summaries.reduce(
    (sum: number, s: GroupedSummary) => sum + (s._sum.orgReach || 0) + (s._sum.paidReach || 0),
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
  };

  return summaries.map((s: GroupedSummary) => {
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

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format, eachDayOfInterval } from 'date-fns';
import {
  getActiveConnectedPlatformSlugs,
  summaryWhereForConnectedPlatforms,
} from '@/lib/connected-analytics';
import { getPlatformColor } from '@/lib/platform-colors';

// GET /api/dashboard/chart-data?days=30&workspaceId=xxx&type=reach|engagement|spend|followers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const workspaceId = searchParams.get('workspaceId') || 'ws-demo-pulse';
    const chartType = searchParams.get('type') || 'reach';

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const activeSlugs = await getActiveConnectedPlatformSlugs(workspaceId);

    // Generate date range
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    // Fetch summaries for the period (connected platforms only)
    const summaries = await prisma.platformDailySummary.findMany({
      where: summaryWhereForConnectedPlatforms(workspaceId, activeSlugs, {
        gte: startDate,
        lte: endDate,
      }),
      orderBy: { date: 'asc' },
    });

    // Platforms list for charts — only those still connected
    const allPlatforms = await prisma.socialPlatform.findMany({
      where: { isActive: true },
      select: { slug: true, name: true },
    });
    const platforms =
      activeSlugs.length === 0
        ? []
        : allPlatforms.filter((p) => activeSlugs.includes(p.slug));

    let data;

    switch (chartType) {
      case 'reach':
        data = formatReachData(dateRange, summaries, days);
        break;
      case 'engagement':
        data = formatEngagementData(summaries, platforms);
        break;
      case 'spend':
        data = formatSpendData(dateRange, summaries, platforms, days);
        break;
      case 'followers':
        data = formatFollowerData(dateRange, summaries, platforms, days);
        break;
      default:
        data = formatReachData(dateRange, summaries, days);
    }

    return NextResponse.json({ data, chartType });
  } catch (error) {
    console.error('Chart data error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}

function formatReachData(
  dateRange: Date[],
  summaries: any[],
  days: number
) {
  // For longer periods, group by month
  const isLongPeriod = days > 90;

  if (isLongPeriod) {
    const monthlyData: Record<string, { organic: number; paid: number }> = {};

    summaries.forEach((s) => {
      const monthKey = format(s.date, 'MMM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { organic: 0, paid: 0 };
      }
      monthlyData[monthKey].organic += s.orgReach;
      monthlyData[monthKey].paid += s.paidReach;
    });

    return Object.entries(monthlyData).map(([month, values]) => ({
      month,
      organic: values.organic,
      paid: values.paid,
      combined: values.organic + values.paid,
    }));
  }

  // For shorter periods, use the raw data aggregated by date
  const dailyData: Record<string, { organic: number; paid: number }> = {};

  dateRange.forEach((date) => {
    const key = format(date, 'MMM dd');
    dailyData[key] = { organic: 0, paid: 0 };
  });

  summaries.forEach((s) => {
    const key = format(s.date, 'MMM dd');
    if (dailyData[key]) {
      dailyData[key].organic += s.orgReach;
      dailyData[key].paid += s.paidReach;
    }
  });

  return Object.entries(dailyData).map(([date, values]) => ({
    month: date,
    organic: values.organic,
    paid: values.paid,
    combined: values.organic + values.paid,
  }));
}

function formatEngagementData(summaries: any[], platforms: any[]) {
  // Calculate average engagement rate per platform
  const platformEngagement: Record<string, { total: number; count: number }> =
    {};

  platforms.forEach((p) => {
    platformEngagement[p.slug] = { total: 0, count: 0 };
  });

  summaries.forEach((s) => {
    if (platformEngagement[s.platformSlug]) {
      platformEngagement[s.platformSlug].total += s.engRate;
      platformEngagement[s.platformSlug].count += 1;
    }
  });

  return Object.entries(platformEngagement)
    .filter(([_, data]) => data.count > 0)
    .map(([slug, data]) => ({
      platform: slug.substring(0, 2).toUpperCase(),
      slug,
      rate: parseFloat((data.total / data.count).toFixed(1)),
      color: getPlatformColor(slug),
    }));
}

function formatSpendData(
  dateRange: Date[],
  summaries: any[],
  platforms: any[],
  days: number
) {
  const isLongPeriod = days > 90;

  if (isLongPeriod) {
    const monthlyData: Record<string, Record<string, number>> = {};

    summaries.forEach((s) => {
      const monthKey = format(s.date, 'MMM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
      }
      if (!monthlyData[monthKey][s.platformSlug]) {
        monthlyData[monthKey][s.platformSlug] = 0;
      }
      monthlyData[monthKey][s.platformSlug] += s.adSpend;
    });

    return Object.entries(monthlyData).map(([month, platformSpending]) => ({
      month,
      ...platformSpending,
    }));
  }

  const dailyData: Record<string, Record<string, number>> = {};

  dateRange.forEach((date) => {
    const key = format(date, 'MMM dd');
    dailyData[key] = {};
  });

  summaries.forEach((s) => {
    const key = format(s.date, 'MMM dd');
    if (dailyData[key]) {
      if (!dailyData[key][s.platformSlug]) {
        dailyData[key][s.platformSlug] = 0;
      }
      dailyData[key][s.platformSlug] += s.adSpend;
    }
  });

  return Object.entries(dailyData).map(([month, platformSpending]) => ({
    month,
    ...platformSpending,
  }));
}

function formatFollowerData(
  dateRange: Date[],
  summaries: any[],
  platforms: any[],
  days: number
) {
  const isLongPeriod = days > 90;

  if (isLongPeriod) {
    const monthlyData: Record<string, Record<string, number>> = {};
    const lastSeen: Record<string, Record<string, number>> = {};

    summaries.forEach((s) => {
      const monthKey = format(s.date, 'MMM');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {};
        lastSeen[monthKey] = {};
      }
      monthlyData[monthKey][s.platformSlug] = s.followers;
      lastSeen[monthKey][s.platformSlug] = s.followers;
    });

    return Object.entries(monthlyData).map(([month, followers]) => ({
      month,
      ...followers,
    }));
  }

  const dailyData: Record<string, Record<string, number>> = {};

  dateRange.forEach((date) => {
    const key = format(date, 'MMM dd');
    dailyData[key] = {};
  });

  summaries.forEach((s) => {
    const key = format(s.date, 'MMM dd');
    if (dailyData[key]) {
      dailyData[key][s.platformSlug] = s.followers;
    }
  });

  return Object.entries(dailyData).map(([month, followers]) => ({
    month,
    ...followers,
  }));
}

import { prisma } from '@/lib/prisma';
import { subDays, format } from 'date-fns';
import ReportClient from './ReportClient';

async function getReportData(days: number = 30, workspaceId: string = 'ws-demo-pulse') {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Get platform summaries for the period
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
  const totalOrganicReach = summaries.reduce((sum: number, s: { orgReach: number | null }) => sum + (s.orgReach || 0), 0);
  const totalPaidReach = summaries.reduce((sum: number, s: { paidReach: number | null }) => sum + (s.paidReach || 0), 0);
  const totalAdSpend = summaries.reduce((sum: number, s: { adSpend: number | null }) => sum + (s.adSpend || 0), 0);
  const totalFollowers = summaries.reduce((max: number, s: { followers: number | null }) => Math.max(max, s.followers || 0), 0);
  const avgEngRate = summaries.length > 0
    ? summaries.reduce((sum: number, s: { engRate: number | null }) => sum + (s.engRate || 0), 0) / summaries.length
    : 0;

  // Get top organic posts
  const topOrganicPosts = await prisma.post.findMany({
    where: {
      workspaceId,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { orgReach: 'desc' },
    take: 3,
  });

  // Get top paid/boosted posts
  const topPaidPosts = await prisma.post.findMany({
    where: {
      workspaceId,
      isBoosted: true,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { paidReach: 'desc' },
    take: 3,
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

  // Format top organic posts
  const formattedOrganicPosts = topOrganicPosts.map((post: { id: string; platformSlug: string; caption: string; publishedAt: Date; orgReach: number }, index: number) => {
    const platform = platforms.find((p: { slug: string; name: string; brandColor: string | null }) => p.slug === post.platformSlug);
    return {
      rank: String(index + 1).padStart(2, '0'),
      title: `"${post.caption.slice(0, 30)}${post.caption.length > 30 ? '...' : ''}"`,
      platform: platform?.name || post.platformSlug,
      platformColor: platform?.brandColor || platformColorMap[post.platformSlug] || '#666',
      meta: format(post.publishedAt, 'MMM d'),
      value: post.orgReach >= 1000 ? `${(post.orgReach / 1000).toFixed(1)}K` : String(post.orgReach),
      label: 'Views',
    };
  });

  // Format top paid posts with ROAS
  const formattedPaidPosts = topPaidPosts.map((post: { id: string; platformSlug: string; caption: string; paidReach: number | null; paidSpend: number | null }, index: number) => {
    const platform = platforms.find((p: { slug: string; name: string; brandColor: string | null }) => p.slug === post.platformSlug);
    const roas = post.paidSpend && post.paidSpend > 0
      ? ((post.paidReach || 0) / post.paidSpend * 0.01).toFixed(1)
      : '0.0';
    return {
      rank: String(index + 1).padStart(2, '0'),
      title: `"${post.caption.slice(0, 30)}${post.caption.length > 30 ? '...' : ''}"`,
      platform: platform?.name || post.platformSlug,
      platformColor: platform?.brandColor || platformColorMap[post.platformSlug] || '#666',
      meta: `₹${post.paidSpend?.toFixed(0) || '0'} Spend`,
      value: `${roas}×`,
      label: 'ROAS',
    };
  });

  // Get AI report for content plan
  const aiReport = await prisma.aIInsightReport.findFirst({
    where: {
      workspaceId,
      period: 'monthly',
    },
    orderBy: { generatedAt: 'desc' },
  });

  // Parse content plan from AI report
  let contentPlan: Array<{ num: string; title: string; desc: string }> = [];
  if (aiReport) {
    try {
      const plan = JSON.parse(aiReport.contentPlan || '[]');
      contentPlan = plan.slice(0, 3).map((item: { title?: string; description?: string }, index: number) => ({
        num: String(index + 1).padStart(2, '0'),
        title: item.title || 'Content strategy',
        desc: item.description || 'Focus on high-engagement formats',
      }));
    } catch {
      // Use defaults if parsing fails
    }
  }

  // Default content plan if none available
  if (contentPlan.length === 0) {
    contentPlan = [
      { num: '01', title: 'Double down on high-performing formats', desc: 'Focus on content types that drove the highest engagement this period.' },
      { num: '02', title: 'Optimize posting schedule', desc: 'Post during peak engagement hours identified in analytics.' },
      { num: '03', title: 'Cross-platform content adaptation', desc: 'Repurpose top content for different platform formats.' },
    ];
  }

  // Generate insights based on data
  const tiktokReach = summaries
    .filter((s: { platformSlug: string }) => s.platformSlug === 'tiktok')
    .reduce((sum: number, s: { orgReach: number | null }) => sum + (s.orgReach || 0), 0);
  const tiktokPercent = totalOrganicReach > 0 ? Math.round((tiktokReach / totalOrganicReach) * 100) : 0;

  const insights = [
    { type: 'success' as const, text: `TikTok drove ${tiktokPercent}% of total organic reach — prioritize short-form video content.` },
    { type: 'success' as const, text: `Average engagement rate of ${avgEngRate.toFixed(1)}% is ${avgEngRate > 5 ? 'above' : 'below'} industry benchmark.` },
    { type: avgEngRate > 5 ? 'success' as const : 'warning' as const, text: totalAdSpend > 1000 ? `Ad spend of ₹${totalAdSpend.toFixed(0)} generated ${totalPaidReach >= 1000 ? `${(totalPaidReach / 1000).toFixed(1)}K` : totalPaidReach} paid reach.` : 'Consider increasing ad budget to amplify top-performing organic content.' },
    { type: 'warning' as const, text: 'Review underperforming platforms and reallocate budget to high-ROI channels.' },
  ];

  return {
    monthYear: format(endDate, 'MMMM yyyy'),
    stats: {
      totalOrganicReach: totalOrganicReach >= 1000 ? `${(totalOrganicReach / 1000).toFixed(0)}K` : String(totalOrganicReach),
      totalPaidReach: totalPaidReach >= 1000 ? `${(totalPaidReach / 1000).toFixed(0)}K` : String(totalPaidReach),
      totalAdSpend: `₹${totalAdSpend.toFixed(0)}`,
      avgEngRate: `${avgEngRate.toFixed(1)}%`,
      totalFollowers: totalFollowers >= 1000 ? `${(totalFollowers / 1000).toFixed(1)}K` : String(totalFollowers),
      roas: '3.6×',
    },
    topOrganicPosts: formattedOrganicPosts,
    topPaidPosts: formattedPaidPosts,
    insights,
    contentPlan,
  };
}

export default async function ReportPage() {
  const days = 30;
  const data = await getReportData(days);
  return <ReportClient initialData={data} initialDays={days} />;
}

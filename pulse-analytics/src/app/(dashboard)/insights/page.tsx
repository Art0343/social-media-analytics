import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import InsightsClient from './InsightsClient';

async function getInsightsData(days: number = 30, workspaceId: string = 'demo-workspace') {
  const endDate = new Date();
  const startDate = subDays(endDate, days);

  // Get AI insight reports
  const aiReport = await prisma.aIInsightReport.findFirst({
    where: {
      workspaceId,
      period: 'monthly',
    },
    orderBy: { generatedAt: 'desc' },
  });

  // Get top performing posts
  const topPosts = await prisma.post.findMany({
    where: {
      workspaceId,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { engRate: 'desc' },
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

  // Format ROI table data
  const roiTableData = topPosts.map((post: { id: string; platformSlug: string; caption: string; orgReach: number; paidReach: number | null; paidSpend: number | null; postType: string; engRate: number }) => {
    const platform = platforms.find((p: { slug: string; name: string; brandColor: string | null }) => p.slug === post.platformSlug);
    const totalReach = post.orgReach + (post.paidReach || 0);
    const cpe = post.paidReach && post.paidSpend
      ? post.paidSpend / (post.paidReach / 1000)
      : 0;
    const roiScore = Math.min(100, Math.round((post.engRate / 10) * 100));

    let recommendation = 'Monitor';
    let recColor = 'text-on-surface-variant';
    let recBg = 'bg-surface-container';

    if (roiScore >= 85) {
      recommendation = 'Scale up';
      recColor = 'text-tertiary';
      recBg = 'bg-tertiary/10';
    } else if (roiScore >= 70) {
      recommendation = 'Boost this';
      recColor = 'text-primary';
      recBg = 'bg-primary/10';
    } else if (roiScore < 50) {
      recommendation = 'Cut budget';
      recColor = 'text-error';
      recBg = 'bg-error/10';
    }

    return {
      id: post.id,
      title: post.caption.slice(0, 40) + (post.caption.length > 40 ? '...' : ''),
      platform: platform?.name || post.platformSlug,
      platformSlug: post.platformSlug,
      platformColor: platform?.brandColor || platformColorMap[post.platformSlug] || '#666',
      type: post.postType,
      organicER: `${post.engRate.toFixed(1)}%`,
      paidSpend: post.paidSpend ? `$${post.paidSpend.toFixed(0)}` : '$0',
      cpe: cpe > 0 ? `$${cpe.toFixed(2)}` : 'n/a',
      totalReach: totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}K` : totalReach.toString(),
      roiScore,
      roiColor: roiScore >= 80 ? 'text-tertiary' : roiScore >= 50 ? 'text-primary' : 'text-error',
      recommendation,
      recColor,
      recBg,
    };
  });

  // Parse AI report data if available
  let insightCards: Array<{ id: string; icon: string; iconBg: string; iconColor: string; label: string; labelColor: string; title: string; description: string }> = [];
  if (aiReport) {
    try {
      const topContent = JSON.parse(aiReport.topContent || '[]');
      const wastedSpend = JSON.parse(aiReport.wastedSpend || '[]');
      const boostCandidates = JSON.parse(aiReport.boostCandidates || '[]');
      const budgetReco = JSON.parse(aiReport.budgetReco || '[]');

      insightCards = [
        {
          id: 'top-performing',
          icon: 'rocket_launch',
          iconBg: 'bg-primary-fixed',
          iconColor: 'text-primary',
          label: 'Performance Hub',
          labelColor: 'text-primary',
          title: 'Top Performing Content',
          description: topContent[0]?.reason || 'Vertical video continues to dominate engagement cycles.',
        },
        {
          id: 'wasted-spend',
          icon: 'flag',
          iconBg: 'bg-error-container',
          iconColor: 'text-error',
          label: 'Alert',
          labelColor: 'text-error',
          title: 'Wasted Ad Spend Detected',
          description: wastedSpend[0]?.recommendation || 'Review underperforming campaigns for budget reallocation.',
        },
        {
          id: 'boost-candidates',
          icon: 'trending_up',
          iconBg: 'bg-tertiary-container',
          iconColor: 'text-on-tertiary-container',
          label: 'Conversion Potential',
          labelColor: 'text-tertiary',
          title: 'Organic → Boost Candidates',
          description: boostCandidates[0]?.reason || 'High engagement organic posts ready for paid promotion.',
        },
        {
          id: 'budget-reallocation',
          icon: 'electric_bolt',
          iconBg: 'bg-secondary-container',
          iconColor: 'text-on-secondary-container',
          label: 'Optimization',
          labelColor: 'text-secondary',
          title: 'Budget Reallocation Suggested',
          description: budgetReco[0]?.suggestion || 'Consider shifting budget to higher-performing platforms.',
        },
      ];
    } catch {
      // Use default insight cards if parsing fails
    }
  }

  // Get platform summaries for hero metrics
  const summaries = await prisma.platformDailySummary.findMany({
    where: {
      workspaceId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  const tiktokGrowth = summaries
    .filter((s: { platformSlug: string }) => s.platformSlug === 'tiktok')
    .reduce((acc: number, s: { orgReach: number | null }) => acc + (s.orgReach || 0), 0);

  return {
    insightCards,
    roiTableData,
    tiktokGrowth,
    postsAnalyzed: topPosts.length,
    platformsCount: platforms.length,
  };
}

export default async function InsightsPage() {
  const data = await getInsightsData(30);
  return <InsightsClient data={data} />;
}

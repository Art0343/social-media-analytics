'use client';

import dynamic from 'next/dynamic';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { useDateRange } from '@/lib/stores/useDateRange';

const ReachOverTimeChart = dynamic(() => import('@/components/charts/ReachOverTimeChart'), { ssr: false });
const PlatformMixChart = dynamic(() => import('@/components/charts/PlatformMixChart'), { ssr: false });
const EngagementRateChart = dynamic(() => import('@/components/charts/EngagementRateChart'), { ssr: false });
const AdSpendChart = dynamic(() => import('@/components/charts/AdSpendChart'), { ssr: false });
const FollowerGrowthChart = dynamic(() => import('@/components/charts/FollowerGrowthChart'), { ssr: false });

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

interface DashboardData {
  kpis: KpiData[];
  platformMix: PlatformMixItem[];
  totals: {
    orgReach: number;
    paidReach: number;
    impressions: number;
    adSpend: number;
    followers: number;
  };
  summaries: Array<{
    platformSlug: string;
    orgReach: number | null;
    paidReach: number | null;
    adSpend: number | null;
  }>;
  platforms: Array<{
    slug: string;
    name: string;
    brandColor: string | null;
    icon?: string;
  }>;
}

interface DashboardClientProps {
  initialData: DashboardData;
  days: number;
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const { label } = useDateRange();
  const { kpis, platformMix, totals, summaries, platforms } = initialData;

  // Calculate platform performance data from real data
  const platformPerformanceData = platforms.map((platform) => {
    const platformSummaries = summaries.filter((s) => s.platformSlug === platform.slug);
    const orgReach = platformSummaries.reduce((sum, s) => sum + (s.orgReach || 0), 0);
    const paidReach = platformSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);
    const spend = platformSummaries.reduce((sum, s) => sum + (s.adSpend || 0), 0);

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

    return {
      name: platform.name,
      slug: platform.slug,
      color: platform.brandColor || '#666',
      icon: platformIconMap[platform.slug] || 'public',
      orgReach,
      paidReach,
      spend,
    };
  });

  return (
    <section className="p-8 space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((card) => (
          <div
            key={card.title}
            className="bg-surface-container-lowest p-6 rounded-xl border-none shadow-[0_8px_24px_rgba(19,27,46,0.06)] group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 ${card.iconBg} rounded-lg ${card.iconColor} material-symbols-outlined`}>
                {card.icon}
              </span>
              <span className={`text-xs font-bold flex items-center gap-1 ${card.delta.positive ? 'text-tertiary' : 'text-error'}`}>
                <span className="material-symbols-outlined text-xs">
                  {card.delta.positive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {card.delta.value}
              </span>
            </div>
            <p className="text-secondary text-sm font-medium mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-on-surface tracking-tight">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reach Over Time */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold text-on-surface mb-1">Reach Over Time</h4>
              <p className="text-secondary text-xs">Comparison between Organic and Paid channels ({label})</p>
            </div>
          </div>
          <ReachOverTimeChart />
        </div>

        {/* Platform Mix */}
        <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <h4 className="text-xl font-bold text-on-surface mb-6 w-full">Platform Mix</h4>
          <PlatformMixChart data={platformMix} />
        </div>
      </div>

      {/* Detail Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <h4 className="text-lg font-bold text-on-surface mb-6">Engagement Rate (%)</h4>
          <EngagementRateChart />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <h4 className="text-lg font-bold text-on-surface mb-6">Ad Spend (₹)</h4>
          <AdSpendChart />
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <h4 className="text-lg font-bold text-on-surface mb-6">Follower Growth</h4>
          <FollowerGrowthChart />
        </div>
      </div>

      {/* Platform Performance Breakdown */}
      <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h4 className="text-2xl font-black text-on-surface">Platform Performance Breakdown</h4>
            <p className="text-secondary text-sm">Detailed metric analysis by social network</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-12 h-2 rounded-full bg-slate-200" />
              <span className="text-[10px] font-bold text-secondary uppercase">Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold text-secondary uppercase">Paid</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {platformPerformanceData.map((p) => {
            const total = p.orgReach + p.paidReach;
            const orgPct = total > 0 ? (p.orgReach / total) * 100 : 0;
            const paidPct = total > 0 ? (p.paidReach / total) * 100 : 0;
            return (
              <div key={p.slug} className="grid grid-cols-12 items-center gap-4 group">
                <div className="col-span-2 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                    style={{
                      backgroundColor: p.color,
                      backgroundImage: p.slug === 'instagram'
                        ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
                        : undefined,
                    }}
                  >
                    <span className="material-symbols-outlined text-xl">{p.icon}</span>
                  </div>
                  <span className="font-bold text-sm">{p.name}</span>
                </div>
                <div className="col-span-6 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
                    <span>Organic: {formatNumber(p.orgReach)}</span>
                    <span>Paid: {formatNumber(p.paidReach)}</span>
                  </div>
                  <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                    <div className="h-full" style={{ width: `${orgPct}%`, backgroundColor: p.color }} />
                    <div className="h-full bg-amber-400" style={{ width: `${paidPct}%` }} />
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <p className="text-[10px] text-secondary font-bold uppercase mb-1">Spend</p>
                  <p className="text-sm font-black text-[#b8860b]">{formatCurrency(p.spend)}</p>
                </div>
                <div className="col-span-2 text-right">
                  <button className="text-primary hover:bg-primary-fixed px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-low rounded-xl p-6 border-none">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
          </div>
          <div>
            <h5 className="text-sm font-bold text-on-surface">Pulse AI Insight</h5>
            <p className="text-xs text-on-surface-variant">
              Your Organic Reach on TikTok has surpassed Instagram for the first time this quarter.
              Consider shifting 5% of LinkedIn budget to TikTok ads.
            </p>
          </div>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-full text-xs font-bold shadow-md hover:shadow-lg transition-all">
          Apply Recommendation
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-[10px] text-secondary font-medium tracking-widest uppercase pb-8">
        © 2026 Pulse Analytics Dashboard — Confidential Data
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-linear-to-br from-primary to-primary-container text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </section>
  );
}

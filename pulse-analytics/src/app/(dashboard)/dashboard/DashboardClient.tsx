'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { formatNumber, formatCurrency, parseFormattedNumber } from '@/lib/utils';
import { useDateRange } from '@/lib/stores/useDateRange';
import { useReachType, ReachType } from '@/lib/stores/useReachType';

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
    date?: Date;
  }>;
  platforms: Array<{
    slug: string;
    name: string;
    brandColor: string | null;
    icon?: string;
  }>;
  posts?: Array<{
    engRate: number | null;
    orgReach: number | null;
    paidReach: number | null;
  }>;
}

interface DashboardClientProps {
  initialData: DashboardData;
  days: number;
}

export default function DashboardClient({ initialData, days: initialDays }: DashboardClientProps) {
  const { label, days, range } = useDateRange();
  const { reachType, setReachType } = useReachType();
  const [data, setData] = useState<DashboardData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingDays, setPendingDays] = useState<number | null>(null);
  
  // Cache for fetched data
  const dataCache = useRef<Record<number, DashboardData>>({ [initialDays]: initialData });
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Fetch data when date range changes with debouncing and caching
  const fetchDashboardData = useCallback(async (targetDays: number) => {
    // Check cache first
    if (dataCache.current[targetDays]) {
      setData(dataCache.current[targetDays]);
      setPendingDays(null);
      return;
    }
    
    setIsLoading(true);
    try {
      const url = `/api/dashboard/summary?days=${targetDays}&workspaceId=ws-demo-pulse`;
      const response = await fetch(url, { cache: 'no-store', credentials: 'include' });
      if (response.ok) {
        const newData = await response.json();
        // Store in cache
        dataCache.current[targetDays] = newData;
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
      setPendingDays(null);
    }
  }, []);

  // Handle date changes with debounce
  useEffect(() => {
    if (days === initialDays && dataCache.current[days]) {
      setData(dataCache.current[days]);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Show pending state immediately
    setPendingDays(days);

    // Debounce the actual fetch
    debounceTimer.current = setTimeout(() => {
      fetchDashboardData(days);
    }, 150); // 150ms debounce for quick clicks

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [days, initialDays, fetchDashboardData]);

  const { kpis, platformMix, totals, summaries, platforms } = data;

  // Filter data based on reach type - memoized
  const getReachValue = useCallback((org: number | null, paid: number | null, type: ReachType) => {
    switch (type) {
      case 'organic': return org || 0;
      case 'paid': return paid || 0;
      case 'combined': return (org || 0) + (paid || 0);
      default: return (org || 0) + (paid || 0);
    }
  }, []);

  // Memoized filtered KPIs
  const filteredKpis = useMemo(() => {
    console.log('DEBUG - Computing filteredKpis:', { reachType, totals, firstKpiTitle: kpis[0]?.title });
    
    // Multipliers to simulate organic vs paid vs combined (based on typical patterns)
    const multipliers = {
      organic: { impressions: 0.58, engagement: 1.12, followers: 1.08 },
      paid: { impressions: 0.42, engagement: 0.88, followers: 0.92 },
      combined: { impressions: 1.0, engagement: 1.0, followers: 1.0 },
    };
    const m = multipliers[reachType];
    
    const result = kpis.map((kpi) => {
      // Transform Reach card - we have separate organic/paid data from API
      if (kpi.icon === 'groups' || kpi.title === 'Organic Reach' || kpi.title === 'Paid Reach' || kpi.title === 'Total Reach') {
        const reach = getReachValue(totals.orgReach, totals.paidReach, reachType);
        return {
          ...kpi,
          title: reachType === 'organic' ? 'Organic Reach' : reachType === 'paid' ? 'Paid Reach' : 'Total Reach',
          value: formatNumber(reach),
        };
      }
      
      // Transform Impressions (visibility icon) - estimate based on reach type
      if (kpi.icon === 'visibility') {
        const baseValue = parseFormattedNumber(kpi.value);
        const adjusted = Math.round(baseValue * m.impressions);
        return {
          ...kpi,
          value: formatNumber(adjusted),
        };
      }
      
      // Transform Engagement Rate (bolt icon)
      if (kpi.icon === 'bolt') {
        const baseValue = parseFloat(kpi.value.replace('%', ''));
        const adjusted = (baseValue * m.engagement).toFixed(1);
        return {
          ...kpi,
          value: `${adjusted}%`,
        };
      }
      
      // Transform Follower Growth (person_add icon)
      if (kpi.icon === 'person_add') {
        const baseValue = parseFormattedNumber(kpi.value);
        const adjusted = Math.round(baseValue * m.followers);
        return {
          ...kpi,
          value: formatNumber(adjusted),
        };
      }
      
      return kpi;
    });
    console.log('DEBUG - filteredKpis result:', result.map(k => ({ title: k.title, value: k.value })));
    return result;
  }, [kpis, totals, reachType, getReachValue]);

  // Memoized filtered platform mix
  const filteredPlatformMix = useMemo(() => {
    const totalReach = platformMix.reduce((acc, p) => {
      const pSummaries = summaries.filter(s => s.platformSlug === p.slug);
      const pOrg = pSummaries.reduce((sum, s) => sum + (s.orgReach || 0), 0);
      const pPaid = pSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);
      return acc + getReachValue(pOrg, pPaid, reachType);
    }, 0);

    return platformMix.map((item) => {
      const platformSummaries = summaries.filter(s => s.platformSlug === item.slug);
      const orgReach = platformSummaries.reduce((sum, s) => sum + (s.orgReach || 0), 0);
      const paidReach = platformSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);
      const reach = getReachValue(orgReach, paidReach, reachType);
      return {
        ...item,
        value: totalReach > 0 ? parseFloat(((reach / totalReach) * 100).toFixed(1)) : 0,
      };
    });
  }, [platformMix, summaries, reachType, getReachValue]);

  // Memoized processed summaries for chart
  const processedChartData = useMemo(() => {
    if (!summaries || summaries.length === 0) return [];

    const byDate = summaries.reduce((acc, s) => {
      const dateKey = s.date ? new Date(s.date).toISOString().split('T')[0] : 'unknown';
      if (!acc[dateKey]) acc[dateKey] = { organic: 0, paid: 0 };
      acc[dateKey].organic += s.orgReach || 0;
      acc[dateKey].paid += s.paidReach || 0;
      return acc;
    }, {} as Record<string, { organic: number; paid: number }>);

    const monthlyData: Record<string, { organic: number; paid: number; count: number }> = {};
    Object.keys(byDate).forEach(dateKey => {
      const date = new Date(dateKey);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[monthKey]) monthlyData[monthKey] = { organic: 0, paid: 0, count: 0 };
      monthlyData[monthKey].organic += byDate[dateKey].organic;
      monthlyData[monthKey].paid += byDate[dateKey].paid;
      monthlyData[monthKey].count += 1;
    });

    return Object.keys(monthlyData).map(month => {
      const organic = Math.round(monthlyData[month].organic / monthlyData[month].count);
      const paid = Math.round(monthlyData[month].paid / monthlyData[month].count);
      return {
        month,
        organic,
        paid,
        combined: organic + paid,
        filtered: reachType === 'organic' ? organic : reachType === 'paid' ? paid : organic + paid,
      };
    });
  }, [summaries, reachType]);

  // Memoized platform performance data
  const platformPerformanceData = useMemo(() => {
    console.log('DEBUG - Computing platformPerformanceData:', { reachType, platformsCount: platforms.length, summariesCount: summaries.length });
    return platforms.map((platform) => {
      const platformSummaries = summaries.filter((s) => s.platformSlug === platform.slug);
      const orgReach = platformSummaries.reduce((sum, s) => sum + (s.orgReach || 0), 0);
      const paidReach = platformSummaries.reduce((sum, s) => sum + (s.paidReach || 0), 0);
      const spend = platformSummaries.reduce((sum, s) => sum + (s.adSpend || 0), 0);

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

      // Filter based on reach type
      let filteredOrg = 0;
      let filteredPaid = 0;
      let filteredSpend = 0;
      
      if (reachType === 'organic') {
        filteredOrg = orgReach;
        filteredPaid = 0;
        filteredSpend = 0;
      } else if (reachType === 'paid') {
        filteredOrg = 0;
        filteredPaid = paidReach;
        filteredSpend = spend;
      } else { // combined
        filteredOrg = orgReach;
        filteredPaid = paidReach;
        filteredSpend = spend;
      }

      return {
        name: platform.name,
        slug: platform.slug,
        color: platform.brandColor || '#666',
        icon: platformIconMap[platform.slug] || 'public',
        orgReach: filteredOrg,
        paidReach: filteredPaid,
        spend: filteredSpend,
      };
    }).filter(p => p.orgReach > 0 || p.paidReach > 0);
  }, [platforms, summaries, reachType]);

  // Skeleton components for smooth loading
  const KpiSkeleton = () => (
    <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl border border-outline-variant/10 dark:border-[#334155] shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-surface-container-high dark:bg-[#334155] rounded-lg" />
        <div className="w-12 h-4 bg-surface-container-high dark:bg-[#334155] rounded" />
      </div>
      <div className="w-24 h-3 bg-surface-container-high dark:bg-[#334155] rounded mb-2" />
      <div className="w-20 h-8 bg-surface-container-high dark:bg-[#334155] rounded" />
    </div>
  );

  const ChartSkeleton = ({ height = 280 }: { height?: number }) => (
    <div className="animate-pulse">
      <div className="h-6 w-32 bg-surface-container-high dark:bg-[#334155] rounded mb-4" />
      <div style={{ height }} className="bg-surface-container-high dark:bg-[#334155] rounded-lg" />
    </div>
  );

  const PlatformSkeleton = () => (
    <div className="grid grid-cols-12 items-center gap-4 py-3 animate-pulse">
      <div className="col-span-2 flex items-center gap-3">
        <div className="w-10 h-10 bg-surface-container-high dark:bg-[#334155] rounded-full" />
        <div className="w-20 h-4 bg-surface-container-high dark:bg-[#334155] rounded" />
      </div>
      <div className="col-span-6 space-y-2">
        <div className="flex justify-between">
          <div className="w-16 h-3 bg-surface-container-high dark:bg-[#334155] rounded" />
          <div className="w-16 h-3 bg-surface-container-high dark:bg-[#334155] rounded" />
        </div>
        <div className="h-3 w-full bg-surface-container-high dark:bg-[#334155] rounded-full" />
      </div>
      <div className="col-span-2 text-center">
        <div className="w-12 h-3 bg-surface-container-high dark:bg-[#334155] rounded mx-auto mb-1" />
        <div className="w-16 h-4 bg-surface-container-high dark:bg-[#334155] rounded mx-auto" />
      </div>
      <div className="col-span-2 text-right">
        <div className="w-16 h-6 bg-surface-container-high dark:bg-[#334155] rounded ml-auto" />
      </div>
    </div>
  );

  return (
    <section className="p-8 space-y-8 bg-surface dark:bg-[#0a0f1c] min-h-screen">
      {/* Reach Type Toggle */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-secondary">
          Current: <span className="font-bold text-primary">{reachType}</span> | 
          Reach: <span className="font-bold text-primary">{formatNumber(getReachValue(totals.orgReach, totals.paidReach, reachType))}</span>
        </div>
        <div className="bg-surface-container-low dark:bg-[#1e293b] p-1.5 rounded-xl inline-flex gap-1">
          {(['organic', 'paid', 'combined'] as ReachType[]).map((type) => (
            <button
              key={type}
              onClick={() => setReachType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                reachType === type
                  ? 'bg-primary dark:bg-[#3b82f6] text-white shadow-md'
                  : 'text-secondary dark:text-gray-400 hover:bg-surface-container-high dark:hover:bg-[#334155]'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div key={`kpis-${reachType}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading || pendingDays !== null
          ? Array(4).fill(0).map((_, i) => <KpiSkeleton key={i} />)
          : filteredKpis.map((card, idx) => (
          <div
            key={`${card.title}-${idx}`}
            className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl border border-outline-variant/10 dark:border-[#334155] shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 group hover:-translate-y-1 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`p-2 ${card.iconBg} rounded-lg ${card.iconColor} material-symbols-outlined`}>
                {card.icon}
              </span>
              <span className={`text-xs font-bold flex items-center gap-1 ${card.delta.positive ? 'text-tertiary dark:text-green-400' : 'text-error dark:text-red-400'}`}>
                <span className="material-symbols-outlined text-xs">
                  {card.delta.positive ? 'arrow_upward' : 'arrow_downward'}
                </span>
                {card.delta.value}
              </span>
            </div>
            <p className="text-secondary dark:text-gray-400 text-sm font-medium mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-on-surface dark:text-white tracking-tight">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div key={`charts-${reachType}`} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Reach Over Time */}
        <div className="lg:col-span-8 bg-surface-container-lowest dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-xl font-bold text-on-surface dark:text-white mb-1">Reach Over Time</h4>
              <p className="text-secondary dark:text-gray-400 text-xs">Comparison between Organic and Paid channels ({label})</p>
            </div>
          </div>
          <div className="h-[280px]">
            {isLoading || pendingDays !== null ? (
              <ChartSkeleton height={280} />
            ) : (
              <ReachOverTimeChart data={processedChartData} />
            )}
          </div>
        </div>

        {/* Platform Mix */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
          <h4 className="text-xl font-bold text-on-surface dark:text-white mb-6 w-full">Platform Mix</h4>
          <div className="h-[280px]">
            {isLoading || pendingDays !== null ? (
              <ChartSkeleton height={280} />
            ) : (
              <PlatformMixChart data={filteredPlatformMix} />
            )}
          </div>
        </div>
      </div>

      {/* Detail Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
          <h4 className="text-lg font-bold text-on-surface dark:text-white mb-6">
            {reachType === 'organic' ? 'Organic' : reachType === 'paid' ? 'Paid' : 'Organic vs Paid'} Engagement Rate (%)
          </h4>
          <div className="h-[200px]">
            {isLoading || pendingDays !== null ? (
              <ChartSkeleton height={200} />
            ) : (
              <EngagementRateChart reachType={reachType} />
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
          <h4 className="text-lg font-bold text-on-surface dark:text-white mb-6">Ad Spend (₹)</h4>
          <div className="h-[200px]">
            {isLoading || pendingDays !== null ? (
              <ChartSkeleton height={200} />
            ) : reachType === 'organic' ? (
              <div className="h-full flex flex-col items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-4xl mb-2">money_off</span>
                <p className="text-sm font-medium">No ad spend in Organic view</p>
              </div>
            ) : (
              <AdSpendChart />
            )}
          </div>
        </div>
        <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
          <h4 className="text-lg font-bold text-on-surface dark:text-white mb-6">Follower Growth</h4>
          <div className="h-[200px]">
            {isLoading || pendingDays !== null ? (
              <ChartSkeleton height={200} />
            ) : (
              <FollowerGrowthChart reachType={reachType} />
            )}
          </div>
        </div>
      </div>

      {/* Platform Performance Breakdown */}
      <div key={`platform-performance-${reachType}`} className="bg-surface-container-lowest dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155]">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h4 className="text-2xl font-black text-on-surface dark:text-white">Platform Performance Breakdown</h4>
            <p className="text-secondary dark:text-gray-400 text-sm">Detailed metric analysis by social network</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-12 h-2 rounded-full bg-slate-200 dark:bg-[#475569]" />
              <span className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase">Organic</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 h-2 rounded-full bg-amber-400" />
              <span className="text-[10px] font-bold text-secondary dark:text-gray-400 uppercase">Paid</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {isLoading || pendingDays !== null
            ? Array(5).fill(0).map((_, i) => <PlatformSkeleton key={i} />)
            : platformPerformanceData.map((p) => {
            const total = p.orgReach + p.paidReach;
            const orgPct = total > 0 ? (p.orgReach / total) * 100 : 0;
            const paidPct = total > 0 ? (p.paidReach / total) * 100 : 0;
            const showOrganic = reachType === 'organic' || reachType === 'combined';
            const showPaid = reachType === 'paid' || reachType === 'combined';
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
                    {showOrganic && <span>Organic: {formatNumber(p.orgReach)}</span>}
                    {showPaid && <span>Paid: {formatNumber(p.paidReach)}</span>}
                    {!showOrganic && !showPaid && <span>Reach: {formatNumber(total)}</span>}
                  </div>
                  <div className="h-3 w-full bg-surface-container dark:bg-[#334155] rounded-full overflow-hidden">
                    {reachType === 'organic' ? (
                      <div className="h-full w-full" style={{ backgroundColor: p.color }} />
                    ) : reachType === 'paid' ? (
                      <div className="h-full w-full bg-amber-400" />
                    ) : (
                      <div className="h-full w-full flex">
                        <div className="h-full" style={{ width: `${orgPct}%`, backgroundColor: p.color }} />
                        <div className="h-full bg-amber-400" style={{ width: `${paidPct}%` }} />
                      </div>
                    )}
                  </div>
                  <div className="text-[9px] text-secondary opacity-50">{p.slug} | org:{p.orgReach} paid:{p.paidReach}</div>
                </div>
                <div className="col-span-2 text-center">
                  {showPaid && (
                    <>
                      <p className="text-[10px] text-secondary font-bold uppercase mb-1">Spend</p>
                      <p className="text-sm font-black text-[#b8860b]">{formatCurrency(p.spend)}</p>
                    </>
                  )}
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
      <div className="flex flex-col md:flex-row justify-between items-center bg-surface-container-low dark:bg-[#1e293b] rounded-xl p-6 border border-outline-variant/10 dark:border-[#334155]">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-12 h-12 bg-surface-container-high dark:bg-[#334155] rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-primary dark:text-[#60a5fa] text-2xl">auto_awesome</span>
          </div>
          <div>
            <h5 className="text-sm font-bold text-on-surface dark:text-white">Pulse AI Insight</h5>
            <p className="text-xs text-on-surface-variant dark:text-gray-400">
              Your Organic Reach on TikTok has surpassed Instagram for the first time this quarter.
              Consider shifting 5% of LinkedIn budget to TikTok ads.
            </p>
          </div>
        </div>
        <button className="bg-primary dark:bg-[#3b82f6] text-white px-6 py-2 rounded-full text-xs font-bold shadow-md hover:bg-primary-container dark:hover:bg-[#2563eb] transition-all">
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

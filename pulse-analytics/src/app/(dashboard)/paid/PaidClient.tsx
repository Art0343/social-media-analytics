'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { useDateRange } from '@/lib/stores/useDateRange';
import type { AdSpendChartRow, AdSpendStackKey } from '@/lib/ad-spend-chart-from-summaries';

const AdSpendChart = dynamic(() => import('@/components/charts/AdSpendChart'), { ssr: false });

interface PaidData {
  totalSpend: number;
  totalPaidReach: number;
  avgCPE: number;
  /** Reach-efficiency proxy (no revenue field in DB); varies with selected date range */
  blendedRoas: number;
  prevBlendedRoas: number;
  prevSpend: number;
  prevPaidReach: number;
  prevAvgCPE: number;
  platformData: Array<{
    name: string;
    slug: string;
    color: string;
    spend: number;
    paidReach: number;
    orgReach: number;
  }>;
  boostedPosts: Array<{
    id: string;
    title: string;
    platform: string;
    color: string;
    orgReach: number;
    paidReach: number;
    spend: number;
    cpe: number;
    perf: string;
  }>;
  adSpendChart: { data: AdSpendChartRow[]; stackKeys: AdSpendStackKey[] };
}

interface PaidClientProps {
  initialData: PaidData;
  initialDays: number;
}

function calcDelta(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) return { value: '0%', positive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${Math.abs(change).toFixed(1)}%`,
    positive: change >= 0,
  };
}

/** Change in ROAS “×” vs prior period */
function calcRoasDelta(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) {
    if (current === 0) return { value: '0.0×', positive: true };
    return { value: `${current.toFixed(1)}×`, positive: true };
  }
  const diff = current - previous;
  return {
    value: `${Math.abs(diff).toFixed(1)}×`,
    positive: diff >= 0,
  };
}

export default function PaidClient({ initialData, initialDays }: PaidClientProps) {
  const { days } = useDateRange();
  const [data, setData] = useState<PaidData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (days === initialDays) {
      setData(initialData);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/paid/summary?days=${days}&workspaceId=ws-demo-pulse`);
      if (response.ok) {
        const newData = await response.json();
        setData(newData);
      }
    } catch (error) {
      console.error('Failed to fetch paid data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [days, initialDays, initialData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const {
    totalSpend,
    totalPaidReach,
    avgCPE,
    blendedRoas,
    prevBlendedRoas,
    prevSpend,
    prevPaidReach,
    prevAvgCPE,
    platformData,
    boostedPosts,
    adSpendChart,
  } = data;

  const spendDelta = calcDelta(totalSpend, prevSpend);
  const reachDelta = calcDelta(totalPaidReach, prevPaidReach);
  const cpeDelta = calcDelta(avgCPE, prevAvgCPE);
  const roasDelta = calcRoasDelta(blendedRoas, prevBlendedRoas);

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Paid / Boosted Performance</h1>
          <p className="text-on-surface-variant text-lg">Track ad spend efficiency and campaign performance across all platforms.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[#64748b] dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Ad Spend</p>
            <h3 className="text-3xl font-black text-[#131b2e] dark:text-white">{formatCurrency(totalSpend)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${spendDelta.positive ? 'text-[#00685f] dark:text-green-400' : 'text-[#ba1a1a] dark:text-red-400'}`}>
              <span className="material-symbols-outlined text-[14px]">{spendDelta.positive ? 'arrow_upward' : 'arrow_downward'}</span>
              {spendDelta.value} vs last month
            </span>
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[#64748b] dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Total Paid Reach</p>
            <h3 className="text-3xl font-black text-[#131b2e] dark:text-white">{formatNumber(totalPaidReach)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${reachDelta.positive ? 'text-[#00685f] dark:text-green-400' : 'text-[#ba1a1a] dark:text-red-400'}`}>
              <span className="material-symbols-outlined text-[14px]">{reachDelta.positive ? 'arrow_upward' : 'arrow_downward'}</span>
              {reachDelta.value} vs last month
            </span>
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[#64748b] dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Avg CPE</p>
            <h3 className="text-3xl font-black text-[#131b2e] dark:text-white">₹{avgCPE.toFixed(2)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${!cpeDelta.positive ? 'text-[#00685f] dark:text-green-400' : 'text-[#ba1a1a] dark:text-red-400'}`}>
              <span className="material-symbols-outlined text-[14px]">{!cpeDelta.positive ? 'arrow_downward' : 'arrow_upward'}</span>
              {cpeDelta.value} {cpeDelta.positive ? 'higher' : 'improved'}
            </span>
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <p className="text-[#64748b] dark:text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Blended ROAS</p>
            <h3 className="text-3xl font-black text-[#131b2e] dark:text-white">
              {totalSpend > 0 ? `${blendedRoas.toFixed(1)}×` : '—'}
            </h3>
            <span
              className={`text-xs font-medium flex items-center gap-1 mt-1 ${
                roasDelta.positive ? 'text-[#00685f] dark:text-green-400' : 'text-[#ba1a1a] dark:text-red-400'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {roasDelta.positive ? 'arrow_upward' : 'arrow_downward'}
              </span>
              {roasDelta.value} vs prior period
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <h4 className="text-xl font-bold text-[#131b2e] dark:text-white mb-2">Monthly Ad Spend Breakdown</h4>
            <p className="text-[#64748b] dark:text-gray-400 text-xs mb-6">Stacked platform spend over the last 6 months</p>
            <AdSpendChart liveSeries={adSpendChart} />
          </div>
          <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
            <h4 className="text-xl font-bold text-[#131b2e] dark:text-white mb-2">Spend vs Reach Efficiency</h4>
            <p className="text-[#64748b] dark:text-gray-400 text-xs mb-6">Cost per 1K reach by platform</p>
            <div className="space-y-5 mt-4">
              {platformData.map((p) => {
                const cpr = p.paidReach > 0 ? (p.spend / (p.paidReach / 1000)) : 0;
                const maxCpr = 30;
                const width = Math.min((cpr / maxCpr) * 100, 100);
                return (
                  <div key={p.slug} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#131b2e] dark:text-white">{p.name}</span>
                      <span className="font-bold" style={{ color: p.color }}>${cpr.toFixed(2)} / 1K reach</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#e2e8f0] dark:bg-[#334155] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Boosted Posts Table */}
        <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:shadow-lg dark:shadow-black/20 border border-[#e2e8f0] dark:border-[#334155]">
          <h4 className="text-xl font-bold text-[#131b2e] dark:text-white mb-6">Boosted Post Performance</h4>
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f1f5f9] dark:bg-[#0f172a] text-[#64748b] dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3">Post</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3 text-right">Organic Reach</th>
                <th className="px-6 py-3 text-right">Paid Reach</th>
                <th className="px-6 py-3 text-right">Spend</th>
                <th className="px-6 py-3 text-right">CPE</th>
                <th className="px-6 py-3 text-center">Performance</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#e2e8f0] dark:divide-[#334155]">
              {boostedPosts.length > 0 ? (
                boostedPosts.map((row) => (
                  <tr key={row.id} className="hover:bg-[#f1f5f9]/50 dark:hover:bg-[#334155]/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-[#131b2e] dark:text-white">{row.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase" style={{ backgroundColor: `${row.color}1A`, color: row.color }}>
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-[#131b2e] dark:text-white">{formatNumber(row.orgReach)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-[#131b2e] dark:text-white">{formatNumber(row.paidReach)}</td>
                    <td className="px-6 py-4 text-right font-bold text-amber-600 dark:text-amber-400">{formatCurrency(row.spend)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-[#131b2e] dark:text-white">${row.cpe.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.perf === 'Excellent' ? 'bg-green-50 dark:bg-green-500/20 text-[#00685f] dark:text-green-400' : row.perf === 'Good' ? 'bg-blue-50 dark:bg-[#3b82f6]/20 text-[#0058be] dark:text-[#60a5fa]' : 'bg-red-50 dark:bg-red-500/20 text-[#ba1a1a] dark:text-red-400'}`}>
                        {row.perf}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#64748b] dark:text-gray-400">
                    No boosted posts found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { formatCurrency, formatNumber } from '@/lib/utils';

const AdSpendChart = dynamic(() => import('@/components/charts/AdSpendChart'), { ssr: false });

interface PaidData {
  totalSpend: number;
  totalPaidReach: number;
  avgCPE: number;
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
}

interface PaidClientProps {
  data: PaidData;
}

function calcDelta(current: number, previous: number): { value: string; positive: boolean } {
  if (previous === 0) return { value: '0%', positive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: `${Math.abs(change).toFixed(1)}%`,
    positive: change >= 0,
  };
}

export default function PaidClient({ data }: PaidClientProps) {
  const {
    totalSpend,
    totalPaidReach,
    avgCPE,
    prevSpend,
    prevPaidReach,
    prevAvgCPE,
    platformData,
    boostedPosts,
  } = data;

  const spendDelta = calcDelta(totalSpend, prevSpend);
  const reachDelta = calcDelta(totalPaidReach, prevPaidReach);
  const cpeDelta = calcDelta(avgCPE, prevAvgCPE);

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
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Total Ad Spend</p>
            <h3 className="text-3xl font-black text-on-surface">{formatCurrency(totalSpend)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${spendDelta.positive ? 'text-tertiary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">{spendDelta.positive ? 'arrow_upward' : 'arrow_downward'}</span>
              {spendDelta.value} vs last month
            </span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Total Paid Reach</p>
            <h3 className="text-3xl font-black text-on-surface">{formatNumber(totalPaidReach)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${reachDelta.positive ? 'text-tertiary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">{reachDelta.positive ? 'arrow_upward' : 'arrow_downward'}</span>
              {reachDelta.value} vs last month
            </span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Avg CPE</p>
            <h3 className="text-3xl font-black text-on-surface">${avgCPE.toFixed(2)}</h3>
            <span className={`text-xs font-medium flex items-center gap-1 mt-1 ${!cpeDelta.positive ? 'text-tertiary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">{!cpeDelta.positive ? 'arrow_downward' : 'arrow_upward'}</span>
              {cpeDelta.value} {cpeDelta.positive ? 'higher' : 'improved'}
            </span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Blended ROAS</p>
            <h3 className="text-3xl font-black text-on-surface">3.6×</h3>
            <span className="text-tertiary text-xs font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 0.4× vs last month
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <h4 className="text-xl font-bold text-on-surface mb-2">Monthly Ad Spend Breakdown</h4>
            <p className="text-secondary text-xs mb-6">Stacked platform spend over the last 6 months</p>
            <AdSpendChart />
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
            <h4 className="text-xl font-bold text-on-surface mb-2">Spend vs Reach Efficiency</h4>
            <p className="text-secondary text-xs mb-6">Cost per 1K reach by platform</p>
            <div className="space-y-5 mt-4">
              {platformData.map((p) => {
                const cpr = p.paidReach > 0 ? (p.spend / (p.paidReach / 1000)) : 0;
                const maxCpr = 30;
                const width = Math.min((cpr / maxCpr) * 100, 100);
                return (
                  <div key={p.slug} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{p.name}</span>
                      <span className="font-bold" style={{ color: p.color }}>${cpr.toFixed(2)} / 1K reach</span>
                    </div>
                    <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, backgroundColor: p.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Boosted Posts Table */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.06)]">
          <h4 className="text-xl font-bold text-on-surface mb-6">Boosted Post Performance</h4>
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-secondary text-[11px] font-bold uppercase tracking-widest">
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
            <tbody className="text-sm divide-y divide-surface-container">
              {boostedPosts.length > 0 ? (
                boostedPosts.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-6 py-4 font-semibold">{row.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase" style={{ backgroundColor: `${row.color}1A`, color: row.color }}>
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(row.orgReach)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(row.paidReach)}</td>
                    <td className="px-6 py-4 text-right font-bold text-amber-600">{formatCurrency(row.spend)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">${row.cpe.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.perf === 'Excellent' ? 'bg-tertiary/10 text-tertiary' : row.perf === 'Good' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'}`}>
                        {row.perf}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-secondary">
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

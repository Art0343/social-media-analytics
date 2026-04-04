'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { adSpendData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';
import { AD_SPEND_STACK_KEYS, getPlatformColor } from '@/lib/platform-colors';
import type { AdSpendChartRow, AdSpendStackKey } from '@/lib/ad-spend-chart-from-summaries';

const inrFmt = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatInr(n: number): string {
  return inrFmt.format(Math.round(n));
}

function AdSpendTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<Record<string, unknown>>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload
    .map((p) => {
      const dk = p.dataKey;
      const dataKey =
        typeof dk === 'string' || typeof dk === 'number' ? dk : undefined;
      return {
        name: String(p.name ?? dataKey ?? ''),
        value: Number(p.value) || 0,
        color: typeof p.color === 'string' ? p.color : '#64748B',
      };
    })
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value);
  if (rows.length === 0) return null;
  const total = rows.reduce((s, r) => s + r.value, 0);
  return (
    <div className="min-w-[180px] rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95">
      <p className="mb-2 font-bold text-slate-800 dark:text-slate-100">{label != null ? String(label) : ''}</p>
      <ul className="max-h-48 space-y-1 overflow-y-auto">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: r.color }} />
              <span className="truncate font-medium">{r.name}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-slate-50">
              {formatInr(r.value)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 dark:border-slate-600">
        <span className="font-bold text-slate-700 dark:text-slate-200">Total</span>
        <span className="font-bold tabular-nums text-slate-900 dark:text-slate-50">{formatInr(total)}</span>
      </div>
    </div>
  );
}

export type AdSpendLiveSeries = {
  data: AdSpendChartRow[];
  stackKeys: AdSpendStackKey[];
};

function sliceByRange(range: string) {
  switch (range) {
    case '7d':  return adSpendData.slice(-1);
    case '30d': return adSpendData.slice(-2);
    case '90d': return adSpendData.slice(-3);
    case '1y':  return adSpendData;
    case '6m':
    default:    return adSpendData;
  }
}

interface AdSpendChartProps {
  /** When set, chart reflects DB summaries scoped to connected accounts (overview / paid). */
  liveSeries?: AdSpendLiveSeries | null;
}

export default function AdSpendChart({ liveSeries }: AdSpendChartProps) {
  const { range } = useDateRange();

  const useLive =
    liveSeries != null &&
    liveSeries.stackKeys.length > 0 &&
    liveSeries.data.length > 0;

  const liveEmpty =
    liveSeries != null && (liveSeries.stackKeys.length === 0 || liveSeries.data.length === 0);

  if (liveEmpty) {
    return (
      <div className="flex h-full min-h-[152px] flex-col items-center justify-center gap-2 px-4 text-center text-secondary text-sm">
        <span className="material-symbols-outlined text-3xl opacity-50">bar_chart</span>
        <p>No ad spend for your connected accounts in this period.</p>
      </div>
    );
  }

  const data = useLive ? liveSeries.data : sliceByRange(range);
  const stackKeys = useLive ? liveSeries.stackKeys : [...AD_SPEND_STACK_KEYS];

  /** Largest spenders at bottom of stack (wider segments); legend matches bottom → top. */
  const stackKeysOrdered = useMemo(() => {
    const totals = new Map<string, number>();
    stackKeys.forEach(({ key }) => totals.set(key, 0));
    for (const row of data) {
      const r = row as Record<string, unknown>;
      for (const { key } of stackKeys) {
        const v = r[key];
        const n = typeof v === 'number' ? v : Number(v) || 0;
        totals.set(key, (totals.get(key) ?? 0) + n);
      }
    }
    return [...stackKeys].sort((a, b) => (totals.get(b.key) ?? 0) - (totals.get(a.key) ?? 0));
  }, [data, stackKeys]);

  const tickFill = 'var(--color-on-surface-variant, #64748b)';
  const gridStroke = 'var(--color-outline-variant, #e2e8f0)';

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-bold leading-tight text-on-surface dark:text-gray-200">
        {stackKeysOrdered.map(({ key, name }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm ring-1 ring-black/5 dark:ring-white/10"
              style={{ backgroundColor: getPlatformColor(key) }}
            />
            <span>{name}</span>
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1 w-full" style={{ minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 10, left: 4, bottom: 6 }}
            barCategoryGap={data.length > 20 ? '18%' : '24%'}
          >
            <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontWeight: 600, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickMargin={6}
              minTickGap={28}
            />
            <YAxis
              tick={{ fontSize: 10, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={44}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              content={({ active, payload, label: l }) => (
                <AdSpendTooltip
                  active={active}
                  payload={payload as unknown as ReadonlyArray<Record<string, unknown>> | undefined}
                  label={l}
                />
              )}
              cursor={{ fill: 'rgba(100,116,139,0.08)' }}
            />
            {stackKeysOrdered.map(({ key, name }, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={getPlatformColor(key)}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={0.5}
                radius={i === stackKeysOrdered.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={40}
                name={name}
                animationDuration={500}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

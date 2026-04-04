'use client';

import { useMemo, useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
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
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
  if (rows.length === 0) return null;
  const total = rows.reduce((s, r) => s + r.value, 0);
  const useTwoCols = rows.length > 6;
  /** Two-column grid: fill left column top→bottom (highest…), then right — not row-major (which interleaves ranks). */
  const twoColGridStyle = useTwoCols
    ? {
        display: 'grid' as const,
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: `repeat(${Math.ceil(rows.length / 2)}, auto)`,
        gridAutoFlow: 'column' as const,
        columnGap: '1rem',
        rowGap: '0.375rem',
      }
    : undefined;
  return (
    <div
      className={`min-w-[180px] rounded-lg border border-slate-200/80 bg-white/95 px-3 py-2.5 text-xs shadow-lg backdrop-blur-sm dark:border-slate-600 dark:bg-slate-900/95 ${useTwoCols ? 'max-w-[min(100vw-1.5rem,520px)]' : ''}`}
    >
      <p className="mb-2 font-bold text-slate-800 dark:text-slate-100">{label != null ? String(label) : ''}</p>
      <ul className={useTwoCols ? undefined : 'space-y-1'} style={twoColGridStyle}>
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-300">
              <span className="h-2 w-2 shrink-0 rounded-sm" style={{ backgroundColor: r.color }} />
              <span className="break-words font-medium leading-snug">{r.name}</span>
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

const EXPAND_PLATFORM_THRESHOLD = 5;

function AdSpendChartPlot({
  data,
  stackKeysOrdered,
  variant,
}: {
  data: AdSpendChartRow[] | ReturnType<typeof sliceByRange>;
  stackKeysOrdered: AdSpendStackKey[];
  variant: 'compact' | 'expanded';
}) {
  const isExpanded = variant === 'expanded';
  const tickFill = 'var(--color-on-surface-variant, #64748b)';
  const gridStroke = 'var(--color-outline-variant, #e2e8f0)';

  /** Expanded view is in a portal/flex context where % heights collapse — use explicit chart height. */
  const expandedChartHeight = 'clamp(380px, 58vh, 680px)';

  return (
    <div
      className={`flex w-full flex-col ${isExpanded ? 'gap-3' : 'h-full min-h-0 gap-2'}`}
    >
      <ul
        className={
          isExpanded
            ? 'grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-bold leading-tight text-on-surface sm:grid-cols-3 dark:text-gray-200'
            : 'flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-bold leading-tight text-on-surface dark:text-gray-200'
        }
      >
        {stackKeysOrdered.map(({ key, name }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span
              className={`shrink-0 rounded-sm ring-1 ring-black/5 dark:ring-white/10 ${isExpanded ? 'h-3 w-3' : 'h-2.5 w-2.5'}`}
              style={{ backgroundColor: getPlatformColor(key) }}
            />
            <span className="break-words">{name}</span>
          </li>
        ))}
      </ul>
      <div
        className={isExpanded ? 'w-full shrink-0' : 'min-h-0 w-full flex-1 min-h-[200px]'}
        style={isExpanded ? { height: expandedChartHeight } : undefined}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={
              isExpanded
                ? { top: 12, right: 16, left: 8, bottom: 12 }
                : { top: 8, right: 10, left: 4, bottom: 6 }
            }
            barCategoryGap={data.length > 20 ? '18%' : '24%'}
          >
            <CartesianGrid stroke={gridStroke} strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: isExpanded ? 12 : 10, fontWeight: 600, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickMargin={isExpanded ? 8 : 6}
              minTickGap={isExpanded ? 20 : 28}
            />
            <YAxis
              tick={{ fontSize: isExpanded ? 12 : 10, fill: tickFill }}
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              width={isExpanded ? 52 : 44}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ pointerEvents: 'auto', outline: 'none' }}
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
                maxBarSize={isExpanded ? 48 : 40}
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

  const [expanded, setExpanded] = useState(false);
  const titleId = useId();
  const showExpand = stackKeysOrdered.length > EXPAND_PLATFORM_THRESHOLD;

  useEffect(() => {
    if (!expanded) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded]);

  /** Recharts often measures 0×0 in portals until a resize; nudge after paint. */
  useEffect(() => {
    if (!expanded) return;
    const id = requestAnimationFrame(() => {
      window.dispatchEvent(new Event('resize'));
    });
    return () => cancelAnimationFrame(id);
  }, [expanded]);

  const modal =
    expanded &&
    typeof document !== 'undefined' &&
    createPortal(
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
          aria-label="Close chart"
          onClick={() => setExpanded(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="relative z-10 flex max-h-[min(92vh,900px)] w-full max-w-[min(96vw,1400px)] flex-col overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-2xl dark:border-[#334155] dark:bg-[#1e293b]"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-outline-variant/20 px-5 py-4 dark:border-[#334155]">
            <div>
              <h2 id={titleId} className="text-lg font-bold text-on-surface dark:text-white">
                Ad Spend (₹)
              </h2>
              <p className="mt-0.5 text-xs text-secondary">
                {stackKeysOrdered.length} platforms — hover bars for breakdown
              </p>
            </div>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-on-surface hover:bg-surface-container-highest dark:text-white dark:hover:bg-slate-700"
              aria-label="Close"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-5 pt-4">
            <AdSpendChartPlot data={data} stackKeysOrdered={stackKeysOrdered} variant="expanded" />
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <div className="relative flex h-full min-h-0 w-full flex-col gap-2">
        {showExpand && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant/40 bg-surface-container-low px-2.5 py-1.5 text-[11px] font-semibold text-on-surface shadow-sm hover:bg-surface-container-highest dark:border-[#475569] dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <span className="material-symbols-outlined text-[18px] leading-none">open_in_full</span>
              Expand chart
            </button>
          </div>
        )}
        <AdSpendChartPlot data={data} stackKeysOrdered={stackKeysOrdered} variant="compact" />
      </div>
      {modal}
    </>
  );
}

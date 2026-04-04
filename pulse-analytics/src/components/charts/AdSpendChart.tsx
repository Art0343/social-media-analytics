'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adSpendData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';
import { AD_SPEND_STACK_KEYS, getPlatformColor } from '@/lib/platform-colors';
import type { AdSpendChartRow, AdSpendStackKey } from '@/lib/ad-spend-chart-from-summaries';

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

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[10px] font-bold leading-tight text-on-surface dark:text-gray-200">
        {stackKeys.map(({ key, name }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: getPlatformColor(key) }} />
            <span>{name}</span>
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1 w-full" style={{ minHeight: 152 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontWeight: 700, fill: '#505f76' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#727785' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => [`₹${value}`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(19,27,46,0.1)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            {stackKeys.map(({ key, name }, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={getPlatformColor(key)}
                radius={i === stackKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                maxBarSize={28}
                name={name}
                animationDuration={600}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

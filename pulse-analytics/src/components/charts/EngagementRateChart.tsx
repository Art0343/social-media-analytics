'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { engagementRateData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';

// Simulate slight variation per date range to make the filter feel responsive
const rangeMultipliers: Record<string, number> = {
  '7d': 1.12, '30d': 1.05, '90d': 0.98, '6m': 1.0, '1y': 0.94,
};

export default function EngagementRateChart() {
  const { range } = useDateRange();
  const multiplier = rangeMultipliers[range] ?? 1;
  const data = engagementRateData.map((d) => ({
    ...d,
    rate: parseFloat((d.rate * multiplier).toFixed(2)),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <XAxis
          dataKey="platform"
          tick={{ fontSize: 10, fontWeight: 700, fill: '#505f76' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#727785' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Engagement Rate']}
          contentStyle={{
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(19,27,46,0.1)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        />
        <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={40} animationDuration={600}>
          {data.map((entry) => (
            <Cell key={entry.slug} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

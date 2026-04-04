'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { engagementRateData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';
import { getPlatformColor } from '@/lib/platform-colors';

// Simulate slight variation per date range to make the filter feel responsive
const rangeMultipliers: Record<string, number> = {
  '7d': 1.12, '30d': 1.05, '90d': 0.98, '6m': 1.0, '1y': 0.94,
};

interface EngagementRateChartProps {
  reachType?: 'organic' | 'paid' | 'combined';
}

export default function EngagementRateChart({ reachType = 'combined' }: EngagementRateChartProps) {
  const { range } = useDateRange();
  const multiplier = rangeMultipliers[range] ?? 1;
  
  // Transform data based on reach type
  const data = engagementRateData.map((d) => {
    const organicRate = parseFloat(((d.organicRate ?? d.rate) * multiplier).toFixed(2));
    const paidRate = parseFloat(((d.paidRate ?? d.rate * 0.7) * multiplier).toFixed(2));
    // Combined is weighted average: (organic + paid) / 2 for display purposes
    const combinedRate = parseFloat(((organicRate + paidRate) / 2).toFixed(2));
    
    return {
      platform: d.platform,
      slug: d.slug,
      color: getPlatformColor(d.slug),
      // For organic mode: show only organic
      organic: organicRate,
      // For paid mode: show only paid
      paid: paidRate,
      // For combined mode: we show both in stacked bars
      combined: reachType === 'combined' ? combinedRate : 0,
    };
  });

  // For organic/paid single mode, we use one bar
  const isSingleMode = reachType === 'organic' || reachType === 'paid';
  const dataKey = reachType === 'organic' ? 'organic' : reachType === 'paid' ? 'paid' : 'combined';

  return (
    <div className="h-full min-h-[188px] w-full">
      <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 4, right: 8, left: -6, bottom: 4 }}>
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
          formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}%`, String(name)]}
          contentStyle={{
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(19,27,46,0.1)',
            fontSize: '12px',
            fontWeight: 600,
          }}
        />
        {isSingleMode || reachType === 'combined' ? (
          <Bar 
            dataKey={dataKey} 
            radius={[6, 6, 0, 0]} 
            maxBarSize={40} 
            animationDuration={600}
          >
            {data.map((entry) => (
              <Cell key={entry.slug} fill={entry.color} />
            ))}
          </Bar>
        ) : (
          <>
            <Bar dataKey="organic" radius={[6, 6, 0, 0]} maxBarSize={20} name="Organic" animationDuration={600}>
              {data.map((entry) => (
                <Cell key={`${entry.slug}-org`} fill={entry.color} />
              ))}
            </Bar>
            <Bar dataKey="paid" radius={[6, 6, 0, 0]} maxBarSize={20} name="Paid" animationDuration={600}>
              {data.map((entry) => (
                <Cell key={`${entry.slug}-paid`} fill={entry.color} />
              ))}
            </Bar>
          </>
        )}
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

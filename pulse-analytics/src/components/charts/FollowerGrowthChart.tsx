'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { followerGrowthData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';
import { FOLLOWER_GROWTH_SERIES, getPlatformColor } from '@/lib/platform-colors';

const lines = FOLLOWER_GROWTH_SERIES.map((l) => ({
  ...l,
  color: getPlatformColor(l.key),
}));

function sliceByRange(range: string) {
  switch (range) {
    case '7d':  return followerGrowthData.slice(-1);
    case '30d': return followerGrowthData.slice(-2);
    case '90d': return followerGrowthData.slice(-3);
    case '1y':  return followerGrowthData;
    case '6m':
    default:    return followerGrowthData;
  }
}

export default function FollowerGrowthChart({ reachType = 'combined' }: { reachType?: 'organic' | 'paid' | 'combined' }) {
  const { range } = useDateRange();
  const baseData = sliceByRange(range);

  const typeMultipliers: Record<string, number> = {
    organic: 1.15,
    paid: 0.85,
    combined: 1.0,
  };
  const multiplier = typeMultipliers[reachType] ?? 1.0;

  const data = baseData.map((d) => ({
    ...d,
    instagram: Math.round(d.instagram * multiplier),
    tiktok: Math.round(d.tiktok * multiplier),
    youtube: Math.round(d.youtube * multiplier),
    facebook: Math.round((d.facebook ?? 0) * multiplier),
    linkedin: Math.round((d.linkedin ?? 0) * multiplier),
    snapchat: Math.round((d.snapchat ?? 0) * multiplier),
    twitter: Math.round((d.twitter ?? 0) * multiplier),
  }));

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <ul className="flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] font-bold leading-tight text-on-surface dark:text-gray-200">
        {lines.map((line) => (
          <li key={line.key} className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: line.color }} />
            <span>{line.name}</span>
          </li>
        ))}
      </ul>
      <div className="min-h-0 flex-1 w-full" style={{ minHeight: 168 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
            />
            <Tooltip
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${(Number(value) / 1000).toFixed(1)}K followers`, '']}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(19,27,46,0.1)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
            {lines.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                stroke={line.color}
                strokeWidth={line.key === 'tiktok' ? 2.5 : 2}
                dot={false}
                name={line.name}
                animationDuration={600}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

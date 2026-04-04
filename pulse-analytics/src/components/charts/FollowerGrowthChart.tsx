'use client';

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { followerGrowthData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';

const lines = [
  { key: 'instagram', color: '#E1306C', name: 'Instagram' },
  { key: 'tiktok', color: '#555555', name: 'TikTok' },
  { key: 'youtube', color: '#FF0000', name: 'YouTube' },
  { key: 'facebook', color: '#1877F2', name: 'Facebook' },
  { key: 'linkedin', color: '#0A66C2', name: 'LinkedIn' },
  { key: 'snapchat', color: '#e5e500', name: 'Snapchat' },
  { key: 'twitter', color: '#1d9bf0', name: 'X / Twitter' },
];

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
  
  // Apply multipliers based on reach type
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
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '9px', fontWeight: 700, textTransform: 'none', marginTop: '-15px' }}
        />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            name={line.name}
            animationDuration={600}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

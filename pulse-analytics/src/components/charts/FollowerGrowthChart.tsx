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

export default function FollowerGrowthChart() {
  const { range } = useDateRange();
  const data = sliceByRange(range);

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
          iconSize={6}
          wrapperStyle={{ fontSize: '9px', fontWeight: 700 }}
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

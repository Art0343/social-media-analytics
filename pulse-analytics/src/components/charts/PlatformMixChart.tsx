'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { platformMixData as defaultPlatformMixData } from '@/lib/demo-data';
import { getPlatformColor } from '@/lib/platform-colors';

interface PlatformMixItem {
  name: string;
  slug: string;
  value: number;
  color: string;
  icon: string;
}

interface PlatformMixChartProps {
  data?: PlatformMixItem[];
}

export default function PlatformMixChart({ data }: PlatformMixChartProps) {
  const raw = data || defaultPlatformMixData;
  const chartData = raw.map((entry) => ({
    ...entry,
    color: getPlatformColor(entry.slug),
  }));

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="relative mx-auto h-40 w-40 shrink-0 sm:h-44 sm:w-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={76}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.slug} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
              contentStyle={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(19,27,46,0.1)',
                fontSize: '12px',
                fontWeight: 600,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-on-surface dark:text-white">{chartData.length}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Platforms</span>
        </div>
      </div>
      <div className="min-h-0 flex-1 w-full overflow-y-auto overscroll-contain pr-1 [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-outline-variant/40">
        <div className="space-y-1.5 pb-1">
          {chartData.map((item) => (
            <div
              key={item.slug}
              className="flex justify-between items-center gap-2 text-xs text-on-surface dark:text-gray-100"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate font-medium">{item.name}</span>
              </span>
              <span className="shrink-0 font-bold tabular-nums">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

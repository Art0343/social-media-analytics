'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { platformMixData } from '@/lib/demo-data';

export default function PlatformMixChart() {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={platformMixData}
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={76}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {platformMixData.map((entry) => (
                <Cell key={entry.slug} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-on-surface">{platformMixData.length}</span>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Platforms</span>
        </div>
      </div>
      <div className="w-full space-y-3">
        {platformMixData.map((item) => (
          <div key={item.slug} className="flex justify-between items-center text-xs">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-bold">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

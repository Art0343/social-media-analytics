'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adSpendData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';
import { AD_SPEND_STACK_KEYS, getPlatformColor } from '@/lib/platform-colors';

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

export default function AdSpendChart() {
  const { range } = useDateRange();
  const data = sliceByRange(range);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-2">
      <ul className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[10px] font-bold leading-tight text-on-surface dark:text-gray-200">
        {AD_SPEND_STACK_KEYS.map(({ key, name }) => (
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
            {AD_SPEND_STACK_KEYS.map(({ key, name }, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={getPlatformColor(key)}
                radius={i === AD_SPEND_STACK_KEYS.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
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

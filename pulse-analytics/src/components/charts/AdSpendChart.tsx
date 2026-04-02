'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { adSpendData } from '@/lib/demo-data';

export default function AdSpendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={adSpendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
          tickFormatter={(v) => `$${v}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [`$${value}`, name.charAt(0).toUpperCase() + name.slice(1)]}
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
          wrapperStyle={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase' }}
        />
        <Bar dataKey="instagram" stackId="a" fill="#E1306C" radius={[0, 0, 0, 0]} maxBarSize={30} name="Instagram" />
        <Bar dataKey="facebook" stackId="a" fill="#1877F2" maxBarSize={30} name="Facebook" />
        <Bar dataKey="youtube" stackId="a" fill="#FF0000" maxBarSize={30} name="YouTube" />
        <Bar dataKey="linkedin" stackId="a" fill="#0A66C2" maxBarSize={30} name="LinkedIn" />
        <Bar dataKey="tiktok" stackId="a" fill="#000000" radius={[4, 4, 0, 0]} maxBarSize={30} name="TikTok" />
      </BarChart>
    </ResponsiveContainer>
  );
}

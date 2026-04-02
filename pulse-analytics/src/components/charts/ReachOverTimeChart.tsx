'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { reachOverTimeData } from '@/lib/demo-data';

export default function ReachOverTimeChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={reachOverTimeData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaedff" />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fontWeight: 700, fill: '#505f76' }}
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
          formatter={(value: number) => [`${(value / 1000).toFixed(1)}K`, '']}
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
          wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}
        />
        <Line
          type="monotone"
          dataKey="organic"
          stroke="#00685f"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#00685f' }}
          activeDot={{ r: 5 }}
          name="Organic"
        />
        <Line
          type="monotone"
          dataKey="paid"
          stroke="#fbbf24"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#fbbf24' }}
          activeDot={{ r: 5 }}
          name="Paid"
        />
        <Line
          type="monotone"
          dataKey="combined"
          stroke="#0058be"
          strokeWidth={2.5}
          strokeDasharray="8 4"
          dot={{ r: 3, fill: '#0058be' }}
          activeDot={{ r: 5 }}
          name="Combined"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

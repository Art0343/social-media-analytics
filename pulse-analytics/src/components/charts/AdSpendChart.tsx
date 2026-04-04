'use client';

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { adSpendData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';

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
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
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
        <Legend
          verticalAlign="top"
          align="right"
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '9px', fontWeight: 700, textTransform: 'none', marginTop: '-15px' }}
        />
        <Bar dataKey="instagram" stackId="a" fill="#E1306C" radius={[0, 0, 0, 0]} maxBarSize={28} name="Instagram" animationDuration={600} />
        <Bar dataKey="facebook" stackId="a" fill="#1877F2" maxBarSize={28} name="Facebook" animationDuration={600} />
        <Bar dataKey="youtube" stackId="a" fill="#FF0000" maxBarSize={28} name="YouTube" animationDuration={600} />
        <Bar dataKey="linkedin" stackId="a" fill="#0A66C2" maxBarSize={28} name="LinkedIn" animationDuration={600} />
        <Bar dataKey="tiktok" stackId="a" fill="#555" maxBarSize={28} name="TikTok" animationDuration={600} />
        <Bar dataKey="twitter" stackId="a" fill="#1d9bf0" maxBarSize={28} name="X" animationDuration={600} />
        <Bar dataKey="whatsapp" stackId="a" fill="#25D366" maxBarSize={28} name="WhatsApp" animationDuration={600} />
        <Bar dataKey="google-ads" stackId="a" fill="#34a853" maxBarSize={28} name="Google Ads" animationDuration={600} />
        <Bar dataKey="meta-ads" stackId="a" fill="#0668E1" maxBarSize={28} name="Meta Ads" animationDuration={600} />
        <Bar dataKey="snapchat" stackId="a" fill="#e5e500" radius={[4, 4, 0, 0]} maxBarSize={28} name="Snapchat" animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}

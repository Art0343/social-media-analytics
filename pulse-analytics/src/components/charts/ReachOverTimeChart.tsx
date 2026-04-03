'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { reachOverTimeData } from '@/lib/demo-data';
import { useDateRange } from '@/lib/stores/useDateRange';

interface DataPoint {
  month: string;
  organic: number;
  paid: number;
  combined: number;
}

interface ReachOverTimeChartProps {
  data?: DataPoint[];
}

function sliceByRange(range: string): DataPoint[] {
  switch (range) {
    case '7d':  return reachOverTimeData.slice(-1);
    case '30d': return reachOverTimeData.slice(-2);
    case '90d': return reachOverTimeData.slice(-3);
    case '1y':  return reachOverTimeData;
    case '6m':
    default:    return reachOverTimeData;
  }
}

function processSummaries(summaries: Array<{
  platformSlug: string;
  orgReach: number | null;
  paidReach: number | null;
  date?: Date;
}> | undefined): DataPoint[] {
  if (!summaries || summaries.length === 0) {
    return sliceByRange('30d');
  }

  // Group by date
  const byDate = summaries.reduce((acc, s) => {
    const dateKey = s.date ? new Date(s.date).toISOString().split('T')[0] : 'unknown';
    if (!acc[dateKey]) {
      acc[dateKey] = { organic: 0, paid: 0 };
    }
    acc[dateKey].organic += s.orgReach || 0;
    acc[dateKey].paid += s.paidReach || 0;
    return acc;
  }, {} as Record<string, { organic: number; paid: number }>);

  // Convert to array and sort by date
  const sortedDates = Object.keys(byDate).sort();
  
  // Group into monthly buckets for display
  const monthlyData: Record<string, { organic: number; paid: number; count: number }> = {};
  
  sortedDates.forEach(dateKey => {
    const date = new Date(dateKey);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { organic: 0, paid: 0, count: 0 };
    }
    monthlyData[monthKey].organic += byDate[dateKey].organic;
    monthlyData[monthKey].paid += byDate[dateKey].paid;
    monthlyData[monthKey].count += 1;
  });

  // Get last 6 months
  const monthKeys = Object.keys(monthlyData).slice(-6);
  
  return monthKeys.map(month => ({
    month,
    organic: Math.round(monthlyData[month].organic / monthlyData[month].count),
    paid: Math.round(monthlyData[month].paid / monthlyData[month].count),
    combined: Math.round((monthlyData[month].organic + monthlyData[month].paid) / monthlyData[month].count),
  }));
}

export default function ReachOverTimeChart({ data: propData }: ReachOverTimeChartProps) {
  const { range } = useDateRange();
  
  // Use prop data if available, otherwise use demo data
  const data = propData && propData.length > 0 
    ? propData 
    : sliceByRange(range);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [`${(Number(value) / 1000).toFixed(1)}K`, '']}
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
          animationDuration={600}
        />
        <Line
          type="monotone"
          dataKey="paid"
          stroke="#fbbf24"
          strokeWidth={2.5}
          dot={{ r: 3, fill: '#fbbf24' }}
          activeDot={{ r: 5 }}
          name="Paid"
          animationDuration={600}
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
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

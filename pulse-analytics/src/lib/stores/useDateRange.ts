import { create } from 'zustand';

export type DateRange = '7d' | '30d' | '90d' | '6m' | '1y';

interface DateRangeState {
  range: DateRange;
  days: number;
  setRange: (range: DateRange) => void;
  label: string;
}

const labels: Record<DateRange, string> = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '6m': 'Last 6 Months',
  '1y': 'Last Year',
};

const daysMap: Record<DateRange, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '6m': 180,
  '1y': 365,
};

export const useDateRange = create<DateRangeState>((set) => ({
  range: '30d',
  days: 30,
  label: labels['30d'],
  setRange: (range) => set({ range, days: daysMap[range], label: labels[range] }),
}));

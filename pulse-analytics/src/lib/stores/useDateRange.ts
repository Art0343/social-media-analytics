import { create } from 'zustand';

export type DateRange = '7d' | '30d' | '90d' | '6m' | '1y';

interface DateRangeState {
  range: DateRange;
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

export const useDateRange = create<DateRangeState>((set) => ({
  range: '6m',
  label: labels['6m'],
  setRange: (range) => set({ range, label: labels[range] }),
}));

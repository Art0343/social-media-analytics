import { create } from 'zustand';

export type ReachType = 'organic' | 'paid' | 'combined';

interface ReachTypeState {
  reachType: ReachType;
  setReachType: (type: ReachType) => void;
  label: string;
}

const labels: Record<ReachType, string> = {
  organic: 'Organic',
  paid: 'Paid',
  combined: 'Combined',
};

export const useReachType = create<ReachTypeState>((set) => ({
  reachType: 'combined',
  label: labels.combined,
  setReachType: (reachType) => set({ reachType, label: labels[reachType] }),
}));

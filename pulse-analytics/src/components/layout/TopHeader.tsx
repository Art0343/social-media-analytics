'use client';

import { usePathname } from 'next/navigation';
import { useDateRange, type DateRange } from '@/lib/stores/useDateRange';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Overview',
  '/posts': 'Post Analytics',
  '/paid': 'Paid / Boosted',
  '/insights': 'AI Insights',
  '/report': 'Monthly Report',
  '/settings': 'Settings',
  '/settings/accounts': 'Connect Accounts',
  '/settings/platforms': 'Platform Registry',
  '/settings/general': 'General Settings',
  '/settings/team': 'Team Management',
};

const DATE_OPTIONS: { label: string; value: DateRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '6M', value: '6m' },
  { label: '1Y', value: '1y' },
];

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export default function TopHeader({ onMenuClick }: TopHeaderProps) {
  const pathname = usePathname();
  const { range, setRange } = useDateRange();

  const pageTitle = pageTitles[pathname] || 'Pulse Analytics';
  const showDateFilter = ['/dashboard', '/posts', '/paid', '/insights', '/report'].includes(pathname);

  return (
    <header className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur-md border-b border-[#e8eaf0] dark:bg-[#1a1c2e]/80 dark:border-[#2d3048]">
      {/* Left: Hamburger (mobile) + Page title */}
      <div className="flex items-center gap-4">
        <button
          id="sidebar-toggle"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-[#505f76] hover:bg-[#d8e2ff]/50 transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-xl">menu</span>
        </button>
        <h2 className="text-lg font-bold text-[#131b2e] dark:text-white">{pageTitle}</h2>
      </div>

      {/* Right: Date range + actions */}
      <div className="flex items-center gap-3">
        {showDateFilter && (
          <div className="flex items-center gap-1 bg-[#f4f6fa] dark:bg-[#2d3048] rounded-xl p-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`date-range-${opt.value}`}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  range === opt.value
                    ? 'bg-white dark:bg-[#3d4066] text-[#0058be] shadow-sm'
                    : 'text-[#505f76] hover:text-[#0058be] dark:text-[#8892b0]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <button
          id="export-pdf-btn"
          className="hidden sm:flex items-center gap-2 bg-[#f4f6fa] dark:bg-[#2d3048] text-[#505f76] dark:text-[#8892b0] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e8eaf0] dark:hover:bg-[#3d4066] active:opacity-80 transition-all"
        >
          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
          Export PDF
        </button>

        <button
          id="generate-report-btn"
          className="flex items-center gap-2 bg-gradient-to-br from-[#0058be] to-[#4285f4] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          <span className="hidden sm:inline">Generate Report</span>
          <span className="sm:hidden">Report</span>
        </button>
      </div>
    </header>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDateRange, type DateRange } from '@/lib/stores/useDateRange';

// Function to export page as PDF using server-side Playwright
const exportToPDF = async (setIsExporting: (v: boolean) => void, currentUrl: string, pageTitle: string) => {
  console.log('[PDF Export] Starting server-side PDF generation...');
  try {
    setIsExporting(true);
    
    // Call the server-side API
    const response = await fetch(`/api/export/page-pdf?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(pageTitle)}`, {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.details || error.error || 'Failed to generate PDF');
    }
    
    // Get PDF blob
    const blob = await response.blob();
    const filename = `${pageTitle}-export-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Download the PDF
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('[PDF Export] Success!');
    setIsExporting(false);
  } catch (error) {
    console.error('[PDF Export] Error:', error);
    alert('Failed to export PDF: ' + (error instanceof Error ? error.message : String(error)));
    setIsExporting(false);
  }
};

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
  const [isExporting, setIsExporting] = useState(false);

  const pageTitle = pageTitles[pathname] || 'Pulse Analytics';
  const showDateFilter = ['/dashboard', '/posts', '/paid', '/insights', '/report'].includes(pathname);

  return (
    <header className="sticky top-0 z-40 w-full flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-[#e8eaf0] dark:border-[#1e293b]">
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
          <div className="flex items-center gap-1 bg-[#f4f6fa] dark:bg-[#1e293b] rounded-xl p-1">
            {DATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                id={`date-range-${opt.value}`}
                onClick={() => setRange(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                  range === opt.value
                    ? 'bg-white dark:bg-[#3b82f6] text-[#0058be] dark:text-white shadow-sm'
                    : 'text-[#505f76] dark:text-gray-400 hover:text-[#0058be] dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        <button
          id="export-pdf-btn"
          onClick={() => exportToPDF(setIsExporting, window.location.href, pageTitle)}
          disabled={isExporting}
          className="hidden sm:flex items-center gap-2 bg-[#f4f6fa] dark:bg-[#1e293b] text-[#505f76] dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e8eaf0] dark:hover:bg-[#334155] active:opacity-80 transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm">{isExporting ? 'hourglass_top' : 'picture_as_pdf'}</span>
          {isExporting ? 'Exporting...' : 'Export PDF'}
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

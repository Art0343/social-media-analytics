'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

export default function TopHeader() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<'organic' | 'paid' | 'combined'>('organic');

  const pageTitle = pageTitles[pathname] || 'Pulse Analytics';
  const showTabs = ['/dashboard', '/posts', '/paid', '/insights', '/report'].includes(pathname);

  return (
    <header className="sticky top-0 z-40 w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center gap-8">
        <h2 className="text-lg font-bold text-[#131b2e]">{pageTitle}</h2>
        {showTabs && (
          <nav className="flex gap-6">
            {(['organic', 'paid', 'combined'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-sm font-semibold pb-2 transition-all capitalize ${
                  activeTab === tab
                    ? 'text-[#0058be] border-b-2 border-[#0058be]'
                    : 'text-[#505f76] hover:text-[#0058be]'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-secondary mr-4">
          <span className="material-symbols-outlined text-xl cursor-pointer hover:text-primary transition-colors">calendar_month</span>
          <span className="text-sm font-medium">Mar 1 — Mar 31, 2026</span>
        </div>
        <button className="bg-surface-container-high text-on-secondary-container px-4 py-2 rounded-lg text-sm font-semibold active:opacity-80 transition-all hover:bg-surface-container-highest">
          Export PDF
        </button>
        <button className="bg-linear-to-br from-primary to-primary-container text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm active:scale-95 transition-all">
          Generate Report
        </button>
      </div>
    </header>
  );
}

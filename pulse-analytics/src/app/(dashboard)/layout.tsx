'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface text-on-surface dark:bg-[#0d0f1e] dark:text-white">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="lg:ml-[240px] min-h-screen">
        <TopHeader onMenuClick={() => setMobileOpen(true)} />
        {children}
      </main>
    </div>
  );
}

import Sidebar from '@/components/layout/Sidebar';
import TopHeader from '@/components/layout/TopHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <main className="ml-[240px] min-h-screen">
        <TopHeader />
        {children}
      </main>
    </div>
  );
}

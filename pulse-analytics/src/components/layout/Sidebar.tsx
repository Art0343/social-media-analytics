'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { href: '/posts', label: 'Post Analytics', icon: 'analytics' },
  { href: '/paid', label: 'Paid / Boosted', icon: 'campaign' },
  { href: '/insights', label: 'AI Insights', icon: 'psychology' },
  { href: '/report', label: 'Monthly Report', icon: 'summarize' },
  { href: '/settings/accounts', label: 'Connect Accounts', icon: 'link' },
];

const bottomItems = [
  { href: '/settings', label: 'Settings', icon: 'settings' },
  { href: '#', label: 'Support', icon: 'help' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/settings' && pathname.startsWith('/settings') && !pathname.startsWith('/settings/accounts')) {
      return true;
    }
    return pathname === href || (href !== '/settings' && pathname.startsWith(href));
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r-0 flex flex-col p-4 bg-[#faf8ff] z-50">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="text-xl font-black text-[#131b2e] leading-tight">Pulse Analytics</h1>
        <p className="text-xs font-medium text-[#505f76] tracking-wider uppercase">SaaS Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-[#0058be] font-bold bg-[#d8e2ff]'
                  : 'text-[#505f76] hover:bg-[#d8e2ff]/50'
              }`}
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={active ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto pt-4 border-t border-surface-container space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'text-[#0058be] font-bold bg-[#d8e2ff]'
                  : 'text-[#505f76] hover:bg-[#d8e2ff]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        {/* User Profile */}
        <div className="flex items-center gap-3 mt-6 px-2">
          <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary text-sm font-bold">
            AR
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-on-surface truncate">Alex Rivera</p>
            <p className="text-[10px] text-on-surface-variant truncate">Growth Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

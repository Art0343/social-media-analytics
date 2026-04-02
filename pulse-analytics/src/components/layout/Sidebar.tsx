'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useTheme } from '@/lib/stores/useTheme';

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
];

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    // Enable Tailwind's dark: utilities by toggling the 'dark' class
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Close mobile sidebar on route change
  useEffect(() => {
    onClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const isActive = (href: string) => {
    if (href === '/settings' && pathname.startsWith('/settings') && !pathname.startsWith('/settings/accounts')) {
      return true;
    }
    return pathname === href || (href !== '/settings' && pathname.startsWith(href));
  };

  const sidebarContent = (
    <aside className="flex flex-col h-full w-[240px] p-4 bg-[#faf8ff] dark:bg-[#12142a] border-r border-transparent">
      {/* Logo */}
      <div className="mb-10 px-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#131b2e] dark:text-white leading-tight">Pulse Analytics</h1>
          <p className="text-xs font-medium text-[#505f76] dark:text-[#8892b0] tracking-wider uppercase">SaaS Dashboard</p>
        </div>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-lg text-[#505f76] hover:bg-[#d8e2ff]/50 transition-colors"
          aria-label="Close sidebar"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>
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
                  ? 'text-[#0058be] font-bold bg-[#d8e2ff] dark:bg-[#1e2d5a] dark:text-[#82b0ff]'
                  : 'text-[#505f76] dark:text-[#8892b0] hover:bg-[#d8e2ff]/50 dark:hover:bg-[#1e2d5a]/50'
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
      <div className="mt-auto pt-4 border-t border-[#e8eaf0] dark:border-[#2d3048] space-y-1">
        {bottomItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? 'text-[#0058be] font-bold bg-[#d8e2ff] dark:bg-[#1e2d5a] dark:text-[#82b0ff]'
                  : 'text-[#505f76] dark:text-[#8892b0] hover:bg-[#d8e2ff]/50 dark:hover:bg-[#1e2d5a]/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}

        {/* Dark mode toggle */}
        <button
          id="theme-toggle"
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#505f76] dark:text-[#8892b0] hover:bg-[#d8e2ff]/50 dark:hover:bg-[#1e2d5a]/50 transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* Support link */}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[#505f76] dark:text-[#8892b0] hover:bg-[#d8e2ff]/50 dark:hover:bg-[#1e2d5a]/50 transition-colors">
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="text-sm">Support</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 mt-4 px-2 pt-3 border-t border-[#e8eaf0] dark:border-[#2d3048]">
          <div className="w-8 h-8 rounded-full bg-[#d8e2ff] dark:bg-[#1e2d5a] flex items-center justify-center text-[#0058be] dark:text-[#82b0ff] text-sm font-bold flex-shrink-0">
            AR
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-[#131b2e] dark:text-white truncate">Alex Rivera</p>
            <p className="text-[10px] text-[#505f76] dark:text-[#8892b0] truncate">Growth Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex fixed left-0 top-0 h-full w-[240px] z-50">
        {sidebarContent}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Drawer */}
          <div className="relative w-[240px] h-full shadow-2xl animate-slide-in-left">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

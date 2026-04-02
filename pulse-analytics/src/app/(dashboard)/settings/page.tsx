import Link from 'next/link';

const settingsSections = [
  {
    title: 'General',
    description: 'Workspace name, logo, domain restrictions, and notification preferences.',
    href: '/settings/general',
    icon: 'tune',
  },
  {
    title: 'Connected Accounts',
    description: 'Manage social media platform connections and sync status.',
    href: '/settings/accounts',
    icon: 'link',
  },
  {
    title: 'Platform Registry',
    description: 'Add, configure, or remove social media platforms. Admin only.',
    href: '/settings/platforms',
    icon: 'extension',
    badge: 'Admin',
  },
  {
    title: 'Team Management',
    description: 'Invite members, assign roles, and manage access.',
    href: '/settings/team',
    icon: 'group',
  },
];

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-on-surface tracking-tight mb-2">Settings</h1>
        <p className="text-on-surface-variant text-lg">Manage your workspace, team, and platform configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-[0_8px_24px_rgba(19,27,46,0.06)] hover:-translate-y-1 transition-all group border border-transparent hover:border-primary/10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary-fixed text-primary">
                <span className="material-symbols-outlined">{s.icon}</span>
              </div>
              {s.badge && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">
                  {s.badge}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
              {s.title}
            </h3>
            <p className="text-sm text-on-surface-variant">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

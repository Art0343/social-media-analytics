'use client';

import { useState } from 'react';

export default function GeneralSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState('Pulse Analytics');
  const [allowedDomain, setAllowedDomain] = useState('');

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">General Settings</h1>
        <p className="text-on-surface-variant">Configure your workspace name, branding, and access restrictions.</p>
      </div>

      <div className="space-y-8">
        {/* Workspace Name */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-4">Workspace</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Workspace Logo</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-fixed rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                </div>
                <button className="px-4 py-2 bg-primary/5 text-primary text-sm font-semibold rounded-lg hover:bg-primary/10 transition-all">
                  Upload Logo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Restriction */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-4">Access Control</h3>
          <div>
            <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Allowed Email Domain</label>
            <input
              type="text"
              value={allowedDomain}
              onChange={(e) => setAllowedDomain(e.target.value)}
              placeholder="e.g., yourcompany.com (leave empty to allow all)"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <p className="text-[10px] text-on-surface-variant mt-2">Only emails from this domain can sign in. Leave empty for no restriction.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-on-surface mb-4">Notifications</h3>
          <div className="space-y-3">
            {[
              { label: 'Weekly digest report', desc: 'Receive a summary of your social performance every Monday.' },
              { label: 'Token expiration alerts', desc: 'Get notified when a connected account token is about to expire.' },
              { label: 'AI insight notifications', desc: 'Receive alerts when new AI-generated insights are available.' },
            ].map((item, i) => (
              <label key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-container-low cursor-pointer transition-colors">
                <input type="checkbox" defaultChecked className="mt-1 rounded border-outline-variant text-primary focus:ring-primary/20" />
                <div>
                  <p className="text-sm font-semibold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button className="px-8 py-3 bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-sm hover:opacity-95 active:scale-95 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

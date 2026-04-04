'use client';

import { useState } from 'react';
import { connectedAccountsData, demoPlatforms } from '@/lib/demo-data';
import ConnectAccountModal from './ConnectAccountModal';

export default function ConnectAccountsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<typeof demoPlatforms[0] | null>(null);

  const handleConnectClick = (platformSlug: string) => {
    const platform = demoPlatforms.find((p: { slug: string }) => p.slug === platformSlug);
    if (platform) {
      setSelectedPlatform(platform);
      setIsModalOpen(true);
    }
  };

  const handleConnect = async (data: { platformId: string; accountName: string; accountHandle: string; accessToken: string }) => {
    // API call to connect the account
    const response = await fetch('/api/connected-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platformId: data.platformId,
        accountName: data.accountName,
        accountHandle: data.accountHandle,
        accessToken: data.accessToken,
      }),
    });

    if (response.ok) {
      // Refresh the page or update the UI
      window.location.reload();
    } else {
      alert('Failed to connect account. Please try again.');
    }
  };
  return (
    <div className="p-8 max-w-7xl mx-auto bg-surface dark:bg-[#0a0f1c] min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-on-surface dark:text-white tracking-tight mb-2">Connect Accounts</h1>
        <p className="text-on-surface-variant dark:text-gray-400 text-lg max-w-2xl">
          Integrate your social platforms to centralize metrics, automate reporting, and unlock cross-platform AI insights.
        </p>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectedAccountsData.map((account: { id: string; platform: string; platformSlug: string; platformColor: string; icon: string; accountName: string; isConnected: boolean; lastSynced?: string; accountHandle?: string; description?: string }) => (
          <div key={account.id} className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl border border-[#e2e8f0] dark:border-[#334155] hover:shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${account.platformColor}1A` }}
              >
                <span className="material-symbols-outlined text-2xl" style={{ color: account.platformColor }}>
                  {account.icon}
                </span>
              </div>
              {account.isConnected ? (
                <span className="px-3 py-1 bg-green-50 dark:bg-green-500/20 text-[#00685f] dark:text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] dark:bg-green-400" /> Connected
                </span>
              ) : (
                <span className="px-3 py-1 bg-[#f1f5f9] dark:bg-[#334155] text-[#64748b] dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Not Connected
                </span>
              )}
            </div>

            <div className={account.isConnected ? 'mb-6' : 'mb-10'}>
              <h3 className="text-lg font-bold text-[#131b2e] dark:text-white">{account.accountName}</h3>
              {account.accountHandle ? (
                <>
                  <p className="text-sm text-[#64748b] dark:text-gray-400 font-medium">{account.accountHandle}</p>
                  <p className="text-xs text-[#94a3b8] dark:text-gray-500 mt-2">Last synced: {account.lastSynced}</p>
                </>
              ) : (
                <p className="text-sm text-[#64748b] dark:text-gray-400">{account.description}</p>
              )}
            </div>

            {account.isConnected ? (
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-blue-50 dark:bg-[#3b82f6]/10 text-[#0058be] dark:text-[#60a5fa] text-sm font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-[#3b82f6]/20 transition-all">
                  Sync Now
                </button>
                <button className="px-4 py-2 border border-red-200 dark:border-red-500/30 text-[#ba1a1a] dark:text-red-400 text-sm font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all">
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleConnectClick(account.platformSlug)}
                className="w-full px-4 py-3 bg-linear-to-br from-[#3b82f6] to-[#60a5fa] text-white font-bold rounded-lg shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add</span> Connect Account
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Enterprise Banner */}
      <div className="mt-16 bg-linear-to-r from-[#f1f5f9] to-white dark:from-[#1e293b] dark:to-[#0f172a] p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#e2e8f0] dark:border-[#334155]">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-[#131b2e] dark:text-white mb-3">Looking for Enterprise Integrations?</h2>
          <p className="text-[#64748b] dark:text-gray-400">Connect custom CRM data, Shopify stores, or Google Analytics 4 accounts with our Advanced Insights package.</p>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-[#131b2e] dark:bg-white text-white dark:text-[#0a0f1c] rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg">
          Contact Enterprise Sales
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-20">
        <div className="md:col-span-2 bg-[#f1f5f9] dark:bg-[#1e293b] p-8 rounded-2xl border border-[#e2e8f0] dark:border-[#334155]">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-3 bg-white dark:bg-[#334155] rounded-xl">
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#60a5fa]">security</span>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#131b2e] dark:text-white">Bank-Grade Security</h4>
              <p className="text-[#64748b] dark:text-gray-400 text-sm mt-1">
                Pulse Analytics uses official OAuth 2.0 protocols. We never store your passwords and only request read-level access to your analytics data.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-[#1e293b] p-8 rounded-2xl border border-blue-100 dark:border-[#334155]">
          <h4 className="text-lg font-bold text-[#0058be] dark:text-[#60a5fa] mb-2">Sync Status</h4>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-3 h-3 rounded-full bg-[#00685f] dark:bg-green-400 animate-pulse" />
            <span className="text-sm font-semibold text-[#131b2e] dark:text-white">Systems Operational</span>
          </div>
          <p className="text-xs text-[#64748b] dark:text-gray-400 leading-relaxed">
            Global average sync latency: 142ms. All platform APIs responding within normal parameters.
          </p>
        </div>
      </div>
      <ConnectAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        platform={selectedPlatform}
        onConnect={handleConnect}
      />
    </div>
  );
}

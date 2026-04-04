'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  socialProfileAccountsData,
  adAccountsData,
  demoPlatforms,
} from '@/lib/demo-data';
import type { ConnectedAccount } from '@/lib/types';
import ConnectAccountModal from './ConnectAccountModal';

const WORKSPACE_ID = 'ws-demo-pulse';

type RemoteAccount = {
  id: string;
  platform: { slug: string; name: string; brandColor: string; iconUrl?: string };
  accountName: string;
  accountHandle: string | null;
  status: string;
  lastSynced: string | null;
};

function formatSynced(iso: string | null | undefined): string | undefined {
  if (!iso) return undefined;
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return undefined;
  }
}

function ConnectAccountCard({
  account,
  onConnectClick,
  onDisconnect,
  disconnectingId,
}: {
  account: ConnectedAccount;
  onConnectClick: (platformSlug: string) => void;
  onDisconnect: (remoteAccountId: string) => void;
  disconnectingId: string | null;
}) {
  const connectLabel =
    account.accountKind === 'ad' ? 'Connect Ad Account' : 'Connect Account';
  const remoteId = account.remoteAccountId;
  const isBusy = remoteId != null && disconnectingId === remoteId;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#1e293b] p-6 rounded-xl border border-[#e2e8f0] dark:border-[#334155] hover:shadow-[0_8px_24px_rgba(19,27,46,0.06)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-all group">
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
        {account.accountKind === 'ad' && account.subtext ? (
          <p className="text-sm text-[#64748b] dark:text-gray-400 font-medium mt-0.5">{account.subtext}</p>
        ) : null}

        {account.isConnected && account.accountKind === 'social' && account.accountHandle ? (
          <>
            <p className="text-sm text-[#64748b] dark:text-gray-400 font-medium mt-2">{account.accountHandle}</p>
            {account.lastSynced ? (
              <p className="text-xs text-[#94a3b8] dark:text-gray-500 mt-2">Last synced: {account.lastSynced}</p>
            ) : null}
          </>
        ) : null}

        {account.isConnected && account.accountKind === 'ad' ? (
          <>
            {account.monthlySpendLabel ? (
              <p className="text-base font-semibold text-[#131b2e] dark:text-white mt-3">{account.monthlySpendLabel}</p>
            ) : null}
            {account.lastSynced ? (
              <p className="text-xs text-[#94a3b8] dark:text-gray-500 mt-2">Last synced: {account.lastSynced}</p>
            ) : null}
          </>
        ) : null}

        {!account.isConnected && account.description ? (
          <p className="text-sm text-[#64748b] dark:text-gray-400 mt-2">{account.description}</p>
        ) : null}
      </div>

      {account.isConnected ? (
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 px-4 py-2 bg-blue-50 dark:bg-[#3b82f6]/10 text-[#0058be] dark:text-[#60a5fa] text-sm font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-[#3b82f6]/20 transition-all"
          >
            Sync Now
          </button>
          <button
            type="button"
            disabled={!remoteId || isBusy}
            onClick={() => remoteId && onDisconnect(remoteId)}
            className="px-4 py-2 border border-red-200 dark:border-red-500/30 text-[#ba1a1a] dark:text-red-400 text-sm font-semibold rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {isBusy ? '…' : 'Disconnect'}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => onConnectClick(account.platformSlug)}
          className="w-full px-4 py-3 bg-linear-to-br from-[#3b82f6] to-[#60a5fa] text-white font-bold rounded-lg shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          {connectLabel}
        </button>
      )}
    </div>
  );
}

type AccountTab = 'social' | 'ad';

function mergeWithRemote(staticList: ConnectedAccount[], remote: RemoteAccount[]): ConnectedAccount[] {
  return staticList.map((row) => {
    const match = remote.find(
      (r) => r.platform.slug === row.platformSlug && r.status === 'CONNECTED'
    );
    const synced = formatSynced(match?.lastSynced);
    return {
      ...row,
      isConnected: !!match,
      remoteAccountId: match?.id,
      accountName: match?.accountName || row.accountName,
      accountHandle: match?.accountHandle ?? row.accountHandle,
      lastSynced: synced ?? row.lastSynced,
    };
  });
}

export default function ConnectAccountsPage() {
  const [accountTab, setAccountTab] = useState<AccountTab>('social');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<(typeof demoPlatforms)[0] | null>(null);
  const [remoteAccounts, setRemoteAccounts] = useState<RemoteAccount[]>([]);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoadingRemote(true);
    try {
      const res = await fetch(`/api/connected-accounts?workspaceId=${WORKSPACE_ID}`);
      if (res.ok) {
        const data = await res.json();
        setRemoteAccounts(data.accounts ?? []);
      }
    } finally {
      setLoadingRemote(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const socialRows = useMemo(
    () => mergeWithRemote(socialProfileAccountsData as ConnectedAccount[], remoteAccounts),
    [remoteAccounts]
  );
  const adRows = useMemo(
    () => mergeWithRemote(adAccountsData as ConnectedAccount[], remoteAccounts),
    [remoteAccounts]
  );

  const handleConnectClick = (platformSlug: string) => {
    const platform = demoPlatforms.find((p: { slug: string }) => p.slug === platformSlug);
    if (platform) {
      setSelectedPlatform(platform);
      setIsModalOpen(true);
    }
  };

  const handleDisconnect = async (remoteAccountId: string) => {
    setDisconnectingId(remoteAccountId);
    try {
      const res = await fetch(
        `/api/connected-accounts/${remoteAccountId}?workspaceId=${WORKSPACE_ID}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        await loadAccounts();
      } else {
        alert('Failed to disconnect. Please try again.');
      }
    } finally {
      setDisconnectingId(null);
    }
  };

  const handleConnect = async (data: {
    platformSlug: string;
    accountName: string;
    accountHandle: string;
    accessToken: string;
  }) => {
    const response = await fetch('/api/connected-accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workspaceId: WORKSPACE_ID,
        platformSlug: data.platformSlug,
        accountName: data.accountName,
        accountHandle: data.accountHandle,
        accessToken: data.accessToken,
      }),
    });

    if (response.ok) {
      await loadAccounts();
    } else {
      const err = await response.json().catch(() => ({}));
      alert(err.error || 'Failed to connect account. Please try again.');
    }
  };

  const displayRows = accountTab === 'social' ? socialRows : adRows;

  return (
    <div className="p-8 max-w-7xl mx-auto bg-surface dark:bg-[#0a0f1c] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-on-surface dark:text-white tracking-tight mb-2">Connect Accounts</h1>
        <p className="text-on-surface-variant dark:text-gray-400 text-lg max-w-2xl">
          Integrate social profiles and ad accounts to centralize metrics, automate reporting, and unlock cross-platform AI
          insights. Connections use secure OAuth; tokens are encrypted at rest.
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Account type"
        className="flex flex-wrap items-center gap-2 p-1 rounded-xl bg-[#f1f5f9] dark:bg-[#1e293b] border border-[#e2e8f0] dark:border-[#334155] w-full max-w-md mb-8"
      >
        <button
          type="button"
          role="tab"
          id="tab-social"
          aria-selected={accountTab === 'social'}
          aria-controls="panel-accounts"
          onClick={() => setAccountTab('social')}
          className={`flex-1 min-w-[8rem] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            accountTab === 'social'
              ? 'bg-white dark:bg-[#334155] text-[#131b2e] dark:text-white shadow-sm border border-[#e2e8f0] dark:border-[#475569]'
              : 'text-[#64748b] dark:text-gray-400 hover:text-[#131b2e] dark:hover:text-gray-200'
          }`}
        >
          Social profiles
        </button>
        <button
          type="button"
          role="tab"
          id="tab-ad"
          aria-selected={accountTab === 'ad'}
          aria-controls="panel-accounts"
          onClick={() => setAccountTab('ad')}
          className={`flex-1 min-w-[8rem] px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            accountTab === 'ad'
              ? 'bg-white dark:bg-[#334155] text-[#131b2e] dark:text-white shadow-sm border border-[#e2e8f0] dark:border-[#475569]'
              : 'text-[#64748b] dark:text-gray-400 hover:text-[#131b2e] dark:hover:text-gray-200'
          }`}
        >
          Ad accounts
        </button>
      </div>

      <section
        id="panel-accounts"
        role="tabpanel"
        aria-labelledby={accountTab === 'social' ? 'tab-social' : 'tab-ad'}
        className="mb-14"
      >
        <h2 className="sr-only">{accountTab === 'social' ? 'Social profiles' : 'Ad accounts'}</h2>
        <p className="text-sm text-on-surface-variant dark:text-gray-400 mb-6 max-w-3xl">
          {accountTab === 'social'
            ? 'Pages, channels, and business profiles for organic reach, messaging, and local presence.'
            : 'Advertising networks and campaign managers for paid spend, attribution, and ROAS.'}
        </p>
        {loadingRemote ? (
          <p className="text-sm text-on-surface-variant dark:text-gray-400">Loading connections…</p>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRows.map((account) => (
            <ConnectAccountCard
              key={account.id}
              account={account}
              onConnectClick={handleConnectClick}
              onDisconnect={handleDisconnect}
              disconnectingId={disconnectingId}
            />
          ))}
        </div>
      </section>

      <div className="mt-16 bg-linear-to-r from-[#f1f5f9] to-white dark:from-[#1e293b] dark:to-[#0f172a] p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-[#e2e8f0] dark:border-[#334155]">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-[#131b2e] dark:text-white mb-3">Looking for Enterprise Integrations?</h2>
          <p className="text-[#64748b] dark:text-gray-400">
            Connect custom CRM data, Shopify stores, or Google Analytics 4 accounts with our Advanced Insights package.
          </p>
        </div>
        <button
          type="button"
          className="whitespace-nowrap px-8 py-4 bg-[#131b2e] dark:bg-white text-white dark:text-[#0a0f1c] rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
        >
          Contact Enterprise Sales
        </button>
      </div>

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

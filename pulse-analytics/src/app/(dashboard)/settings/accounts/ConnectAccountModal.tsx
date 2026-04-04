'use client';

import { useState } from 'react';

interface SocialPlatform {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  icon: string;
}

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: SocialPlatform | null;
  onConnect: (data: { platformId: string; accountName: string; accountHandle: string; accessToken: string }) => void;
}

export default function ConnectAccountModal({ isOpen, onClose, platform, onConnect }: ConnectAccountModalProps) {
  const [accountName, setAccountName] = useState('');
  const [accountHandle, setAccountHandle] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !platform) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    await onConnect({
      platformId: platform.id,
      accountName,
      accountHandle,
      accessToken,
    });
    
    setIsLoading(false);
    setAccountName('');
    setAccountHandle('');
    setAccessToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-surface-container-lowest dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md border border-outline-variant/10 dark:border-[#334155]">
        <div className="p-6 border-b border-outline-variant/10 dark:border-[#334155] flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-on-surface dark:text-white">Connect {platform?.name}</h2>
            <p className="text-sm text-secondary dark:text-gray-400">Enter your account details</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container dark:hover:bg-[#334155] rounded-lg transition-colors">
            <span className="material-symbols-outlined text-on-surface dark:text-gray-400">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-white mb-1">
              Account Handle/Username
            </label>
            <input
              type="text"
              value={accountHandle}
              onChange={(e) => setAccountHandle(e.target.value)}
              placeholder="e.g., @mybusiness"
              className="w-full px-4 py-2 bg-surface-container dark:bg-[#334155] rounded-lg border border-outline-variant dark:border-[#334155] text-on-surface dark:text-white placeholder-secondary dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface dark:text-white mb-1">
              Access Token / API Key *
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your API access token"
              className="w-full px-4 py-2 bg-surface-container dark:bg-[#334155] rounded-lg border border-outline-variant dark:border-[#334155] text-on-surface dark:text-white placeholder-secondary dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-secondary dark:text-gray-400 mt-1">
              You can find this in your {platform?.name} developer settings.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-outline-variant dark:border-[#334155] text-on-surface dark:text-gray-300 font-semibold rounded-lg hover:bg-surface-container dark:hover:bg-[#334155] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-linear-to-br from-primary to-primary-container dark:from-[#3b82f6] dark:to-[#60a5fa] text-white font-bold rounded-lg shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="animate-spin material-symbols-outlined">progress_activity</span>
              ) : (
                <span className="material-symbols-outlined">link</span>
              )}
              {isLoading ? 'Connecting...' : 'Connect Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

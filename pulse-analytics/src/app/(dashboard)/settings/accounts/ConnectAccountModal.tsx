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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${platform.brandColor}1A` }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ color: platform.brandColor }}>
              {platform.icon}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Connect {platform.name}</h2>
            <p className="text-sm text-secondary">Enter your account details to connect</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Account Name *
            </label>
            <input
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., My Business Account"
              className="w-full px-4 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Account Handle/Username
            </label>
            <input
              type="text"
              value={accountHandle}
              onChange={(e) => setAccountHandle(e.target.value)}
              placeholder="e.g., @mybusiness"
              className="w-full px-4 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-on-surface mb-1">
              Access Token / API Key *
            </label>
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Enter your API access token"
              className="w-full px-4 py-2 bg-surface-container rounded-lg border border-outline-variant text-on-surface placeholder-secondary focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <p className="text-xs text-secondary mt-1">
              You can find this in your {platform.name} developer settings.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-linear-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

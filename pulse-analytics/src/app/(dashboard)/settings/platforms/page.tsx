'use client';

import { useState } from 'react';
import { demoPlatforms } from '@/lib/demo-data';
import AddPlatformModal, { PlatformFormData } from '@/components/platforms/AddPlatformModal';

interface Platform {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  icon: string;
  isActive: boolean;
  isBuiltIn: boolean;
}

export default function PlatformRegistryPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(demoPlatforms);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAddPlatform = (data: PlatformFormData) => {
    const newPlatform: Platform = {
      id: `p${Date.now()}`,
      name: data.name as string,
      slug: data.slug as string,
      brandColor: data.brandColor as string,
      icon: 'extension',
      isActive: true,
      isBuiltIn: false,
    };
    setPlatforms((prev) => [...prev, newPlatform]);
  };

  const handleToggleActive = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleDelete = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black text-on-surface tracking-tight">Platform Registry</h1>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase rounded-full">Admin Only</span>
          </div>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Manage social media platform configurations. Add new platforms entirely from the UI — no code changes required.
          </p>
        </div>
        <button
          onClick={() => { setEditingPlatform(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-br from-primary to-primary-container text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Add New Platform
        </button>
      </div>

      {/* Platform Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm hover:shadow-[0_8px_24px_rgba(19,27,46,0.06)] transition-all border-2 ${
              platform.isActive ? 'border-transparent' : 'border-error/20 opacity-60'
            }`}
          >
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                  style={{
                    backgroundColor: platform.brandColor,
                    backgroundImage: platform.slug === 'instagram'
                      ? 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
                      : undefined,
                  }}
                >
                  <span className="material-symbols-outlined text-xl">{platform.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">{platform.name}</h3>
                  <p className="text-xs text-on-surface-variant font-mono">/{platform.slug}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                platform.isActive
                  ? 'bg-tertiary/10 text-tertiary'
                  : 'bg-error/10 text-error'
              }`}>
                {platform.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <span className="w-4 h-4 rounded-full border-2" style={{ borderColor: platform.brandColor, backgroundColor: `${platform.brandColor}30` }} />
              <span className="text-xs font-mono text-on-surface-variant">{platform.brandColor}</span>
              {platform.isBuiltIn && (
                <span className="ml-auto px-2 py-0.5 bg-surface-container text-[10px] font-bold text-secondary rounded-full">
                  Built-in
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => { setEditingPlatform(platform); setIsModalOpen(true); }}
                className="flex-1 px-3 py-2 bg-primary/5 text-primary text-xs font-semibold rounded-lg hover:bg-primary/10 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleActive(platform.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  platform.isActive
                    ? 'border border-amber-300/30 text-amber-700 hover:bg-amber-50'
                    : 'border border-tertiary/20 text-tertiary hover:bg-tertiary/5'
                }`}
              >
                {platform.isActive ? 'Deactivate' : 'Activate'}
              </button>
              {!platform.isBuiltIn && (
                deleteConfirm === platform.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(platform.id)}
                      className="px-3 py-2 bg-error text-white text-xs font-bold rounded-lg"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-2 text-xs font-semibold text-on-surface-variant rounded-lg hover:bg-surface-container"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(platform.id)}
                    className="px-3 py-2 border border-error/20 text-error text-xs font-semibold rounded-lg hover:bg-error/5 transition-all"
                  >
                    Delete
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-12 bg-surface-container-low p-8 rounded-2xl flex items-start gap-4">
        <div className="p-3 bg-white rounded-xl">
          <span className="material-symbols-outlined text-primary">info</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-on-surface mb-1">How Platform Registry Works</h4>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Every platform is stored as a database record. When you add a new platform, the system automatically generates
            OAuth redirect URIs, configures the generic sync engine to use your field mappings, and makes the platform
            available across the dashboard — all without any code changes or redeployment.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AddPlatformModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPlatform(null); }}
        onSave={handleAddPlatform}
        editData={editingPlatform ? {
          name: editingPlatform.name,
          slug: editingPlatform.slug,
          brandColor: editingPlatform.brandColor,
          iconUrl: '',
          clientId: '', clientSecret: '', authUrl: '', tokenUrl: '',
          scopes: '', redirectUri: '', apiBaseUrl: '',
          fieldMappings: '{}', webhookEndpoint: '', isActive: editingPlatform.isActive,
        } : null}
      />
    </div>
  );
}

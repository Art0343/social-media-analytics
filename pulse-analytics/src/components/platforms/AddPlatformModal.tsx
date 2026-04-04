'use client';

import { useState } from 'react';

export interface PlatformFormData {
  name: string;
  slug: string;
  brandColor: string;
  iconUrl: string;
  clientId: string;
  clientSecret: string;
  authUrl: string;
  tokenUrl: string;
  scopes: string;
  redirectUri: string;
  apiBaseUrl: string;
  fieldMappings: string;
  webhookEndpoint: string;
  isActive: boolean;
}

const emptyForm: PlatformFormData = {
  name: '', slug: '', brandColor: '#0058be', iconUrl: '',
  clientId: '', clientSecret: '', authUrl: '', tokenUrl: '',
  scopes: '', redirectUri: '', apiBaseUrl: '',
  fieldMappings: '{\n  "reach": "data.impressions",\n  "likes": "data.likes",\n  "comments": "data.comments"\n}',
  webhookEndpoint: '', isActive: true,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlatformFormData) => void;
  editData?: PlatformFormData | null;
}

export default function AddPlatformModal({ isOpen, onClose, onSave, editData }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<PlatformFormData>(editData || emptyForm);

  if (!isOpen) return null;

  const update = (field: keyof PlatformFormData, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' ? { slug: (value as string).toLowerCase().replace(/[^a-z0-9]/g, '-') } : {}),
    }));
  };

  const handleSave = () => {
    onSave(form);
    setStep(1);
    setForm(emptyForm);
    onClose();
  };

  const totalSteps = 4;
  const isEdit = !!editData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up border border-outline-variant/20 dark:border-[#334155]">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#1e293b] z-10 px-8 pt-8 pb-4 border-b border-outline-variant/10 dark:border-[#334155]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black text-on-surface">
                {isEdit ? 'Edit Platform' : 'Add New Platform'}
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">Step {step} of {totalSteps}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-surface-container'}`} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-5">
          {step === 1 && (
            <>
              <h3 className="text-lg font-bold text-on-surface">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Platform Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="e.g., Pinterest"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    readOnly
                    className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm text-on-surface-variant"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Brand Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.brandColor}
                      onChange={(e) => update('brandColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border-none cursor-pointer"
                    />
                    <input
                      type="text"
                      value={form.brandColor}
                      onChange={(e) => update('brandColor', e.target.value)}
                      className="flex-1 bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Icon URL (SVG/PNG)</label>
                  <input
                    type="text"
                    value={form.iconUrl}
                    onChange={(e) => update('iconUrl', e.target.value)}
                    placeholder="https://cdn.example.com/icon.svg"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-bold text-on-surface">OAuth 2.0 Configuration</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Client ID *</label>
                    <input
                      type="text"
                      value={form.clientId}
                      onChange={(e) => update('clientId', e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Client Secret *</label>
                    <input
                      type="password"
                      value={form.clientSecret}
                      onChange={(e) => update('clientSecret', e.target.value)}
                      className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Authorization URL *</label>
                  <input
                    type="url"
                    value={form.authUrl}
                    onChange={(e) => update('authUrl', e.target.value)}
                    placeholder="https://api.example.com/oauth/authorize"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Token URL *</label>
                  <input
                    type="url"
                    value={form.tokenUrl}
                    onChange={(e) => update('tokenUrl', e.target.value)}
                    placeholder="https://api.example.com/oauth/token"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Scopes (comma-separated)</label>
                  <input
                    type="text"
                    value={form.scopes}
                    onChange={(e) => update('scopes', e.target.value)}
                    placeholder="read,write,analytics"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Redirect URI (auto-generated)</label>
                  <input
                    type="text"
                    value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/auth/callback/${form.slug || 'platform'}`}
                    readOnly
                    className="w-full bg-surface-container border-none rounded-lg px-4 py-3 text-sm text-on-surface-variant font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-lg font-bold text-on-surface">API & Data Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">API Base URL *</label>
                  <input
                    type="url"
                    value={form.apiBaseUrl}
                    onChange={(e) => update('apiBaseUrl', e.target.value)}
                    placeholder="https://api.example.com/v1"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Field Mappings (JSON)</label>
                  <textarea
                    value={form.fieldMappings}
                    onChange={(e) => update('fieldMappings', e.target.value)}
                    rows={8}
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-mono resize-y"
                  />
                  <p className="text-[10px] text-on-surface-variant mt-1">
                    Maps platform API response fields to internal schema (e.g., reach, likes, comments)
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1.5">Webhook Endpoint (optional)</label>
                  <input
                    type="url"
                    value={form.webhookEndpoint}
                    onChange={(e) => update('webhookEndpoint', e.target.value)}
                    placeholder="https://api.example.com/webhook"
                    className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="text-lg font-bold text-on-surface">Review & Confirm</h3>
              <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: form.brandColor }}>
                    {form.name.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-on-surface">{form.name || 'Unnamed Platform'}</h4>
                    <p className="text-sm text-on-surface-variant font-mono">{form.slug || 'no-slug'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase">Brand Color</p>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: form.brandColor }} />
                      <span className="font-mono">{form.brandColor}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase">OAuth Config</p>
                    <span className={form.clientId ? 'text-tertiary font-bold' : 'text-error font-bold'}>
                      {form.clientId ? '✓ Configured' : '✗ Missing'}
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase">API Base URL</p>
                    <span className="font-mono text-xs truncate block">{form.apiBaseUrl || '—'}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-secondary uppercase">Status</p>
                    <span className="text-tertiary font-bold">Active</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-[#1e293b] px-8 py-4 border-t border-outline-variant/10 dark:border-[#334155] flex justify-between items-center">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2.5 text-on-surface-variant font-semibold text-sm hover:bg-surface-container rounded-lg transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex gap-3">
            {step === 4 && (
              <button
                onClick={handleSave}
                className="px-6 py-2.5 bg-linear-to-br from-primary to-primary-container text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                {isEdit ? 'Save Changes' : 'Add Platform'}
              </button>
            )}
            {step < totalSteps && (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 bg-primary text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-95 active:scale-95 transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

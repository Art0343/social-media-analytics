'use client';

import { useState } from 'react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER' | 'VIEWER';
  avatar: string;
}

const initialMembers: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@pulseanalytics.com', role: 'ADMIN', avatar: 'AR' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@pulseanalytics.com', role: 'MEMBER', avatar: 'SC' },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@pulseanalytics.com', role: 'VIEWER', avatar: 'MJ' },
];

const roleColors = {
  ADMIN: 'bg-primary/10 text-primary',
  MEMBER: 'bg-tertiary/10 text-tertiary',
  VIEWER: 'bg-secondary/10 text-secondary',
};

export default function TeamPage() {
  const [members] = useState<TeamMember[]>(initialMembers);
  const [inviteEmail, setInviteEmail] = useState('');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-2">Team Management</h1>
        <p className="text-on-surface-variant">Invite members, assign roles, and manage workspace access.</p>
      </div>

      {/* Invite Section */}
      <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm mb-8">
        <h3 className="text-lg font-bold text-on-surface mb-4">Invite New Member</h3>
        <div className="flex gap-3">
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
          />
          <select className="bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface-variant cursor-pointer">
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button className="px-6 py-3 bg-linear-to-br from-primary to-primary-container text-white font-bold text-sm rounded-lg shadow-sm hover:opacity-95 active:scale-95 transition-all">
            Send Invite
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center">
          <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">Team Members ({members.length})</h3>
        </div>
        <div className="divide-y divide-surface-container">
          {members.map((member) => (
            <div key={member.id} className="px-6 py-4 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-sm">
                  {member.avatar}
                </div>
                <div>
                  <p className="font-semibold text-on-surface">{member.name}</p>
                  <p className="text-xs text-on-surface-variant">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${roleColors[member.role]}`}>
                  {member.role}
                </span>
                {member.role !== 'ADMIN' && (
                  <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                    <span className="material-symbols-outlined text-lg">more_vert</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

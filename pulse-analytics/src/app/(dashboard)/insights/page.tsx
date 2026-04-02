'use client';

import { insightCards, roiTableData } from '@/lib/demo-data';

export default function InsightsPage() {
  return (
    <main className="p-10 min-h-screen">
      {/* Hero Card */}
      <section className="mb-10">
        <div className="hero-gradient rounded-xl p-10 text-white relative overflow-hidden flex justify-between items-center">
          <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none flex items-center justify-center">
            <span className="material-symbols-outlined text-[240px]" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
                <span className="material-symbols-outlined text-[#63f9e8]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <span className="font-bold tracking-wider text-sm uppercase opacity-80">AI Performance Intelligence</span>
            </div>
            <h2 className="text-4xl font-black mb-4 tracking-tight">Pulse Analytics AI Performance</h2>
            <p className="text-lg text-primary-fixed mb-6 font-medium">Analysed 24 posts across 5 platforms — March 2026</p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                <p className="text-xs opacity-70 mb-1">Channel Growth</p>
                <p className="text-xl font-bold">TikTok +67% MoM</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 rounded-xl">
                <p className="text-xs opacity-70 mb-1">Efficiency Driver</p>
                <p className="text-xl font-bold">Reels 3.2× reach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insight Cards Bento Grid */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insightCards.map((card) => (
            <div key={card.id} className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.04)] hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-3 rounded-xl ${card.iconBg} ${card.iconColor}`}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </div>
                <span className={`text-xs font-bold uppercase ${card.labelColor}`}>{card.label}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{card.description}</p>
              {card.id === 'top-performing' && (
                <div className="flex items-center gap-2">
                  <span className="bg-[#E1306C1A] text-[#E1306C] px-3 py-1 rounded-full text-xs font-bold">Instagram Reels</span>
                  <span className="bg-[#0000001A] text-[#000000] px-3 py-1 rounded-full text-xs font-bold">TikTok</span>
                </div>
              )}
              {card.id === 'wasted-spend' && (
                <div className="flex items-center gap-4">
                  <div className="text-error font-bold text-2xl">28% <span className="text-sm font-medium text-on-surface-variant">Leakage</span></div>
                </div>
              )}
              {card.id === 'boost-candidates' && (
                <div className="inline-flex items-center px-4 py-2 bg-surface-container-low rounded-lg border border-outline-variant/20">
                  <span className="material-symbols-outlined text-tertiary text-sm mr-2">bolt</span>
                  <span className="text-sm font-bold">8.1% Engagement Rate</span>
                </div>
              )}
              {card.id === 'budget-reallocation' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Reduce FB</span>
                    <span className="font-bold text-error">$420 → $320</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Increase TikTok</span>
                    <span className="font-bold text-tertiary">+$60</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ROI Scorecard Table */}
      <section>
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Campaign ROI Scorecard</h2>
            <p className="text-on-surface-variant text-sm">Real-time performance distribution across active digital assets.</p>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_24px_rgba(19,27,46,0.04)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Post</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Platform</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider text-center">Organic ER</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Paid Spend</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">CPE</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Total Reach</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider text-center">ROI Score</th>
                <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider text-right">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {roiTableData.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">image</span>
                      </div>
                      <span className="font-bold text-sm">{row.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase"
                      style={{ backgroundColor: `${row.platformColor}1A`, color: row.platformColor }}
                    >
                      {row.platform}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant font-medium">{row.type}</td>
                  <td className="px-6 py-5 text-sm font-bold text-center">{row.organicER}</td>
                  <td className="px-6 py-5 text-sm font-medium">{row.paidSpend}</td>
                  <td className="px-6 py-5 text-sm font-medium">{row.cpe}</td>
                  <td className="px-6 py-5 text-sm font-medium">{row.totalReach}</td>
                  <td className="px-6 py-5 text-center">
                    <div className={`w-10 h-10 rounded-full border-4 ${row.roiScore >= 80 ? 'border-tertiary-container/20' : 'border-error-container/20'} flex items-center justify-center mx-auto`}>
                      <span className={`text-xs font-black ${row.roiColor}`}>{row.roiScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`${row.recBg} ${row.recColor} px-3 py-1 rounded-full text-xs font-bold`}>
                      {row.recommendation}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

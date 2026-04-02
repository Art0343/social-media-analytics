export default function ReportPage() {
  return (
    <div className="max-w-7xl mx-auto p-12 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Monthly Report</h2>
          <p className="text-on-surface-variant font-medium mt-1">Deep dive into cross-channel social performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-br from-primary to-primary-container text-on-primary font-bold rounded-lg shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <span className="material-symbols-outlined text-lg">download</span> Download PDF Report
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-on-surface font-semibold rounded-lg shadow-sm border border-outline-variant/10 hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-lg">link</span> Copy Share Link
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-on-surface font-semibold rounded-lg shadow-sm border border-outline-variant/10 hover:bg-surface-container-low transition-all">
            <span className="material-symbols-outlined text-lg">branding_watermark</span> White-label Brand
          </button>
        </div>
      </div>

      {/* Performance Overview Dark Card */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">March 2026 — Performance Overview</h3>
          <div className="h-[1px] flex-1 bg-linear-to-r from-outline-variant/50 to-transparent" />
        </div>
        <div className="col-span-3 bg-[#131b2e] rounded-xl p-8 grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[100px] rounded-full" />
          <div className="relative z-10">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Organic Reach</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#63f9e8]">260K</span>
              <span className="text-xs text-[#63f9e8] bg-[#63f9e8]/10 px-2 py-0.5 rounded-full">+12%</span>
            </div>
          </div>
          <div className="relative z-10 border-l border-white/5 pl-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Paid Reach</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-amber-400">124K</span>
              <span className="text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">+4%</span>
            </div>
          </div>
          <div className="relative z-10 border-l border-white/5 pl-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Ad Spend</p>
            <span className="text-4xl font-black text-white">$1,720</span>
          </div>
          <div className="relative z-10 pt-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Avg Engagement Rate</p>
            <span className="text-4xl font-black text-[#63f9e8]">5.6%</span>
          </div>
          <div className="relative z-10 border-l border-white/5 pl-6 pt-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Followers</p>
            <span className="text-4xl font-black text-white">49,150</span>
          </div>
          <div className="relative z-10 border-l border-white/5 pl-6 pt-4">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Blended ROAS</p>
            <span className="text-4xl font-black text-purple-400">3.6×</span>
          </div>
        </div>
      </section>

      {/* Top Performing Content */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">Top Performing Content — March 2026</h3>
          <div className="h-[1px] flex-1 bg-linear-to-r from-outline-variant/50 to-transparent" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Organic */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-secondary tracking-widest uppercase">TOP ORGANIC POSTS</h4>
              <span className="material-symbols-outlined text-primary">trending_up</span>
            </div>
            <div className="space-y-6">
              {[
                { rank: '01', title: '"Replying to haters"', platform: 'TikTok', platformColor: '#ff0050', meta: '2 days ago', value: '122K', label: 'Views' },
                { rank: '02', title: '"30 days posting"', platform: 'Instagram', platformColor: '#E1306C', meta: '1 week ago', value: '52.4K', label: 'Views' },
                { rank: '03', title: '"$2M round announcement"', platform: 'LinkedIn', platformColor: '#0077B5', meta: '5 days ago', value: '32.4K', label: 'Views' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface-container-low flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary-fixed transition-colors">
                      {item.rank}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{item.title}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="font-bold" style={{ color: item.platformColor }}>{item.platform}</span> • {item.meta}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-on-surface">{item.value}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Top Paid */}
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/5">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-secondary tracking-widest uppercase">TOP PAID / BOOSTED POSTS</h4>
              <span className="material-symbols-outlined text-primary">ads_click</span>
            </div>
            <div className="space-y-6">
              {[
                { rank: '01', title: '"Product launch"', platform: 'Instagram', platformColor: '#E1306C', meta: '$250 Spend', value: '4.2×', label: 'ROAS' },
                { rank: '02', title: '"30 days posting"', platform: 'Instagram', platformColor: '#E1306C', meta: '$200 Spend', value: '3.8×', label: 'ROAS' },
                { rank: '03', title: '"0→10K subscribers"', platform: 'YouTube', platformColor: '#FF0000', meta: '$240 Spend', value: '2.9×', label: 'ROAS' },
              ].map((item) => (
                <div key={item.rank} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-surface-container-low flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary-fixed transition-colors">
                      {item.rank}
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{item.title}</p>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1">
                        <span className="font-bold" style={{ color: item.platformColor }}>{item.platform}</span> • {item.meta}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-on-surface">{item.value}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Combined Insights */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">Combined Insights — What Worked</h3>
          <div className="h-[1px] flex-1 bg-linear-to-r from-outline-variant/50 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { type: 'success', text: 'TikTok ROI remains the highest across all channels; the "Replying to haters" format successfully drove 15% increase in site traffic.' },
            { type: 'success', text: 'Instagram Reels combined with small ($50-100) boosts are outperforming high-budget static feed ads in total conversions.' },
            { type: 'success', text: 'LinkedIn B2B CPE (Cost Per Engagement) dropped by 22% by focusing on personal founder stories over brand product posts.' },
            { type: 'warning', text: 'Facebook underperformance noted; suggest pivoting remaining FB budget into YouTube Shorts test for April.' },
          ].map((insight, i) => (
            <div key={i} className={`flex items-start gap-4 p-6 rounded-xl ${insight.type === 'success' ? 'bg-surface-container-low border-l-4 border-tertiary' : 'bg-error-container/20 border-l-4 border-error/50'}`}>
              <span className="material-symbols-outlined" style={{ color: insight.type === 'success' ? '#00685f' : '#ba1a1a', fontVariationSettings: "'FILL' 1" }}>
                {insight.type === 'success' ? 'check_circle' : 'warning'}
              </span>
              <p className="text-on-surface font-medium">{insight.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Content Plan */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-on-surface tracking-tight">AI-Generated Content Plan — April 2026</h3>
          <div className="h-[1px] flex-1 bg-linear-to-r from-outline-variant/50 to-transparent" />
        </div>
        <div className="bg-white rounded-xl p-1 shadow-sm overflow-hidden border border-outline-variant/10">
          <div className="border-l-8 border-primary bg-surface-container-low p-8">
            <div className="max-w-3xl space-y-8">
              {[
                { num: '01', title: 'Double TikTok output', desc: 'Focus on the "Day in the Life" series and direct community interaction videos which are currently peaking in the algorithm.' },
                { num: '02', title: 'Instagram Reels ×3/week', desc: 'Prioritize educational "How-To" carousels converted into short-form video reels with trending audio from the Pulse discovery engine.' },
                { num: '03', title: 'LinkedIn: 2 long-form posts/week', desc: 'Iterate on the $2M round success by sharing technical deep-dives into the SaaS build process to attract high-intent B2B leads.' },
              ].map((item) => (
                <div key={item.num} className="flex items-center gap-6">
                  <span className="text-6xl font-black text-primary/10">{item.num}</span>
                  <div className="space-y-1">
                    <h5 className="text-xl font-black text-on-surface">{item.title}</h5>
                    <p className="text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

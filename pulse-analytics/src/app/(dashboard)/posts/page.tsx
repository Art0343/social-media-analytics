'use client';

import { useState } from 'react';
import { postsData } from '@/lib/demo-data';
import { formatNumber, formatCurrency } from '@/lib/utils';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = postsData.filter((p) => {
    if (searchQuery && !p.caption.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (platformFilter !== 'all' && p.platformSlug !== platformFilter) return false;
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="p-8 min-h-screen">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-on-surface">Post Analytics</h1>
            <p className="text-on-surface-variant text-lg">Performance insights for your latest social media content.</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-center">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest">Total Reach</span>
            <span className="text-2xl font-black text-on-surface">1,429,082</span>
            <span className="text-tertiary text-xs font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12.4% vs last month
            </span>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col justify-center">
            <span className="text-secondary text-xs font-bold uppercase tracking-widest">Avg. Engagement</span>
            <span className="text-2xl font-black text-on-surface">4.82%</span>
            <span className="text-tertiary text-xs font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 0.9% vs last month
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-low p-4 rounded-xl flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm focus:ring-1 focus:ring-primary/20 placeholder:text-outline outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary/20 text-on-surface-variant cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
              <option value="youtube">YouTube</option>
              <option value="facebook">Facebook</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface-container-lowest border-none rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary/20 text-on-surface-variant cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="REEL">Reel</option>
              <option value="VIDEO">Video</option>
              <option value="CAROUSEL">Carousel</option>
              <option value="POST">Post</option>
            </select>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant/30 hidden lg:block" />
          <span className="text-on-surface-variant text-xs font-semibold px-2">{filtered.length} posts</span>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-secondary text-[11px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 min-w-[200px]">Caption</th>
                  <th className="px-6 py-4 text-right">Org Reach</th>
                  <th className="px-6 py-4 text-right">Org Impr</th>
                  <th className="px-6 py-4 text-right">Likes</th>
                  <th className="px-6 py-4 text-right">Comm</th>
                  <th className="px-6 py-4 text-right">Shares</th>
                  <th className="px-6 py-4 text-right">Saves</th>
                  <th className="px-6 py-4 text-right">Eng %</th>
                  <th className="px-6 py-4 text-center">Boosted</th>
                  <th className="px-6 py-4 text-right">Spend</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-surface-container">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-low/40 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold" style={{ color: post.platformColor }}>
                        <span className="material-symbols-outlined text-sm" style={{ color: post.platformColor }}>
                          {post.platformSlug === 'instagram' ? 'photo_camera' :
                           post.platformSlug === 'tiktok' ? 'music_note' :
                           post.platformSlug === 'facebook' ? 'thumb_up' :
                           post.platformSlug === 'linkedin' ? 'work' :
                           post.platformSlug === 'youtube' ? 'smart_display' : 'tag'}
                        </span>
                        {post.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${post.typeBadgeColor}`}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate w-48 font-medium text-on-surface">{post.caption}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.orgReach)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.impressions)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.likes)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.comments)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.shares)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs">{formatNumber(post.saves)}</td>
                    <td className="px-6 py-4 text-right text-tertiary font-bold">{post.engRate.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-center">
                      {post.isBoosted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">YES</span>
                      ) : (
                        <span className="text-outline text-[10px] font-bold">NO</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {post.spend ? (
                        <span className="font-bold text-amber-600">{formatCurrency(post.spend)}</span>
                      ) : (
                        <span className="text-outline">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low flex justify-between items-center text-xs font-semibold text-secondary">
            <span>Showing 1-{filtered.length} of {filtered.length} posts</span>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-surface-container-highest rounded transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="px-2 py-1 bg-primary text-white rounded">1</span>
              <button className="p-1 hover:bg-surface-container-highest rounded transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black text-on-surface">Creative Optimization</h3>
              <p className="text-on-surface-variant max-w-lg leading-relaxed">
                Our AI analysis shows that <span className="text-primary font-bold">Reels</span> posted on Tuesdays between
                4:00 PM and 6:00 PM generate <span className="text-tertiary font-bold">42% higher engagement</span> than
                your current average. Consider shifting your &ldquo;Behind the Scenes&rdquo; content to this window.
              </p>
              <button className="flex items-center gap-2 text-primary font-bold hover:underline">
                View Detailed Creative Breakdown <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-linear-to-l from-primary-fixed/20 to-transparent pointer-events-none" />
            <span className="material-symbols-outlined absolute right-8 top-8 text-8xl text-primary-fixed opacity-20 select-none">lightbulb</span>
          </div>
          <div className="bg-linear-to-br from-primary to-primary-container p-8 rounded-xl text-white flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Ready for the next level?</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Boosted posts on Instagram are currently yielding a 3.2x ROI for your segment.
              </p>
            </div>
            <button className="w-full bg-white text-primary font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-all mt-6">
              Scale Paid Campaigns
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

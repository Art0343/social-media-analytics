'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatNumber, formatCurrency } from '@/lib/utils';
import { useDateRange } from '@/lib/stores/useDateRange';

interface Post {
  id: string;
  platform: string;
  platformSlug: string;
  platformColor: string;
  date: string;
  type: string;
  typeBadgeColor: string;
  caption: string;
  orgReach: number;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engRate: number;
  isBoosted: boolean;
  spend: number | null;
}

interface PostsApiResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

function exportToCSV(posts: Post[]) {
  const headers = ['Platform', 'Date', 'Type', 'Caption', 'Org Reach', 'Impressions', 'Likes', 'Comments', 'Shares', 'Saves', 'Eng Rate (%)', 'Boosted', 'Spend'];
  const rows = posts.map((p) => [
    p.platform,
    p.date,
    p.type,
    `"${p.caption.replace(/"/g, '""')}"`,
    p.orgReach,
    p.impressions,
    p.likes,
    p.comments,
    p.shares,
    p.saves,
    p.engRate.toFixed(2),
    p.isBoosted ? 'Yes' : 'No',
    p.spend ?? 0,
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pulse-posts-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PostsPage() {
  const { days } = useDateRange();
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [metrics, setMetrics] = useState({ totalReach: 0, avgEngagement: 0 });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        days: days.toString(),
        workspaceId: 'ws-demo-pulse',
        search: searchQuery,
        platform: platformFilter === 'all' ? '' : platformFilter,
        postType: typeFilter === 'all' ? '' : typeFilter,
        page: '1',
        limit: '50',
      });

      const response = await fetch(`/api/posts?${params}`);
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data: PostsApiResponse = await response.json();
      setPosts(data.posts);
      setTotalCount(data.pagination.totalCount);
      // Calculate metrics from posts
      const totalReach = data.posts.reduce((sum, p) => sum + (p.orgReach || 0), 0);
      const avgEngagement = data.posts.length > 0 
        ? data.posts.reduce((sum, p) => sum + (p.engRate || 0), 0) / data.posts.length 
        : 0;
      setMetrics({ totalReach, avgEngagement });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }, [days, searchQuery, platformFilter, typeFilter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filtered = posts;

  return (
    <div className="p-8 min-h-screen bg-surface dark:bg-[#0a0f1c]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-on-surface dark:text-white">Post Analytics</h1>
            <p className="text-on-surface-variant dark:text-gray-400 text-lg">Performance insights for your latest social media content.</p>
          </div>
          <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155] flex flex-col justify-center">
            <span className="text-secondary dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Total Reach</span>
            <span className="text-2xl font-black text-on-surface dark:text-white">{formatNumber(metrics.totalReach)}</span>
            <span className="text-tertiary dark:text-green-400 text-xs font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12.4% vs last month
            </span>
          </div>
          <div className="bg-surface-container-lowest dark:bg-[#1e293b] p-6 rounded-xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155] flex flex-col justify-center">
            <span className="text-secondary dark:text-gray-400 text-xs font-bold uppercase tracking-widest">Avg. Engagement</span>
            <span className="text-2xl font-black text-on-surface dark:text-white">{metrics.avgEngagement.toFixed(2)}%</span>
            <span className="text-tertiary dark:text-green-400 text-xs font-medium flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 0.9% vs last month
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-surface-container-low dark:bg-[#1e293b] p-4 rounded-xl flex flex-wrap items-center gap-4 border border-outline-variant/10 dark:border-[#334155]">
          <div className="relative flex-1 min-w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant dark:text-gray-400 text-sm">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-[#0f172a] border border-outline-variant/30 dark:border-[#334155] rounded-lg text-sm text-on-surface dark:text-white focus:ring-1 focus:ring-primary/50 dark:focus:ring-[#3b82f6]/50 placeholder:text-outline/60 dark:placeholder:text-gray-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="bg-surface-container-lowest dark:bg-[#0f172a] border border-outline-variant/30 dark:border-[#334155] rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary/50 dark:focus:ring-[#3b82f6]/50 text-on-surface-variant dark:text-gray-300 cursor-pointer"
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
              className="bg-surface-container-lowest dark:bg-[#0f172a] border border-outline-variant/30 dark:border-[#334155] rounded-lg text-sm py-2 px-3 focus:ring-1 focus:ring-primary/50 dark:focus:ring-[#3b82f6]/50 text-on-surface-variant dark:text-gray-300 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="REEL">Reel</option>
              <option value="VIDEO">Video</option>
              <option value="CAROUSEL">Carousel</option>
              <option value="POST">Post</option>
            </select>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant/30 dark:bg-[#334155] hidden lg:block" />
          <span className="text-on-surface-variant dark:text-gray-400 text-xs font-semibold px-2">{filtered.length} posts</span>
          <div className="ml-auto">
            <button
              id="export-csv-btn"
              onClick={() => exportToCSV(filtered)}
              className="flex items-center gap-2 bg-surface-container-lowest dark:bg-[#0f172a] border border-outline-variant/30 dark:border-[#334155] text-on-surface-variant dark:text-gray-300 hover:text-primary dark:hover:text-white hover:border-primary/50 dark:hover:border-[#3b82f6]/50 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-surface-container-lowest dark:bg-[#1e293b] rounded-xl shadow-sm dark:shadow-lg dark:shadow-black/20 border border-outline-variant/10 dark:border-[#334155] overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low dark:bg-[#0f172a] text-secondary dark:text-gray-400 text-[11px] font-bold uppercase tracking-widest">
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
              <tbody className="text-sm divide-y divide-outline-variant/10 dark:divide-[#334155]">
                {loading ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-12 text-center text-secondary dark:text-gray-400">
                      <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                      Loading posts...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-12 text-center text-error dark:text-red-400">
                      Error: {error}
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-6 py-12 text-center text-secondary dark:text-gray-400">
                      No posts found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-surface-container-low/50 dark:hover:bg-[#334155]/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 font-semibold" style={{ color: post.platformColor }}>
                        <span className="material-symbols-outlined text-sm" style={{ color: post.platformColor }}>
                          {post.platformSlug === 'instagram' ? 'photo_camera' :
                           post.platformSlug === 'tiktok' ? 'music_note' :
                           post.platformSlug === 'facebook' ? 'thumb_up' :
                           post.platformSlug === 'linkedin' ? 'work' :
                           post.platformSlug === 'youtube' ? 'smart_display' :
                           post.platformSlug === 'twitter' ? 'flutter' :
                           post.platformSlug === 'whatsapp' ? 'chat_bubble' :
                           post.platformSlug === 'google-ads' ? 'ads_click' :
                           post.platformSlug === 'google-maps' ? 'location_on' : 'public'}
                        </span>
                        {post.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant dark:text-gray-400">{post.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${post.typeBadgeColor}`}>
                        {post.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="truncate w-48 font-medium text-on-surface dark:text-white">{post.caption}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.orgReach)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.impressions)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.likes)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.comments)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.shares)}</td>
                    <td className="px-6 py-4 text-right font-mono text-xs text-on-surface dark:text-white">{formatNumber(post.saves)}</td>
                    <td className="px-6 py-4 text-right text-tertiary dark:text-green-400 font-bold">{post.engRate.toFixed(2)}%</td>
                    <td className="px-6 py-4 text-center">
                      {post.isBoosted ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-400">YES</span>
                      ) : (
                        <span className="text-outline dark:text-gray-500 text-[10px] font-bold">NO</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {post.spend ? (
                        <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(post.spend)}</span>
                      ) : (
                        <span className="text-outline dark:text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-6 py-4 bg-surface-container-low dark:bg-[#0f172a] flex justify-between items-center text-xs font-semibold text-secondary dark:text-gray-400 border-t border-outline-variant/10 dark:border-[#334155]">
            <span>Showing {filtered.length} of {totalCount} posts</span>
            <div className="flex items-center gap-2">
              <button className="p-1 hover:bg-surface-container-high dark:hover:bg-[#334155] rounded transition-colors disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="px-2 py-1 bg-primary dark:bg-[#3b82f6] text-white rounded">1</span>
              <button className="p-1 hover:bg-surface-container-high dark:hover:bg-[#334155] rounded transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-surface-container-low dark:bg-[#1e293b] p-8 rounded-xl relative overflow-hidden border border-outline-variant/10 dark:border-[#334155]">
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black text-on-surface dark:text-white">Creative Optimization</h3>
              <p className="text-on-surface-variant dark:text-gray-400 max-w-lg leading-relaxed">
                Our AI analysis shows that <span className="text-primary dark:text-[#60a5fa] font-bold">Reels</span> posted on Tuesdays between
                4:00 PM and 6:00 PM generate <span className="text-tertiary dark:text-green-400 font-bold">42% higher engagement</span> than
                your current average. Consider shifting your &ldquo;Behind the Scenes&rdquo; content to this window.
              </p>
              <button className="flex items-center gap-2 text-primary dark:text-[#60a5fa] font-bold hover:underline">
                View Detailed Creative Breakdown <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/10 dark:from-[#3b82f6]/10 to-transparent pointer-events-none" />
            <span className="material-symbols-outlined absolute right-8 top-8 text-8xl text-primary dark:text-[#3b82f6] opacity-20 select-none">lightbulb</span>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-container dark:from-[#3b82f6] dark:to-[#1e40af] p-8 rounded-xl text-white flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Ready for the next level?</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Boosted posts on Instagram are currently yielding a 3.2x ROI for your segment.
              </p>
            </div>
            <button className="w-full bg-white text-primary dark:text-[#3b82f6] font-bold py-3 rounded-lg shadow-lg active:scale-95 transition-all mt-6">
              Scale Paid Campaigns
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

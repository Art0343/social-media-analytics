import { prisma } from '../src/lib/prisma';
import { getPlatformColor } from '../src/lib/platform-colors';

async function main() {
  console.log('🌱 Seeding database...\n');

  // ──────────────────────────────────────────────
  // 1. Built-in Social Platforms
  // ──────────────────────────────────────────────
  const platforms = [
    {
      name: 'Instagram',
      slug: 'instagram',
      isBuiltIn: true,
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      scopes: 'user_profile,user_media',
      apiBaseUrl: 'https://graph.instagram.com',
    },
    {
      name: 'Facebook',
      slug: 'facebook',
      isBuiltIn: true,
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: 'pages_show_list,pages_read_engagement,read_insights',
      apiBaseUrl: 'https://graph.facebook.com/v18.0',
    },
    {
      name: 'LinkedIn',
      slug: 'linkedin',
      isBuiltIn: true,
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: 'r_organization_social,rw_organization_admin',
      apiBaseUrl: 'https://api.linkedin.com/v2',
    },
    {
      name: 'YouTube',
      slug: 'youtube',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/youtube.readonly',
      apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    },
    {
      name: 'TikTok',
      slug: 'tiktok',
      isBuiltIn: true,
      authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
      tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
      scopes: 'user.info.basic,video.list',
      apiBaseUrl: 'https://open.tiktokapis.com/v2',
    },
    {
      name: 'Twitter / X',
      slug: 'twitter',
      isBuiltIn: true,
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      scopes: 'tweet.read,users.read,analytics.read',
      apiBaseUrl: 'https://api.twitter.com/2',
    },
    {
      name: 'WhatsApp Business',
      slug: 'whatsapp',
      isBuiltIn: true,
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: 'whatsapp_business_management,whatsapp_business_messaging',
      apiBaseUrl: 'https://graph.facebook.com/v18.0',
    },
    {
      name: 'Google Ads',
      slug: 'google-ads',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/adwords',
      apiBaseUrl: 'https://googleads.googleapis.com/v14',
    },
    {
      name: 'Google Maps',
      slug: 'google-maps',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/business.manage',
      apiBaseUrl: 'https://mybusiness.googleapis.com/v4',
    },
    {
      name: 'Meta Ads',
      slug: 'meta-ads',
      isBuiltIn: true,
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: 'ads_read',
      apiBaseUrl: 'https://graph.facebook.com/v18.0',
    },
    {
      name: 'LinkedIn Ads',
      slug: 'linkedin-ads',
      isBuiltIn: true,
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: 'r_ads_reporting',
      apiBaseUrl: 'https://api.linkedin.com/rest',
    },
    {
      name: 'TikTok Ads',
      slug: 'tiktok-ads',
      isBuiltIn: true,
      authUrl: 'https://business-api.tiktok.com/oauth',
      tokenUrl: 'https://business-api.tiktok.com/open_api/v1.3/oauth2/token/',
      scopes: 'ads.management',
      apiBaseUrl: 'https://business-api.tiktok.com',
    },
    {
      name: 'Snapchat Ads',
      slug: 'snapchat-ads',
      isBuiltIn: true,
      authUrl: 'https://accounts.snapchat.com/login/oauth2',
      tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
      scopes: 'snapchat-marketing-api',
      apiBaseUrl: 'https://adsapi.snapchat.com',
    },
    {
      name: 'Snapchat',
      slug: 'snapchat',
      isBuiltIn: true,
      authUrl: 'https://accounts.snapchat.com/login/oauth2',
      tokenUrl: 'https://accounts.snapchat.com/login/oauth2/access_token',
      scopes: 'snapchat-marketing-api',
      apiBaseUrl: 'https://kit.snapchat.com',
    },
  ];

  for (const p of platforms) {
    const brandColor = getPlatformColor(p.slug);
    await prisma.socialPlatform.upsert({
      where: { slug: p.slug },
      update: { brandColor },
      create: {
        name: p.name,
        slug: p.slug,
        brandColor,
        isBuiltIn: p.isBuiltIn,
        isActive: true,
        authUrl: p.authUrl,
        tokenUrl: p.tokenUrl,
        scopes: p.scopes,
        apiBaseUrl: p.apiBaseUrl,
      },
    });
  }
  console.log(`  ✅ ${platforms.length} platforms seeded`);

  // ──────────────────────────────────────────────
  // 2. Demo User
  // ──────────────────────────────────────────────
  const user = await prisma.user.upsert({
    where: { email: 'alex@pulse-analytics.io' },
    update: {},
    create: {
      name: 'Alex Rivera',
      email: 'alex@pulse-analytics.io',
      image: null,
    },
  });
  console.log(`  ✅ Demo user created: ${user.email}`);

  // ──────────────────────────────────────────────
  // 3. Demo Workspace
  // ──────────────────────────────────────────────
  const workspace = await prisma.workspace.upsert({
    where: { id: 'ws-demo-pulse' },
    update: {},
    create: {
      id: 'ws-demo-pulse',
      name: 'Pulse Creative Studio',
    },
  });
  console.log(`  ✅ Demo workspace created: ${workspace.name}`);

  // ──────────────────────────────────────────────
  // 4. User-Workspace Membership (Admin)
  // ──────────────────────────────────────────────
  await prisma.workspaceUser.upsert({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId: workspace.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      workspaceId: workspace.id,
      role: 'ADMIN',
    },
  });
  console.log('  ✅ User assigned as ADMIN');

  // ──────────────────────────────────────────────
  // 5. Connected Accounts (all platforms used on Connect Accounts page)
  // ──────────────────────────────────────────────
  const dbPlatforms = await prisma.socialPlatform.findMany();
  const pid = (slug: string) => {
    const p = dbPlatforms.find((x) => x.slug === slug);
    if (!p) throw new Error(`Missing platform slug: ${slug}`);
    return p.id;
  };

  const connectedAccounts = [
    { id: 'ca-ig-demo', platformId: pid('instagram'), accountName: 'Instagram Business', accountHandle: '@pulse_digital_official' },
    { id: 'ca-fb-demo', platformId: pid('facebook'), accountName: 'Facebook Pages', accountHandle: 'Pulse Analytics Global' },
    { id: 'ca-yt-demo', platformId: pid('youtube'), accountName: 'YouTube Studio', accountHandle: 'Pulse Creative Hub' },
    { id: 'ca-li-demo', platformId: pid('linkedin'), accountName: 'LinkedIn Company', accountHandle: 'Pulse Analytics Inc.' },
    { id: 'ca-tk-demo', platformId: pid('tiktok'), accountName: 'TikTok Creator', accountHandle: '@pulse_analytics' },
    { id: 'ca-tw-demo', platformId: pid('twitter'), accountName: 'X / Twitter', accountHandle: '@pulse_analytics' },
    { id: 'ca-wa-demo', platformId: pid('whatsapp'), accountName: 'WhatsApp Business', accountHandle: '+1 555 Pulse' },
    { id: 'ca-gmaps-demo', platformId: pid('google-maps'), accountName: 'Google Business Profile', accountHandle: 'Pulse HQ — Austin' },
    { id: 'ca-sc-demo', platformId: pid('snapchat'), accountName: 'Snapchat', accountHandle: '@pulse.official' },
    { id: 'ca-meta-ads-demo', platformId: pid('meta-ads'), accountName: 'Meta Ads', accountHandle: 'Pulse — FB+IG campaigns' },
    { id: 'ca-google-ads-demo', platformId: pid('google-ads'), accountName: 'Google Ads', accountHandle: 'Pulse Search + YouTube' },
    { id: 'ca-li-ads-demo', platformId: pid('linkedin-ads'), accountName: 'LinkedIn Ads', accountHandle: 'Campaign Manager' },
    { id: 'ca-tk-ads-demo', platformId: pid('tiktok-ads'), accountName: 'TikTok Ads', accountHandle: 'TikTok for Business' },
    { id: 'ca-sc-ads-demo', platformId: pid('snapchat-ads'), accountName: 'Snapchat Ads', accountHandle: 'SAN — Pulse' },
  ].map((row) => ({
    ...row,
    workspaceId: workspace.id,
    status: 'CONNECTED' as const,
  }));

  for (const ca of connectedAccounts) {
    await prisma.connectedAccount.upsert({
      where: { id: ca.id },
      update: {
        accountName: ca.accountName,
        accountHandle: ca.accountHandle,
        status: ca.status,
      },
      create: ca,
    });
  }
  console.log(`  ✅ ${connectedAccounts.length} connected accounts seeded`);

  // ──────────────────────────────────────────────
  // 6. Demo Posts (25 posts across platforms)
  // ──────────────────────────────────────────────
  const posts = [
    { externalId: 'ig-001', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: 'New product launch event highlights...', publishedAt: new Date('2026-03-22'), orgReach: 428102, impressions: 612440, likes: 12402, comments: 842, shares: 2110, saves: 5320, engRate: 5.82, isBoosted: true, paidSpend: 1200, paidReach: 215000, paidCPE: 0.12, roiScore: 92 },
    { externalId: 'tk-001', platformSlug: 'tiktok', connectedAccountId: 'ca-tk-demo', postType: 'VIDEO', caption: 'Day in my life as a founder...', publishedAt: new Date('2026-03-20'), orgReach: 892300, impressions: 1204110, likes: 142000, comments: 4320, shares: 18500, saves: 12100, engRate: 14.2, isBoosted: false },
    { externalId: 'ig-002', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'CAROUSEL', caption: 'Behind the scenes of our creative studio', publishedAt: new Date('2026-03-18'), orgReach: 45102, impressions: 72400, likes: 3204, comments: 156, shares: 420, saves: 890, engRate: 4.10, isBoosted: false },
    { externalId: 'li-001', platformSlug: 'linkedin', connectedAccountId: 'ca-li-demo', postType: 'POST', caption: 'Why we stopped cold emailing in 2026', publishedAt: new Date('2026-03-17'), orgReach: 12400, impressions: 18200, likes: 842, comments: 94, shares: 122, saves: 210, engRate: 2.44, isBoosted: false },
    { externalId: 'yt-001', platformSlug: 'youtube', connectedAccountId: 'ca-yt-demo', postType: 'VIDEO', caption: 'How we grew to 1M users in 6 months', publishedAt: new Date('2026-03-15'), orgReach: 245000, impressions: 382000, likes: 22100, comments: 1840, shares: 3400, saves: 15200, engRate: 9.20, isBoosted: false },
    { externalId: 'fb-001', platformSlug: 'facebook', connectedAccountId: 'ca-fb-demo', postType: 'POST', caption: '3 mistakes every new entrepreneur makes', publishedAt: new Date('2026-03-14'), orgReach: 152400, impressions: 245100, likes: 5320, comments: 482, shares: 810, saves: 1100, engRate: 3.80, isBoosted: true, paidSpend: 450, paidReach: 89000, paidCPE: 2.40, roiScore: 48 },
    { externalId: 'tk-002', platformSlug: 'tiktok', connectedAccountId: 'ca-tk-demo', postType: 'REEL', caption: 'Replying to the haters (storytime)...', publishedAt: new Date('2026-03-12'), orgReach: 1240000, impressions: 1820000, likes: 240000, comments: 8400, shares: 32100, saves: 24500, engRate: 18.4, isBoosted: false },
    { externalId: 'ig-003', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: '30 days of consistent posting — results', publishedAt: new Date('2026-03-10'), orgReach: 52400, impressions: 78100, likes: 4800, comments: 320, shares: 640, saves: 1200, engRate: 5.1, isBoosted: true, paidSpend: 200, paidReach: 45000, paidCPE: 0.18, roiScore: 85 },
    { externalId: 'li-002', platformSlug: 'linkedin', connectedAccountId: 'ca-li-demo', postType: 'POST', caption: '$2M seed round — here\'s what I learned', publishedAt: new Date('2026-03-08'), orgReach: 32400, impressions: 48200, likes: 2100, comments: 184, shares: 420, saves: 580, engRate: 6.1, isBoosted: false },
    { externalId: 'yt-002', platformSlug: 'youtube', connectedAccountId: 'ca-yt-demo', postType: 'VIDEO', caption: '0 to 10K subscribers — a complete breakdown', publishedAt: new Date('2026-03-06'), orgReach: 128000, impressions: 192000, likes: 9800, comments: 920, shares: 1400, saves: 4200, engRate: 7.8, isBoosted: true, paidSpend: 240, paidReach: 62000, paidCPE: 0.32, roiScore: 72 },
    { externalId: 'ig-004', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'POST', caption: 'Our office setup tour — 2026 edition', publishedAt: new Date('2026-03-04'), orgReach: 18200, impressions: 24100, likes: 1240, comments: 86, shares: 110, saves: 340, engRate: 3.2, isBoosted: false },
    { externalId: 'tk-003', platformSlug: 'tiktok', connectedAccountId: 'ca-tk-demo', postType: 'VIDEO', caption: 'POV: You automated your entire social strategy', publishedAt: new Date('2026-03-02'), orgReach: 680000, impressions: 920000, likes: 95000, comments: 3200, shares: 14000, saves: 8400, engRate: 12.1, isBoosted: false },
    { externalId: 'fb-002', platformSlug: 'facebook', connectedAccountId: 'ca-fb-demo', postType: 'POST', caption: 'Weekly growth report recap thread', publishedAt: new Date('2026-02-28'), orgReach: 8400, impressions: 12100, likes: 420, comments: 32, shares: 48, saves: 120, engRate: 1.8, isBoosted: false },
    { externalId: 'ig-005', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: 'How to read your analytics like a pro', publishedAt: new Date('2026-02-25'), orgReach: 62000, impressions: 94000, likes: 5400, comments: 410, shares: 820, saves: 2100, engRate: 6.8, isBoosted: false },
    { externalId: 'li-003', platformSlug: 'linkedin', connectedAccountId: 'ca-li-demo', postType: 'POST', caption: 'The SaaS metrics that actually matter', publishedAt: new Date('2026-02-22'), orgReach: 22100, impressions: 31400, likes: 1480, comments: 128, shares: 280, saves: 420, engRate: 4.2, isBoosted: false },
    { externalId: 'tw-001', platformSlug: 'twitter', connectedAccountId: 'ca-tw-demo', postType: 'POST', caption: 'Shipping dark mode for Pulse Analytics today 🌙', publishedAt: new Date('2026-03-21'), orgReach: 18200, impressions: 42000, likes: 890, comments: 124, shares: 340, saves: 0, engRate: 3.9, isBoosted: false },
    { externalId: 'wa-001', platformSlug: 'whatsapp', connectedAccountId: 'ca-wa-demo', postType: 'STATUS', caption: 'New template: weekly analytics digest for clients', publishedAt: new Date('2026-03-19'), orgReach: 4200, impressions: 6200, likes: 210, comments: 88, shares: 42, saves: 0, engRate: 2.1, isBoosted: false },
    { externalId: 'gm-001', platformSlug: 'google-maps', connectedAccountId: 'ca-gmaps-demo', postType: 'UPDATE', caption: 'Extended hours this weekend — visit our studio', publishedAt: new Date('2026-03-16'), orgReach: 5600, impressions: 9800, likes: 120, comments: 34, shares: 18, saves: 0, engRate: 1.8, isBoosted: false },
    { externalId: 'sc-001', platformSlug: 'snapchat', connectedAccountId: 'ca-sc-demo', postType: 'STORY', caption: 'Behind the lens: product shoot BTS', publishedAt: new Date('2026-03-11'), orgReach: 12400, impressions: 21000, likes: 0, comments: 0, shares: 0, saves: 0, engRate: 5.8, isBoosted: false },
    { externalId: 'sc-002', platformSlug: 'snapchat', connectedAccountId: 'ca-sc-demo', postType: 'SPOTLIGHT', caption: '5 analytics mistakes brands still make', publishedAt: new Date('2026-02-26'), orgReach: 48200, impressions: 76000, likes: 0, comments: 0, shares: 0, saves: 0, engRate: 6.4, isBoosted: true, paidSpend: 180, paidReach: 22000, paidCPE: 0.45, roiScore: 78 },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: {
        externalId_platformSlug: {
          externalId: post.externalId,
          platformSlug: post.platformSlug,
        },
      },
      update: {},
      create: {
        workspaceId: workspace.id,
        connectedAccountId: post.connectedAccountId,
        platformSlug: post.platformSlug,
        postType: post.postType,
        externalId: post.externalId,
        caption: post.caption,
        publishedAt: post.publishedAt,
        orgReach: post.orgReach,
        impressions: post.impressions,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        saves: post.saves,
        engRate: post.engRate,
        isBoosted: post.isBoosted,
        paidSpend: post.paidSpend ?? null,
        paidReach: post.paidReach ?? null,
        paidCPE: post.paidCPE ?? null,
        roiScore: post.roiScore ?? null,
      },
    });
  }
  console.log(`  ✅ ${posts.length} demo posts seeded`);

  // ──────────────────────────────────────────────
  // 7. Platform Daily Summaries (last 365 days) — all connected platforms
  // ──────────────────────────────────────────────
  type Template = { org: number; paid: number; imp: number; eng: number; spend: number; followers: number };
  const METRIC_TEMPLATES: Record<string, Template> = {
    instagram: { org: 2400, paid: 1800, imp: 4200, eng: 4.5, spend: 22, followers: 125 },
    tiktok: { org: 3500, paid: 500, imp: 4800, eng: 7.2, spend: 5, followers: 75 },
    youtube: { org: 1300, paid: 600, imp: 2100, eng: 4.2, spend: 7, followers: 27 },
    facebook: { org: 850, paid: 900, imp: 1850, eng: 1.5, spend: 14, followers: 35 },
    linkedin: { org: 600, paid: 400, imp: 1050, eng: 6.0, spend: 9, followers: 15 },
    twitter: { org: 380, paid: 220, imp: 720, eng: 2.8, spend: 6, followers: 22 },
    whatsapp: { org: 120, paid: 80, imp: 280, eng: 3.1, spend: 2, followers: 8 },
    'google-maps': { org: 200, paid: 50, imp: 450, eng: 2.0, spend: 1, followers: 5 },
    snapchat: { org: 900, paid: 150, imp: 1400, eng: 5.5, spend: 4, followers: 18 },
    'google-ads': { org: 0, paid: 8000, imp: 24000, eng: 0, spend: 120, followers: 0 },
    'meta-ads': { org: 0, paid: 12000, imp: 36000, eng: 0, spend: 180, followers: 0 },
    'linkedin-ads': { org: 0, paid: 3500, imp: 9000, eng: 0, spend: 45, followers: 0 },
    'tiktok-ads': { org: 0, paid: 6000, imp: 15000, eng: 0, spend: 55, followers: 0 },
    'snapchat-ads': { org: 0, paid: 2800, imp: 7000, eng: 0, spend: 28, followers: 0 },
  };

  const SUMMARY_SLUGS = Object.keys(METRIC_TEMPLATES);
  const today = new Date();
  let summaryCount = 0;

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(12, 0, 0, 0);
    const dayOfYear = 365 - i;
    const seasonalFactor = 1 + 0.2 * Math.sin((dayOfYear / 365) * 2 * Math.PI);
    const randomFactor = 1 + (Math.random() * 0.4 - 0.2);
    const dayFactor = seasonalFactor * randomFactor;

    for (const platformSlug of SUMMARY_SLUGS) {
      const t = METRIC_TEMPLATES[platformSlug];
      await prisma.platformDailySummary.upsert({
        where: {
          workspaceId_platformSlug_date: {
            workspaceId: workspace.id,
            platformSlug,
            date,
          },
        },
        update: {
          orgReach: Math.round(t.org * dayFactor),
          paidReach: Math.round(t.paid * dayFactor),
          impressions: Math.round(t.imp * dayFactor),
          engRate: t.eng,
          adSpend: Math.round(t.spend * dayFactor),
          followers: Math.round(t.followers * Math.min(dayFactor, 1.2)),
        },
        create: {
          workspaceId: workspace.id,
          platformSlug,
          date,
          orgReach: Math.round(t.org * dayFactor),
          paidReach: Math.round(t.paid * dayFactor),
          impressions: Math.round(t.imp * dayFactor),
          engRate: t.eng,
          adSpend: Math.round(t.spend * dayFactor),
          followers: Math.round(t.followers * Math.min(dayFactor, 1.2)),
        },
      });
      summaryCount++;
    }
  }
  console.log(`  ✅ ${summaryCount} platform daily summaries seeded`);

  // ──────────────────────────────────────────────
  // 8. Demo AI Insight Report
  // ──────────────────────────────────────────────
  await prisma.aIInsightReport.upsert({
    where: { id: 'ai-report-march-2026' },
    update: {},
    create: {
      id: 'ai-report-march-2026',
      workspaceId: workspace.id,
      period: 'March 2026',
      summary: 'TikTok organic reach surpassed Instagram for the first time. Reels continue to outperform static posts by 3.2x. Facebook spend efficiency is declining — consider reallocation.',
      topContent: JSON.stringify([
        { title: 'Replying to haters', platform: 'TikTok', reach: '1.24M', engRate: '18.4%' },
        { title: 'Day in my life', platform: 'TikTok', reach: '892K', engRate: '14.2%' },
        { title: 'Product launch', platform: 'Instagram', reach: '428K', engRate: '5.8%' },
      ]),
      wastedSpend: JSON.stringify([
        { post: '3 mistakes', platform: 'Facebook', spend: '$420', cpe: '$2.40', recommendation: 'Cut budget' },
      ]),
      boostCandidates: JSON.stringify([
        { post: 'Replying to haters', platform: 'TikTok', engRate: '8.1%', predictedCPV: '$0.02' },
      ]),
      budgetReco: JSON.stringify([
        { action: 'Reduce', platform: 'Facebook', from: '$420', to: '$320' },
        { action: 'Increase', platform: 'TikTok', amount: '+$60' },
      ]),
      roiTable: JSON.stringify([
        { post: 'Product launch', platform: 'Instagram', roiScore: 92, recommendation: 'Scale up' },
        { post: '3 mistakes', platform: 'Facebook', roiScore: 48, recommendation: 'Cut budget' },
      ]),
      contentPlan: JSON.stringify([
        { title: 'Double TikTok output', description: 'Focus on Day in the Life series' },
        { title: 'Instagram Reels x3/week', description: 'Educational How-To content' },
        { title: 'LinkedIn 2x long-form/week', description: 'Technical deep-dives' },
      ]),
    },
  });
  console.log('  ✅ AI insight report seeded');

  console.log('\n🎉 Seed complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

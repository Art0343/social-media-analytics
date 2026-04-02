import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('🌱 Seeding database...\n');

  // ──────────────────────────────────────────────
  // 1. Built-in Social Platforms
  // ──────────────────────────────────────────────
  const platforms = [
    {
      name: 'Instagram',
      slug: 'instagram',
      brandColor: '#E1306C',
      isBuiltIn: true,
      authUrl: 'https://api.instagram.com/oauth/authorize',
      tokenUrl: 'https://api.instagram.com/oauth/access_token',
      scopes: 'user_profile,user_media',
      apiBaseUrl: 'https://graph.instagram.com',
    },
    {
      name: 'Facebook',
      slug: 'facebook',
      brandColor: '#1877F2',
      isBuiltIn: true,
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: 'pages_show_list,pages_read_engagement,read_insights',
      apiBaseUrl: 'https://graph.facebook.com/v18.0',
    },
    {
      name: 'LinkedIn',
      slug: 'linkedin',
      brandColor: '#0A66C2',
      isBuiltIn: true,
      authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
      scopes: 'r_organization_social,rw_organization_admin',
      apiBaseUrl: 'https://api.linkedin.com/v2',
    },
    {
      name: 'YouTube',
      slug: 'youtube',
      brandColor: '#FF0000',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/youtube.readonly',
      apiBaseUrl: 'https://www.googleapis.com/youtube/v3',
    },
    {
      name: 'TikTok',
      slug: 'tiktok',
      brandColor: '#000000',
      isBuiltIn: true,
      authUrl: 'https://www.tiktok.com/v2/auth/authorize/',
      tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
      scopes: 'user.info.basic,video.list',
      apiBaseUrl: 'https://open.tiktokapis.com/v2',
    },
    {
      name: 'Twitter / X',
      slug: 'twitter',
      brandColor: '#000000',
      isBuiltIn: true,
      authUrl: 'https://twitter.com/i/oauth2/authorize',
      tokenUrl: 'https://api.twitter.com/2/oauth2/token',
      scopes: 'tweet.read,users.read,analytics.read',
      apiBaseUrl: 'https://api.twitter.com/2',
    },
    {
      name: 'WhatsApp Business',
      slug: 'whatsapp',
      brandColor: '#25D366',
      isBuiltIn: true,
      authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
      tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
      scopes: 'whatsapp_business_management,whatsapp_business_messaging',
      apiBaseUrl: 'https://graph.facebook.com/v18.0',
    },
    {
      name: 'Google Ads',
      slug: 'google-ads',
      brandColor: '#4285F4',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/adwords',
      apiBaseUrl: 'https://googleads.googleapis.com/v14',
    },
    {
      name: 'Google Maps',
      slug: 'google-maps',
      brandColor: '#4285F4',
      isBuiltIn: true,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      scopes: 'https://www.googleapis.com/auth/business.manage',
      apiBaseUrl: 'https://mybusiness.googleapis.com/v4',
    },
  ];

  for (const p of platforms) {
    await prisma.socialPlatform.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        brandColor: p.brandColor,
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
  // 5. Connected Accounts
  // ──────────────────────────────────────────────
  const dbPlatforms = await prisma.socialPlatform.findMany();
  const igPlatform = dbPlatforms.find((p) => p.slug === 'instagram');
  const fbPlatform = dbPlatforms.find((p) => p.slug === 'facebook');
  const ytPlatform = dbPlatforms.find((p) => p.slug === 'youtube');

  const connectedAccounts = [
    {
      id: 'ca-ig-demo',
      workspaceId: workspace.id,
      platformId: igPlatform!.id,
      accountName: 'Instagram Business',
      accountHandle: '@pulse_digital_official',
      status: 'CONNECTED',
    },
    {
      id: 'ca-fb-demo',
      workspaceId: workspace.id,
      platformId: fbPlatform!.id,
      accountName: 'Facebook Pages',
      accountHandle: 'Pulse Analytics Global',
      status: 'CONNECTED',
    },
    {
      id: 'ca-yt-demo',
      workspaceId: workspace.id,
      platformId: ytPlatform!.id,
      accountName: 'YouTube Studio',
      accountHandle: 'Pulse Creative Hub',
      status: 'CONNECTED',
    },
  ];

  for (const ca of connectedAccounts) {
    await prisma.connectedAccount.upsert({
      where: { id: ca.id },
      update: {},
      create: ca,
    });
  }
  console.log(`  ✅ ${connectedAccounts.length} connected accounts seeded`);

  // ──────────────────────────────────────────────
  // 6. Demo Posts (25 posts across platforms)
  // ──────────────────────────────────────────────
  const posts = [
    { externalId: 'ig-001', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: 'New product launch event highlights...', publishedAt: new Date('2026-03-22'), orgReach: 428102, impressions: 612440, likes: 12402, comments: 842, shares: 2110, saves: 5320, engRate: 5.82, isBoosted: true, paidSpend: 1200, paidReach: 215000, paidCPE: 0.12, roiScore: 92 },
    { externalId: 'tk-001', platformSlug: 'tiktok', connectedAccountId: 'ca-ig-demo', postType: 'VIDEO', caption: 'Day in my life as a founder...', publishedAt: new Date('2026-03-20'), orgReach: 892300, impressions: 1204110, likes: 142000, comments: 4320, shares: 18500, saves: 12100, engRate: 14.2, isBoosted: false },
    { externalId: 'ig-002', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'CAROUSEL', caption: 'Behind the scenes of our creative studio', publishedAt: new Date('2026-03-18'), orgReach: 45102, impressions: 72400, likes: 3204, comments: 156, shares: 420, saves: 890, engRate: 4.10, isBoosted: false },
    { externalId: 'li-001', platformSlug: 'linkedin', connectedAccountId: 'ca-ig-demo', postType: 'POST', caption: 'Why we stopped cold emailing in 2026', publishedAt: new Date('2026-03-17'), orgReach: 12400, impressions: 18200, likes: 842, comments: 94, shares: 122, saves: 210, engRate: 2.44, isBoosted: false },
    { externalId: 'yt-001', platformSlug: 'youtube', connectedAccountId: 'ca-yt-demo', postType: 'VIDEO', caption: 'How we grew to 1M users in 6 months', publishedAt: new Date('2026-03-15'), orgReach: 245000, impressions: 382000, likes: 22100, comments: 1840, shares: 3400, saves: 15200, engRate: 9.20, isBoosted: false },
    { externalId: 'fb-001', platformSlug: 'facebook', connectedAccountId: 'ca-fb-demo', postType: 'POST', caption: '3 mistakes every new entrepreneur makes', publishedAt: new Date('2026-03-14'), orgReach: 152400, impressions: 245100, likes: 5320, comments: 482, shares: 810, saves: 1100, engRate: 3.80, isBoosted: true, paidSpend: 450, paidReach: 89000, paidCPE: 2.40, roiScore: 48 },
    { externalId: 'tk-002', platformSlug: 'tiktok', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: 'Replying to the haters (storytime)...', publishedAt: new Date('2026-03-12'), orgReach: 1240000, impressions: 1820000, likes: 240000, comments: 8400, shares: 32100, saves: 24500, engRate: 18.4, isBoosted: false },
    { externalId: 'ig-003', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: '30 days of consistent posting — results', publishedAt: new Date('2026-03-10'), orgReach: 52400, impressions: 78100, likes: 4800, comments: 320, shares: 640, saves: 1200, engRate: 5.1, isBoosted: true, paidSpend: 200, paidReach: 45000, paidCPE: 0.18, roiScore: 85 },
    { externalId: 'li-002', platformSlug: 'linkedin', connectedAccountId: 'ca-ig-demo', postType: 'POST', caption: '$2M seed round — here\'s what I learned', publishedAt: new Date('2026-03-08'), orgReach: 32400, impressions: 48200, likes: 2100, comments: 184, shares: 420, saves: 580, engRate: 6.1, isBoosted: false },
    { externalId: 'yt-002', platformSlug: 'youtube', connectedAccountId: 'ca-yt-demo', postType: 'VIDEO', caption: '0 to 10K subscribers — a complete breakdown', publishedAt: new Date('2026-03-06'), orgReach: 128000, impressions: 192000, likes: 9800, comments: 920, shares: 1400, saves: 4200, engRate: 7.8, isBoosted: true, paidSpend: 240, paidReach: 62000, paidCPE: 0.32, roiScore: 72 },
    { externalId: 'ig-004', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'POST', caption: 'Our office setup tour — 2026 edition', publishedAt: new Date('2026-03-04'), orgReach: 18200, impressions: 24100, likes: 1240, comments: 86, shares: 110, saves: 340, engRate: 3.2, isBoosted: false },
    { externalId: 'tk-003', platformSlug: 'tiktok', connectedAccountId: 'ca-ig-demo', postType: 'VIDEO', caption: 'POV: You automated your entire social strategy', publishedAt: new Date('2026-03-02'), orgReach: 680000, impressions: 920000, likes: 95000, comments: 3200, shares: 14000, saves: 8400, engRate: 12.1, isBoosted: false },
    { externalId: 'fb-002', platformSlug: 'facebook', connectedAccountId: 'ca-fb-demo', postType: 'POST', caption: 'Weekly growth report recap thread', publishedAt: new Date('2026-02-28'), orgReach: 8400, impressions: 12100, likes: 420, comments: 32, shares: 48, saves: 120, engRate: 1.8, isBoosted: false },
    { externalId: 'ig-005', platformSlug: 'instagram', connectedAccountId: 'ca-ig-demo', postType: 'REEL', caption: 'How to read your analytics like a pro', publishedAt: new Date('2026-02-25'), orgReach: 62000, impressions: 94000, likes: 5400, comments: 410, shares: 820, saves: 2100, engRate: 6.8, isBoosted: false },
    { externalId: 'li-003', platformSlug: 'linkedin', connectedAccountId: 'ca-ig-demo', postType: 'POST', caption: 'The SaaS metrics that actually matter', publishedAt: new Date('2026-02-22'), orgReach: 22100, impressions: 31400, likes: 1480, comments: 128, shares: 280, saves: 420, engRate: 4.2, isBoosted: false },
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
  // 7. Platform Daily Summaries (6 months)
  // ──────────────────────────────────────────────
  const monthlyData = [
    { month: '2025-10', ig: { org: 42000, paid: 18000, imp: 64000, eng: 4.2, spend: 280, followers: 12000 }, tk: { org: 38000, paid: 5000, imp: 52000, eng: 6.8, spend: 60, followers: 8000 }, yt: { org: 22000, paid: 8000, imp: 34000, eng: 3.8, spend: 120, followers: 5000 }, fb: { org: 12000, paid: 9000, imp: 24000, eng: 1.2, spend: 200, followers: 9500 }, li: { org: 6000, paid: 5000, imp: 11000, eng: 5.4, spend: 80, followers: 3000 } },
    { month: '2025-11', ig: { org: 48000, paid: 22000, imp: 74000, eng: 4.5, spend: 350, followers: 13500 }, tk: { org: 52000, paid: 6000, imp: 72000, eng: 7.2, spend: 80, followers: 10200 }, yt: { org: 26000, paid: 9000, imp: 38000, eng: 4.0, spend: 150, followers: 5800 }, fb: { org: 13000, paid: 10000, imp: 26000, eng: 1.4, spend: 250, followers: 9800 }, li: { org: 7000, paid: 6000, imp: 13500, eng: 5.8, spend: 100, followers: 3200 } },
    { month: '2025-12', ig: { org: 52000, paid: 24000, imp: 80000, eng: 4.8, spend: 480, followers: 14200 }, tk: { org: 62000, paid: 7000, imp: 84000, eng: 7.8, spend: 100, followers: 12400 }, yt: { org: 28000, paid: 10000, imp: 42000, eng: 4.2, spend: 180, followers: 6200 }, fb: { org: 14000, paid: 11000, imp: 28000, eng: 1.6, spend: 320, followers: 10000 }, li: { org: 8000, paid: 6500, imp: 15000, eng: 6.0, spend: 120, followers: 3500 } },
    { month: '2026-01', ig: { org: 58000, paid: 28000, imp: 92000, eng: 5.0, spend: 550, followers: 15800 }, tk: { org: 78000, paid: 8000, imp: 102000, eng: 8.4, spend: 120, followers: 15000 }, yt: { org: 32000, paid: 12000, imp: 48000, eng: 4.4, spend: 200, followers: 6800 }, fb: { org: 15000, paid: 13000, imp: 32000, eng: 1.8, spend: 380, followers: 10200 }, li: { org: 9000, paid: 7000, imp: 17000, eng: 6.2, spend: 150, followers: 3800 } },
    { month: '2026-02', ig: { org: 64000, paid: 32000, imp: 104000, eng: 5.2, spend: 600, followers: 17000 }, tk: { org: 92000, paid: 9000, imp: 124000, eng: 9.0, spend: 140, followers: 18500 }, yt: { org: 36000, paid: 14000, imp: 54000, eng: 4.5, spend: 210, followers: 7400 }, fb: { org: 16000, paid: 14000, imp: 34000, eng: 2.0, spend: 400, followers: 10500 }, li: { org: 10000, paid: 8000, imp: 19000, eng: 6.4, spend: 200, followers: 4100 } },
    { month: '2026-03', ig: { org: 71000, paid: 52000, imp: 128000, eng: 5.4, spend: 650, followers: 18500 }, tk: { org: 105000, paid: 15000, imp: 148000, eng: 9.6, spend: 160, followers: 22000 }, yt: { org: 40000, paid: 18000, imp: 62000, eng: 4.8, spend: 220, followers: 8200 }, fb: { org: 26000, paid: 27000, imp: 58000, eng: 2.8, spend: 420, followers: 10800 }, li: { org: 18500, paid: 12000, imp: 32000, eng: 6.8, spend: 270, followers: 4500 } },
  ];

  let summaryCount = 0;
  for (const m of monthlyData) {
    const date = new Date(m.month + '-15');
    const entries = [
      { platformSlug: 'instagram', ...m.ig },
      { platformSlug: 'tiktok', ...m.tk },
      { platformSlug: 'youtube', ...m.yt },
      { platformSlug: 'facebook', ...m.fb },
      { platformSlug: 'linkedin', ...m.li },
    ];

    for (const e of entries) {
      await prisma.platformDailySummary.upsert({
        where: {
          workspaceId_platformSlug_date: {
            workspaceId: workspace.id,
            platformSlug: e.platformSlug,
            date,
          },
        },
        update: {},
        create: {
          workspaceId: workspace.id,
          platformSlug: e.platformSlug,
          date,
          orgReach: e.org,
          paidReach: e.paid,
          impressions: e.imp,
          engRate: e.eng,
          adSpend: e.spend,
          followers: e.followers,
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

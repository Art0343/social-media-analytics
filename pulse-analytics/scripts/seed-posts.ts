import { prisma } from '@/lib/prisma';
import { subDays, subMonths } from 'date-fns';

async function seedPosts() {
  const workspaceId = 'ws-demo-pulse';
  
  // Get connected accounts to link posts to
  const accounts = await prisma.connectedAccount.findMany({
    where: { workspaceId },
    include: { platform: true }
  });
  
  if (accounts.length === 0) {
    console.log('No connected accounts found. Please run workspace seed first.');
    return;
  }
  
  // Create posts data spanning 1 year
  const now = new Date();
  
  const postsData = [
    // Recent posts (last 7 days)
    {
      caption: 'Today\'s big announcement is finally here! 🚀',
      platformSlug: 'instagram',
      postType: 'REEL',
      publishedAt: subDays(now, 0),
      orgReach: 245000,
      paidReach: 15000,
      impressions: 380000,
      likes: 18500,
      comments: 1200,
      shares: 3200,
      saves: 8500,
      engRate: 7.2,
      isBoosted: true,
      paidSpend: 1500
    },
    {
      caption: 'Quick tip that changed my life ✨',
      platformSlug: 'tiktok',
      postType: 'VIDEO',
      publishedAt: subDays(now, 3),
      orgReach: 520000,
      paidReach: 0,
      impressions: 780000,
      likes: 65000,
      comments: 2100,
      shares: 8200,
      saves: 12400,
      engRate: 12.5,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Behind the scenes of our biggest launch',
      platformSlug: 'youtube',
      postType: 'VIDEO',
      publishedAt: subDays(now, 5),
      orgReach: 185000,
      paidReach: 0,
      impressions: 280000,
      likes: 15200,
      comments: 840,
      shares: 2100,
      saves: 11200,
      engRate: 8.4,
      isBoosted: false,
      paidSpend: 0
    },
    // Posts from 1-2 months ago (30-60 days)
    {
      caption: '5 lessons I learned scaling to 100K followers',
      platformSlug: 'instagram',
      postType: 'CAROUSEL',
      publishedAt: subDays(now, 45),
      orgReach: 125000,
      paidReach: 0,
      impressions: 195000,
      likes: 8500,
      comments: 420,
      shares: 1800,
      saves: 9500,
      engRate: 6.8,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'The future of social media marketing in 2026',
      platformSlug: 'linkedin',
      postType: 'POST',
      publishedAt: subDays(now, 62),
      orgReach: 42000,
      paidReach: 5000,
      impressions: 65000,
      likes: 2800,
      comments: 340,
      shares: 890,
      saves: 520,
      engRate: 5.2,
      isBoosted: true,
      paidSpend: 800
    },
    {
      caption: 'Community update: 10K new members this month!',
      platformSlug: 'facebook',
      postType: 'POST',
      publishedAt: subDays(now, 78),
      orgReach: 85000,
      paidReach: 0,
      impressions: 125000,
      likes: 4200,
      comments: 580,
      shares: 1200,
      saves: 890,
      engRate: 4.1,
      isBoosted: false,
      paidSpend: 0
    },
    // Posts from 2-3 months ago (60-90 days)
    {
      caption: 'This trend never gets old 😂',
      platformSlug: 'tiktok',
      postType: 'REEL',
      publishedAt: subDays(now, 85),
      orgReach: 890000,
      paidReach: 0,
      impressions: 1200000,
      likes: 125000,
      comments: 4500,
      shares: 15000,
      saves: 28000,
      engRate: 15.2,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Product demo: watch until the end!',
      platformSlug: 'instagram',
      postType: 'REEL',
      publishedAt: subDays(now, 72),
      orgReach: 320000,
      paidReach: 25000,
      impressions: 480000,
      likes: 22000,
      comments: 1800,
      shares: 4200,
      saves: 11200,
      engRate: 8.9,
      isBoosted: true,
      paidSpend: 2500
    },
    // Posts from 3-6 months ago (90-180 days)
    {
      caption: 'Full tutorial: Advanced analytics setup',
      platformSlug: 'youtube',
      postType: 'VIDEO',
      publishedAt: subDays(now, 110),
      orgReach: 145000,
      paidReach: 0,
      impressions: 220000,
      likes: 9800,
      comments: 620,
      shares: 1400,
      saves: 15200,
      engRate: 6.5,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'We\'re hiring! Join our amazing team',
      platformSlug: 'linkedin',
      postType: 'POST',
      publishedAt: subDays(now, 125),
      orgReach: 28000,
      paidReach: 2000,
      impressions: 42000,
      likes: 1200,
      comments: 180,
      shares: 450,
      saves: 280,
      engRate: 4.2,
      isBoosted: true,
      paidSpend: 500
    },
    {
      caption: 'Q3 results are in 📊',
      platformSlug: 'twitter',
      postType: 'POST',
      publishedAt: subDays(now, 140),
      orgReach: 52000,
      paidReach: 0,
      impressions: 78000,
      likes: 3200,
      comments: 420,
      shares: 890,
      saves: 120,
      engRate: 5.8,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'How to optimize your content strategy',
      platformSlug: 'facebook',
      postType: 'POST',
      publishedAt: subDays(now, 155),
      orgReach: 65000,
      paidReach: 8000,
      impressions: 98000,
      likes: 3800,
      comments: 520,
      shares: 1100,
      saves: 650,
      engRate: 4.5,
      isBoosted: true,
      paidSpend: 950
    },
    // Posts from 6-9 months ago (180-270 days)
    {
      caption: 'Year in review: our biggest wins',
      platformSlug: 'instagram',
      postType: 'CAROUSEL',
      publishedAt: subDays(now, 195),
      orgReach: 195000,
      paidReach: 0,
      impressions: 285000,
      likes: 14200,
      comments: 850,
      shares: 2100,
      saves: 8900,
      engRate: 7.1,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'First viral video 🎉 Thank you all!',
      platformSlug: 'tiktok',
      postType: 'VIDEO',
      publishedAt: subDays(now, 210),
      orgReach: 2100000,
      paidReach: 0,
      impressions: 3200000,
      likes: 285000,
      comments: 12500,
      shares: 42000,
      saves: 65000,
      engRate: 18.5,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Customer success story: How we helped them 10x',
      platformSlug: 'facebook',
      postType: 'POST',
      publishedAt: subDays(now, 225),
      orgReach: 65000,
      paidReach: 5000,
      impressions: 98000,
      likes: 3200,
      comments: 280,
      shares: 850,
      saves: 650,
      engRate: 3.8,
      isBoosted: true,
      paidSpend: 1200
    },
    // Posts from 9-12 months ago (270-365 days)
    {
      caption: 'Getting started guide for beginners',
      platformSlug: 'youtube',
      postType: 'VIDEO',
      publishedAt: subDays(now, 285),
      orgReach: 85000,
      paidReach: 0,
      impressions: 135000,
      likes: 5200,
      comments: 340,
      shares: 890,
      saves: 10200,
      engRate: 5.1,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Our company just turned 2 years old!',
      platformSlug: 'linkedin',
      postType: 'POST',
      publishedAt: subDays(now, 300),
      orgReach: 22000,
      paidReach: 0,
      impressions: 35000,
      likes: 980,
      comments: 120,
      shares: 320,
      saves: 180,
      engRate: 3.5,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Throwback to our first office setup',
      platformSlug: 'instagram',
      postType: 'REEL',
      publishedAt: subDays(now, 320),
      orgReach: 75000,
      paidReach: 0,
      impressions: 115000,
      likes: 5200,
      comments: 280,
      shares: 650,
      saves: 3200,
      engRate: 4.8,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'POV: Your first day at a startup',
      platformSlug: 'tiktok',
      postType: 'VIDEO',
      publishedAt: subDays(now, 340),
      orgReach: 420000,
      paidReach: 0,
      impressions: 650000,
      likes: 52000,
      comments: 1800,
      shares: 6500,
      saves: 11200,
      engRate: 9.2,
      isBoosted: false,
      paidSpend: 0
    },
    {
      caption: 'Why we started this journey',
      platformSlug: 'youtube',
      postType: 'VIDEO',
      publishedAt: subDays(now, 355),
      orgReach: 45000,
      paidReach: 0,
      impressions: 72000,
      likes: 2800,
      comments: 180,
      shares: 420,
      saves: 5200,
      engRate: 4.2,
      isBoosted: false,
      paidSpend: 0
    }
  ];

  console.log(`Creating ${postsData.length} posts...`);
  
  for (const postData of postsData) {
    const account = accounts.find(a => a.platform.slug === postData.platformSlug);
    if (!account) {
      console.log(`Skipping post for ${postData.platformSlug} - no connected account`);
      continue;
    }
    
    await prisma.post.create({
      data: {
        ...postData,
        workspaceId,
        connectedAccountId: account.id,
        externalId: `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    });
  }
  
  console.log('Posts seeded successfully!');
}

seedPosts()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

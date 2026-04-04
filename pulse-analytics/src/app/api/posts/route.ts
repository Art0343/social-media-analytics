import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, DEFAULT_CONFIG } from '@/lib/rate-limit';
import type { Prisma } from '@prisma/client';
import { postsData } from '@/lib/demo-data';
import { getActiveConnectedPlatformSlugs, postWhereConnected } from '@/lib/connected-analytics';
import { getPlatformColor } from '@/lib/platform-colors';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// GET /api/posts?workspaceId=xxx&days=30&search=&platform=&sortBy=publishedAt&sortOrder=desc
export async function GET(request: NextRequest) {
  try {
    // Skip auth in dev mode
    let session = null;
    if (!isDev) {
      session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `posts:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, DEFAULT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, DEFAULT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30', 10);
    const workspaceId = searchParams.get('workspaceId') || 'ws-demo-pulse';

    // Verify user has access to this workspace (skip in dev mode)
    if (!isDev && session?.user?.id) {
      const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
          workspaceId,
          userId: session.user.id,
        },
      });

      if (!workspaceUser) {
        return NextResponse.json(
          { error: 'Access denied to this workspace' },
          { status: 403 }
        );
      }
    }

    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') || '';
    const postType = searchParams.get('postType') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const endDate = new Date();
    const startDate = subDays(endDate, days);
    const activeSlugs = await getActiveConnectedPlatformSlugs(workspaceId);

    // Build where clause — only posts tied to still-connected accounts
    const where: Prisma.PostWhereInput = {
      ...postWhereConnected(workspaceId, {
        gte: startDate,
        lte: endDate,
      }),
    };

    if (search) {
      where.caption = { contains: search };
    }

    if (platform) {
      where.platformSlug = platform;
    }

    if (postType) {
      where.postType = postType;
    }

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where });
    console.log('POSTS API - DB query, days:', days, 'totalCount:', totalCount, 'startDate:', startDate.toISOString());

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    console.log('POSTS API - DB posts returned:', posts.length);

    // Use demo data if no posts in DB (for dev/testing)
    let finalPosts = posts;
    let finalCount = totalCount;
    
    if (isDev && totalCount === 0) {
      console.log('POSTS API - Using demo data, days:', days);
      console.log('POSTS API - endDate:', endDate.toISOString());
      console.log('POSTS API - startDate:', startDate.toISOString());
      
      const slugSet = new Set(activeSlugs);
      // Filter demo data by date range and connected platforms only
      const filteredDemoPosts = postsData.filter((post) => {
        if (activeSlugs.length === 0 || !slugSet.has(post.platformSlug)) {
          return false;
        }
        const postDate = new Date(post.date);
        // Set both dates to midnight for accurate comparison
        const postDateMidnight = new Date(postDate.getFullYear(), postDate.getMonth(), postDate.getDate());
        const startDateMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateMidnight = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        
        const inRange = postDateMidnight >= startDateMidnight && postDateMidnight <= endDateMidnight;
        if (inRange) {
          console.log('POSTS API - Including post:', post.id, 'date:', post.date, 'postDate:', postDateMidnight.toISOString());
        }
        return inRange;
      });
      
      console.log('POSTS API - Total filtered posts:', filteredDemoPosts.length);
      
      // Apply search filter
      const searchFiltered = search
        ? filteredDemoPosts.filter((p) =>
            p.caption.toLowerCase().includes(search.toLowerCase())
          )
        : filteredDemoPosts;
      
      // Apply platform filter
      const platformFiltered = platform
        ? searchFiltered.filter((p) => p.platformSlug === platform)
        : searchFiltered;
      
      // Apply type filter
      const typeFiltered = postType
        ? platformFiltered.filter((p) => p.type === postType)
        : platformFiltered;
      
      finalCount = typeFiltered.length;
      finalPosts = typeFiltered.slice((page - 1) * limit, page * limit).map((post) => ({
        ...post,
        publishedAt: new Date(post.date),
        postType: post.type,
        paidSpend: post.spend,
        orgReach: post.orgReach,
        engRate: post.engRate,
        isBoosted: post.isBoosted,
      })) as any;
      
      // Calculate and log total reach for debugging
      const totalReach = finalPosts.reduce((sum, p) => sum + (p.orgReach || 0), 0);
      const avgEng = finalPosts.length > 0 ? finalPosts.reduce((sum, p) => sum + (p.engRate || 0), 0) / finalPosts.length : 0;
      console.log('POSTS API - Returning:', finalPosts.length, 'posts, totalReach:', totalReach, 'avgEng:', avgEng.toFixed(2) + '%');
    }

    // Get connected accounts to include account info
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: { workspaceId },
      include: { platform: true },
    });

    // Format posts with platform info
    const formattedPosts = finalPosts.map((post: { id: string; connectedAccountId?: string; platformSlug: string; publishedAt: Date; postType: string; caption: string; orgReach: number; impressions: number; likes: number; comments: number; shares: number; saves: number; engRate: number; isBoosted: boolean; paidSpend: number | null; date?: string; type?: string; platform?: string; platformColor?: string; typeBadgeColor?: string }) => {
      const account = connectedAccounts.find(
        (ca: { id: string; platform?: { name: string } }) => ca.id === post.connectedAccountId
      );

      const typeBadgeColors: Record<string, string> = {
        REEL: 'bg-purple-100 text-purple-700',
        VIDEO: 'bg-red-100 text-red-700',
        CAROUSEL: 'bg-blue-100 text-blue-700',
        POST: 'bg-green-100 text-green-700',
        STORY: 'bg-yellow-100 text-yellow-700',
      };

      return {
        id: post.id,
        platform: account?.platform?.name || post.platform || post.platformSlug,
        platformSlug: post.platformSlug,
        platformColor: getPlatformColor(post.platformSlug),
        date: post.date || post.publishedAt.toISOString().split('T')[0],
        type: post.type || post.postType,
        typeBadgeColor: typeBadgeColors[post.postType] || post.typeBadgeColor || 'bg-gray-100 text-gray-700',
        caption: post.caption.slice(0, 50) + (post.caption.length > 50 ? '...' : ''),
        orgReach: post.orgReach,
        impressions: post.impressions,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        saves: post.saves,
        engRate: post.engRate,
        isBoosted: post.isBoosted,
        spend: post.paidSpend,
      };
    });

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        totalCount: finalCount,
        totalPages: Math.ceil(finalCount / limit),
      },
    }, { headers });
  } catch (error) {
    console.error('Posts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

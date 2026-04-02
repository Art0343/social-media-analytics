import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, DEFAULT_CONFIG } from '@/lib/rate-limit';

// GET /api/posts?workspaceId=xxx&days=30&search=&platform=&sortBy=publishedAt&sortOrder=desc
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const workspaceId = searchParams.get('workspaceId') || 'demo-workspace';

    // Verify user has access to this workspace
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

    const search = searchParams.get('search') || '';
    const platform = searchParams.get('platform') || '';
    const postType = searchParams.get('postType') || '';
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Build where clause
    const where: any = {
      workspaceId,
      publishedAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (search) {
      where.caption = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (platform) {
      where.platformSlug = platform;
    }

    if (postType) {
      where.postType = postType;
    }

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where });

    // Get posts with pagination
    const posts = await prisma.post.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get connected accounts to include account info
    const connectedAccounts = await prisma.connectedAccount.findMany({
      where: { workspaceId },
      include: { platform: true },
    });

    // Format posts with platform info
    const formattedPosts = posts.map((post: { id: string; connectedAccountId: string; platformSlug: string; publishedAt: Date; postType: string; caption: string; orgReach: number; impressions: number; likes: number; comments: number; shares: number; saves: number; engRate: number; isBoosted: boolean; paidSpend: number | null }) => {
      const account = connectedAccounts.find(
        (ca: { id: string; platform?: { name: string } }) => ca.id === post.connectedAccountId
      );

      const platformColors: Record<string, string> = {
        instagram: '#E1306C',
        tiktok: '#000000',
        youtube: '#FF0000',
        facebook: '#1877F2',
        linkedin: '#0A66C2',
        twitter: '#000000',
      };

      const typeBadgeColors: Record<string, string> = {
        REEL: 'bg-purple-100 text-purple-700',
        VIDEO: 'bg-red-100 text-red-700',
        CAROUSEL: 'bg-blue-100 text-blue-700',
        POST: 'bg-green-100 text-green-700',
        STORY: 'bg-yellow-100 text-yellow-700',
      };

      return {
        id: post.id,
        platform: account?.platform?.name || post.platformSlug,
        platformSlug: post.platformSlug,
        platformColor: platformColors[post.platformSlug] || '#666',
        date: post.publishedAt.toISOString().split('T')[0],
        type: post.postType,
        typeBadgeColor: typeBadgeColors[post.postType] || 'bg-gray-100 text-gray-700',
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
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
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

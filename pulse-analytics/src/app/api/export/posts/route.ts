import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays, format as formatDate } from 'date-fns';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, STRICT_CONFIG } from '@/lib/rate-limit';

// Check if we're in development mode
const isDev = process.env.NODE_ENV === 'development';

// GET /api/export/posts?workspaceId=xxx&format=csv&days=30
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

    // Rate limiting (strict for exports)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `export:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, STRICT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, STRICT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'ws-demo-pulse';
    const format = searchParams.get('format') || 'csv';
    const days = parseInt(searchParams.get('days') || '30', 10);

    const endDate = new Date();
    const startDate = subDays(endDate, days);

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

    // Fetch posts for export
    const posts = await prisma.post.findMany({
      where: {
        workspaceId,
        publishedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { publishedAt: 'desc' },
      include: {
        connectedAccount: {
          include: {
            platform: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Post ID',
        'Platform',
        'Post Type',
        'Caption',
        'Published At',
        'Organic Reach',
        'Impressions',
        'Likes',
        'Comments',
        'Shares',
        'Saves',
        'Engagement Rate (%)',
        'Is Boosted',
        'Paid Spend',
        'Paid Reach',
      ].join(',');

      const csvRows = posts.map((post: {
        id: string;
        platformSlug: string;
        postType: string;
        caption: string;
        publishedAt: Date;
        orgReach: number;
        impressions: number;
        likes: number;
        comments: number;
        shares: number;
        saves: number;
        engRate: number;
        isBoosted: boolean;
        paidSpend: number | null;
        paidReach: number | null;
        connectedAccount: {
          platform: {
            name: string;
            slug: string;
          };
        };
      }) => {
        const platform = post.connectedAccount?.platform?.name || post.platformSlug;
        return [
          post.id,
          `"${platform}"`,
          post.postType,
          `"${post.caption.replace(/"/g, '""').slice(0, 100)}"`,
          formatDate(post.publishedAt, 'yyyy-MM-dd HH:mm:ss'),
          post.orgReach,
          post.impressions,
          post.likes,
          post.comments,
          post.shares,
          post.saves,
          post.engRate.toFixed(2),
          post.isBoosted ? 'Yes' : 'No',
          post.paidSpend || 0,
          post.paidReach || 0,
        ].join(',');
      });

      const csv = [csvHeaders, ...csvRows].join('\n');

      return new NextResponse(csv, {
        status: 200,
        headers: {
          ...headers,
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="posts-export-${formatDate(new Date(), 'yyyy-MM-dd')}.csv"`,
        },
      });
    }

    // JSON format (default)
    const jsonData = posts.map((post: {
      id: string;
      platformSlug: string;
      postType: string;
      caption: string;
      publishedAt: Date;
      orgReach: number;
      impressions: number;
      likes: number;
      comments: number;
      shares: number;
      saves: number;
      engRate: number;
      isBoosted: boolean;
      paidSpend: number | null;
      paidReach: number | null;
      connectedAccount: {
        platform: {
          name: string;
          slug: string;
        };
      };
    }) => ({
      id: post.id,
      platform: post.connectedAccount?.platform?.name || post.platformSlug,
      postType: post.postType,
      caption: post.caption,
      publishedAt: formatDate(post.publishedAt, 'yyyy-MM-dd HH:mm:ss'),
      metrics: {
        orgReach: post.orgReach,
        impressions: post.impressions,
        likes: post.likes,
        comments: post.comments,
        shares: post.shares,
        saves: post.saves,
        engRate: post.engRate.toFixed(2),
      },
      paid: {
        isBoosted: post.isBoosted,
        spend: post.paidSpend || 0,
        reach: post.paidReach || 0,
      },
    }));

    return NextResponse.json(
      {
        export: {
          format,
          generatedAt: new Date().toISOString(),
          period: {
            from: formatDate(startDate, 'yyyy-MM-dd'),
            to: formatDate(endDate, 'yyyy-MM-dd'),
          },
          totalPosts: posts.length,
          posts: jsonData,
        },
      },
      { headers }
    );
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to generate export' },
      { status: 500 }
    );
  }
}

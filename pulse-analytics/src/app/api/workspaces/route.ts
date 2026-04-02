import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, DEFAULT_CONFIG, STRICT_CONFIG } from '@/lib/rate-limit';

// GET /api/workspaces - List all workspaces for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `workspaces-get:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, DEFAULT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, DEFAULT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const workspaceUsers = await prisma.workspaceUser.findMany({
      where: { userId: session.user.id },
      include: {
        workspace: {
          include: {
            _count: {
              select: {
                users: true,
                connectedAccounts: true,
                posts: true,
              },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });

    const workspaces = workspaceUsers.map((wu: {
      role: string;
      workspace: {
        id: string;
        name: string;
        logoUrl: string | null;
        allowedDomain: string | null;
        createdAt: Date;
        updatedAt: Date;
        _count: {
          users: number;
          connectedAccounts: number;
          posts: number;
        };
      };
    }) => ({
      id: wu.workspace.id,
      name: wu.workspace.name,
      logoUrl: wu.workspace.logoUrl,
      allowedDomain: wu.workspace.allowedDomain,
      role: wu.role,
      createdAt: wu.workspace.createdAt,
      updatedAt: wu.workspace.updatedAt,
      stats: {
        memberCount: wu.workspace._count.users,
        connectedAccounts: wu.workspace._count.connectedAccounts,
        totalPosts: wu.workspace._count.posts,
      },
    }));

    return NextResponse.json({ workspaces }, { headers });
  } catch (error) {
    console.error('Workspaces fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

// POST /api/workspaces - Create a new workspace
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting (strict for write operations)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `workspaces-post:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, STRICT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, STRICT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const body = await request.json();
    const { name, logoUrl, allowedDomain } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Workspace name is required' },
        { status: 400, headers }
      );
    }

    if (!session.user.id) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 400, headers }
      );
    }

    // Create workspace and add creator as ADMIN
    const workspace = await prisma.workspace.create({
      data: {
        name: name.trim(),
        logoUrl: logoUrl || null,
        allowedDomain: allowedDomain || null,
        users: {
          create: {
            userId: session.user.id,
            role: 'ADMIN',
          },
        },
      },
    });

    return NextResponse.json(
      {
        workspace: {
          id: workspace.id,
          name: workspace.name,
          logoUrl: workspace.logoUrl,
          allowedDomain: workspace.allowedDomain,
          role: 'ADMIN',
          createdAt: workspace.createdAt,
          updatedAt: workspace.updatedAt,
        },
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Workspace creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}

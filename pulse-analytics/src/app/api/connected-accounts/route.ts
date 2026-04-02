import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, DEFAULT_CONFIG, STRICT_CONFIG } from '@/lib/rate-limit';

// GET /api/connected-accounts - List all connected accounts for the workspace
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `connected-accounts-get:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, DEFAULT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, DEFAULT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'demo-workspace';

    const accounts = await prisma.connectedAccount.findMany({
      where: { workspaceId },
      include: {
        platform: {
          select: {
            name: true,
            slug: true,
            brandColor: true,
            iconUrl: true,
          },
        },
      },
      orderBy: { lastSynced: 'desc' },
    });

    // Mask tokens for security
    const sanitizedAccounts = accounts.map((account: { 
      id: string; 
      platform: { name: string; slug: string; brandColor: string; iconUrl: string }; 
      accountName: string; 
      accountHandle: string | null; 
      status: string; 
      lastSynced: Date | null;
      expiresAt: Date | null;
    }) => ({
      id: account.id,
      platform: account.platform,
      accountName: account.accountName,
      accountHandle: account.accountHandle,
      status: account.status,
      lastSynced: account.lastSynced,
      expiresSoon: account.expiresAt ? new Date(account.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : false,
    }));

    return NextResponse.json({ accounts: sanitizedAccounts }, { headers });
  } catch (error) {
    console.error('Connected accounts fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch connected accounts' },
      { status: 500 }
    );
  }
}

// POST /api/connected-accounts - Add a new connected account
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Rate limiting (strict for write operations)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `connected-accounts-post:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, STRICT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, STRICT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    const {
      workspaceId = 'demo-workspace',
      platformSlug,
      accountName,
      accountHandle,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      externalId,
      followerCount = 0,
    } = body;

    if (!platformSlug || !accessToken) {
      return NextResponse.json(
        { error: 'Platform slug and access token are required' },
        { status: 400 }
      );
    }

    // Find the platform
    const platform = await prisma.socialPlatform.findUnique({
      where: { slug: platformSlug },
    });

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      );
    }

    // Encrypt tokens before storing
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

    // Create connected account
    const connectedAccount = await prisma.connectedAccount.create({
      data: {
        workspaceId,
        platformId: platform.id,
        accountName: accountName || null,
        accountHandle: accountHandle || null,
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresAt: tokenExpiresAt ? new Date(tokenExpiresAt) : null,
        status: 'CONNECTED',
      },
      include: {
        platform: {
          select: {
            name: true,
            slug: true,
            brandColor: true,
          },
        },
      },
    });

    return NextResponse.json({ account: connectedAccount }, { status: 201, headers });
  } catch (error) {
    console.error('Connected account creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create connected account' },
      { status: 500 }
    );
  }
}

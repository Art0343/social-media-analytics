import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

// GET /api/platforms — List all platforms
export async function GET() {
  try {
    const platforms = await prisma.socialPlatform.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        brandColor: true,
        isActive: true,
        isBuiltIn: true,
        authUrl: true,
        tokenUrl: true,
        scopes: true,
        redirectUri: true,
        apiBaseUrl: true,
        fieldMappings: true,
        webhookEndpoint: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { connectedAccounts: true },
        },
      },
    });

    return NextResponse.json(platforms);
  } catch (error) {
    console.error('Failed to fetch platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}

// POST /api/platforms — Create a new platform
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      slug,
      iconUrl,
      brandColor,
      clientId,
      clientSecret,
      authUrl,
      tokenUrl,
      scopes,
      redirectUri,
      apiBaseUrl,
      fieldMappings,
      webhookEndpoint,
      isActive,
    } = body;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check for duplicate slug
    const existing = await prisma.socialPlatform.findUnique({
      where: { slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Platform with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    // Encrypt sensitive OAuth fields
    const encryptedClientId = clientId ? encrypt(clientId) : '';
    const encryptedClientSecret = clientSecret ? encrypt(clientSecret) : '';

    const platform = await prisma.socialPlatform.create({
      data: {
        name,
        slug,
        iconUrl: iconUrl || '',
        brandColor: brandColor || '#000000',
        isActive: isActive ?? true,
        isBuiltIn: false,
        clientId: encryptedClientId,
        clientSecret: encryptedClientSecret,
        authUrl: authUrl || '',
        tokenUrl: tokenUrl || '',
        scopes: scopes || '',
        redirectUri: redirectUri || '',
        apiBaseUrl: apiBaseUrl || '',
        fieldMappings: fieldMappings || '{}',
        webhookEndpoint: webhookEndpoint || null,
      },
    });

    return NextResponse.json(platform, { status: 201 });
  } catch (error) {
    console.error('Failed to create platform:', error);
    return NextResponse.json(
      { error: 'Failed to create platform' },
      { status: 500 }
    );
  }
}

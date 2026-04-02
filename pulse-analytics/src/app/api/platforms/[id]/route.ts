import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { encrypt } from '@/lib/encryption';

// GET /api/platforms/[id] — Get a single platform
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const platform = await prisma.socialPlatform.findUnique({
      where: { id },
      include: {
        _count: { select: { connectedAccounts: true } },
      },
    });

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(platform);
  } catch (error) {
    console.error('Failed to fetch platform:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform' },
      { status: 500 }
    );
  }
}

// PATCH /api/platforms/[id] — Update a platform
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    // Only update provided fields
    const directFields = [
      'name', 'slug', 'iconUrl', 'brandColor', 'isActive',
      'authUrl', 'tokenUrl', 'scopes', 'redirectUri',
      'apiBaseUrl', 'fieldMappings', 'webhookEndpoint',
    ];

    for (const field of directFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Encrypt sensitive fields if provided
    if (body.clientId !== undefined) {
      updateData.clientId = body.clientId ? encrypt(body.clientId) : '';
    }
    if (body.clientSecret !== undefined) {
      updateData.clientSecret = body.clientSecret ? encrypt(body.clientSecret) : '';
    }

    const platform = await prisma.socialPlatform.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(platform);
  } catch (error) {
    console.error('Failed to update platform:', error);
    return NextResponse.json(
      { error: 'Failed to update platform' },
      { status: 500 }
    );
  }
}

// DELETE /api/platforms/[id] — Delete a platform (non-built-in only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const platform = await prisma.socialPlatform.findUnique({
      where: { id },
    });

    if (!platform) {
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      );
    }

    if (platform.isBuiltIn) {
      return NextResponse.json(
        { error: 'Cannot delete a built-in platform. Deactivate it instead.' },
        { status: 403 }
      );
    }

    await prisma.socialPlatform.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete platform:', error);
    return NextResponse.json(
      { error: 'Failed to delete platform' },
      { status: 500 }
    );
  }
}

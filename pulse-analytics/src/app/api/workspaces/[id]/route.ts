import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { rateLimit, getRateLimitHeaders, STRICT_CONFIG } from '@/lib/rate-limit';

// PATCH /api/workspaces/[id] - Update workspace details
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `workspaces-patch:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, STRICT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, STRICT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    // Check if user is an ADMIN of this workspace
    const membership = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: id,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Only workspace admins can update settings' },
        { status: 403, headers }
      );
    }

    const body = await request.json();
    const { name, logoUrl, allowedDomain } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl || null;
    if (allowedDomain !== undefined) updateData.allowedDomain = allowedDomain || null;

    const workspace = await prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ workspace }, { headers });
  } catch (error) {
    console.error('Workspace update error:', error);
    return NextResponse.json(
      { error: 'Failed to update workspace' },
      { status: 500 }
    );
  }
}

// DELETE /api/workspaces/[id] - Delete workspace (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
    const identifier = `workspaces-delete:${ip}`;
    const { allowed, remaining, resetTime } = rateLimit(identifier, STRICT_CONFIG);

    const headers = getRateLimitHeaders(allowed, remaining, resetTime, STRICT_CONFIG.maxRequests);

    if (!allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    // Check if user is an ADMIN of this workspace
    const membership = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: id,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Only workspace admins can delete workspaces' },
        { status: 403, headers }
      );
    }

    // Delete workspace (cascade will handle related records)
    await prisma.workspace.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { headers });
  } catch (error) {
    console.error('Workspace deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete workspace' },
      { status: 500 }
    );
  }
}

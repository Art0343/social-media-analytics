import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// DELETE /api/connected-accounts/[id] - Disconnect an account
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
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'demo-workspace';

    // Verify the account belongs to the workspace
    const account = await prisma.connectedAccount.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Soft delete by marking as disconnected and clearing tokens
    await prisma.connectedAccount.update({
      where: { id },
      data: {
        status: 'DISCONNECTED',
        accessToken: '',
        refreshToken: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Account disconnect error:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    );
  }
}

// PATCH /api/connected-accounts/[id] - Update account or sync status
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
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId') || 'demo-workspace';

    const body = await request.json();
    const { accountName, accountHandle, status, lastSynced } = body;

    // Verify the account belongs to the workspace
    const account = await prisma.connectedAccount.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    // Update fields
    const updateData: Record<string, unknown> = {};
    if (accountName !== undefined) updateData.accountName = accountName;
    if (accountHandle !== undefined) updateData.accountHandle = accountHandle;
    if (status !== undefined) updateData.status = status;
    if (lastSynced !== undefined) updateData.lastSynced = new Date(lastSynced);

    const updatedAccount = await prisma.connectedAccount.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ account: updatedAccount });
  } catch (error) {
    console.error('Account update error:', error);
    return NextResponse.json(
      { error: 'Failed to update account' },
      { status: 500 }
    );
  }
}

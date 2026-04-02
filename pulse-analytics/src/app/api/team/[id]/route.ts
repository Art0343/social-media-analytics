import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// PATCH /api/team/[id] - Update team member role
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

    // Check if user is an ADMIN
    const adminCheck = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!adminCheck) {
      return NextResponse.json(
        { error: 'Only admins can update team members' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { role } = body;

    // Validate role
    const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN, MEMBER, or VIEWER' },
        { status: 400 }
      );
    }

    // Verify the membership exists
    const membership = await prisma.workspaceUser.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Prevent removing the last admin
    if (membership.role === 'ADMIN' && role !== 'ADMIN') {
      const adminCount = await prisma.workspaceUser.count({
        where: {
          workspaceId,
          role: 'ADMIN',
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin' },
          { status: 400 }
        );
      }
    }

    const updatedMembership = await prisma.workspaceUser.update({
      where: { id },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      member: {
        id: updatedMembership.id,
        userId: updatedMembership.user.id,
        email: updatedMembership.user.email,
        name: updatedMembership.user.name,
        image: updatedMembership.user.image,
        role: updatedMembership.role,
      },
    });
  } catch (error) {
    console.error('Team member update error:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/[id] - Remove team member
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

    // Check if user is an ADMIN (or the user themselves)
    const adminCheck = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    const selfCheck = await prisma.workspaceUser.findFirst({
      where: {
        id,
        workspaceId,
        userId: session.user.id,
      },
    });

    // Allow self-removal or admin removal
    if (!adminCheck && !selfCheck) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Verify the membership exists
    const membership = await prisma.workspaceUser.findFirst({
      where: {
        id,
        workspaceId,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    // Prevent removing the last admin
    if (membership.role === 'ADMIN') {
      const adminCount = await prisma.workspaceUser.count({
        where: {
          workspaceId,
          role: 'ADMIN',
        },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot remove the last admin' },
          { status: 400 }
        );
      }
    }

    await prisma.workspaceUser.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Team member removal error:', error);
    return NextResponse.json(
      { error: 'Failed to remove team member' },
      { status: 500 }
    );
  }
}

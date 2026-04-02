import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/team - List all team members for the workspace
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
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

    const members = await prisma.workspaceUser.findMany({
      where: { workspaceId },
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
      orderBy: { id: 'desc' },
    });

    const formattedMembers = members.map((member: {
      id: string;
      role: string;
      user: {
        id: string;
        email: string;
        name: string | null;
        image: string | null;
      };
    }) => ({
      id: member.id,
      userId: member.user.id,
      email: member.user.email,
      name: member.user.name,
      image: member.user.image,
      role: member.role,
    }));

    return NextResponse.json({ members: formattedMembers });
  } catch (error) {
    console.error('Team members fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/team - Invite a new team member
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { workspaceId = 'demo-workspace', email, role = 'MEMBER' } = body;

    // Check if inviter is an ADMIN
    const inviter = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: session.user.id,
        role: 'ADMIN',
      },
    });

    if (!inviter) {
      return NextResponse.json(
        { error: 'Only admins can invite team members' },
        { status: 403 }
      );
    }

    // Validate role
    const validRoles = ['ADMIN', 'MEMBER', 'VIEWER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be ADMIN, MEMBER, or VIEWER' },
        { status: 400 }
      );
    }

    // Find or create user by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create placeholder user (they'll need to sign up)
      user = await prisma.user.create({
        data: {
          email,
          name: email.split('@')[0],
        },
      });
    }

    // Check if already a member
    const existingMember = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'User is already a team member' },
        { status: 409 }
      );
    }

    // Create workspace user
    const workspaceUser = await prisma.workspaceUser.create({
      data: {
        workspaceId,
        userId: user.id,
        role,
      },
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

    return NextResponse.json(
      {
        member: {
          id: workspaceUser.id,
          userId: workspaceUser.user.id,
          email: workspaceUser.user.email,
          name: workspaceUser.user.name,
          image: workspaceUser.user.image,
          role: workspaceUser.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Team member invite error:', error);
    return NextResponse.json(
      { error: 'Failed to invite team member' },
      { status: 500 }
    );
  }
}

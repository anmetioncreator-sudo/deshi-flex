import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = verifyAdminSession(request);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin clearance required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, role, name } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const validRoles = ['customer', 'admin', 'owner'];
    const targetRole = (role || 'admin').toLowerCase().trim();

    if (!validRoles.includes(targetRole)) {
      return NextResponse.json(
        { success: false, error: `Invalid role specified. Valid roles are: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Protection: do not allow non-owners to assign or revoke 'owner' role
    if (targetRole === 'owner' && session.role !== 'owner') {
      return NextResponse.json(
        { success: false, error: 'Only master owners can assign the owner role.' },
        { status: 403 }
      );
    }

    // Protection: primary owner email cannot be demoted to customer
    const ownerEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'deshiflex12@gmail.com').toLowerCase().trim();
    if (cleanEmail === ownerEmail && targetRole === 'customer') {
      return NextResponse.json(
        { success: false, error: 'The primary system owner account cannot be demoted to a customer.' },
        { status: 403 }
      );
    }

    // Upsert user: if user exists, update their role; if not, create a pre-approved record
    const displayName = name ? name.trim() : cleanEmail.split('@')[0];
    const updatedUser = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        role: targetRole,
      },
      create: {
        email: cleanEmail,
        name: displayName,
        role: targetRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Account ${cleanEmail} has been granted '${targetRole}' privileges.`,
      user: updatedUser,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update account role.' },
      { status: 500 }
    );
  }
}

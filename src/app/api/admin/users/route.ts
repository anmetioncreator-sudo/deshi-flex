import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = verifyAdminSession(request);
    if (!session.valid) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin clearance required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const roleFilter = searchParams.get('role')?.toLowerCase().trim() || '';

    // Fetch all registered users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    // Apply filters in-memory for flexible multi-field matching
    const filteredUsers = users.filter((u) => {
      const matchesSearch =
        !search ||
        u.email.toLowerCase().includes(search) ||
        u.name.toLowerCase().includes(search) ||
        (u.phone && u.phone.includes(search));

      const matchesRole = !roleFilter || u.role.toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });

    return NextResponse.json({
      success: true,
      users: filteredUsers,
      totalCount: users.length,
      adminCount: users.filter((u) => u.role === 'admin' || u.role === 'owner').length,
      customerCount: users.filter((u) => u.role === 'customer').length,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching registered users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch registered users.' },
      { status: 500 }
    );
  }
}

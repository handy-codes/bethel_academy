export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const mapped = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name || '',
      role: (u as any).role || 'student',
      createdAt: u.createdAt.toISOString(),
      isActive: true,
    }));

    return NextResponse.json({ users: mapped });
  } catch (error) {
    console.error('GET /api/admin/users error', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}








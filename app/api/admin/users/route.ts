export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function isDbConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as Record<string, unknown>;
  const code = e?.code;
  const msg = typeof e?.message === 'string' ? e.message : '';
  return (
    code === 'P1001' ||
    code === 'P1002' ||
    msg.includes('connect') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('connection')
  );
}

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not set in this environment. Add it in your hosting dashboard (e.g. Vercel → Settings → Environment Variables).', users: [] },
        { status: 503 }
      );
    }
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
  } catch (error: unknown) {
    const err = error as Record<string, unknown> | undefined;
    const message = typeof err?.message === 'string' ? err.message : 'Failed to load users';
    console.error('GET /api/admin/users error', error);

    const userMessage = isDbConnectionError(error)
      ? 'Database unreachable. Check DATABASE_URL and that the database is running.'
      : message || 'Failed to load users';

    const status = isDbConnectionError(error) ? 503 : 500;
    return NextResponse.json(
      { error: userMessage, users: [] },
      { status }
    );
  }
}








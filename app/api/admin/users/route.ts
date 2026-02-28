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

function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://');
}

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not set. In Vercel: Project → Settings → Environment Variables → add DATABASE_URL with your Neon URL.', users: [] },
        { status: 503 }
      );
    }
    if (!isValidDatabaseUrl(dbUrl)) {
      return NextResponse.json(
        { error: 'DATABASE_URL must start with postgresql:// or postgres://. Check Vercel env vars and remove any extra quotes or spaces.', users: [] },
        { status: 503 }
      );
    }
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const mapped = users.map(u => {
      const rawRole = (u as any).role || 'student';
      const role = rawRole === 'user' ? 'student' : rawRole;
      return {
        id: u.id,
        email: u.email,
        name: u.name || '',
        role,
        createdAt: u.createdAt.toISOString(),
        isActive: true,
      };
    });

    // One row per email: prefer 'parent' if same email appears twice (legacy data)
    const byEmail = new Map<string, (typeof mapped)[0]>();
    for (const u of mapped) {
      const existing = byEmail.get(u.email);
      if (!existing || u.role === 'parent') byEmail.set(u.email, u);
    }
    const deduped = Array.from(byEmail.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ users: deduped });
  } catch (error: unknown) {
    const err = error as Record<string, unknown> | undefined;
    const message = typeof err?.message === 'string' ? err.message : '';
    console.error('GET /api/admin/users error', error);

    const isInvalidUrl = message.includes('must start with the protocol') || message.includes('postgresql://') || message.includes('postgres://');
    const userMessage = isInvalidUrl
      ? 'DATABASE_URL is invalid. It must start with postgresql:// (e.g. your Neon connection string). Check Vercel → Settings → Environment Variables.'
      : isDbConnectionError(error)
        ? 'Database unreachable. Check DATABASE_URL and that the database is running.'
        : message || 'Failed to load users';

    const status = isInvalidUrl || isDbConnectionError(error) ? 503 : 500;
    return NextResponse.json(
      { error: userMessage, users: [] },
      { status }
    );
  }
}








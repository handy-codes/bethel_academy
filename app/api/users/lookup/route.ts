import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');
    if (!idsParam) return NextResponse.json({ users: [] });
    const ids = idsParam.split(',').map(s => s.trim()).filter(Boolean);
    const users = await Promise.all(ids.map(async (id) => {
      try {
        const u = await clerkClient.users.getUser(id);
        return {
          id,
          name: u.fullName || '',
          email: u.emailAddresses?.[0]?.emailAddress || '',
          role: (u.publicMetadata?.role as string) || ''
        };
      } catch {
        return { id, name: '', email: '', role: '' };
      }
    }));
    return NextResponse.json({ users });
  } catch (err) {
    console.error('GET /api/users/lookup error', err);
    return NextResponse.json({ error: 'Failed to lookup users' }, { status: 500 });
  }
}



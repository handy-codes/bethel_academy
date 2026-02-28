export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const limit = 500;
    let offset = 0;
    let totalSynced = 0;
    let totalCount: number | null = null;
    const skipped: string[] = [];

    while (true) {
      const response = await clerkClient.users.getUserList({
        limit,
        offset,
        orderBy: '-created_at',
      });

      const clerkUsers = response?.data ?? [];
      if (typeof response?.totalCount === 'number') totalCount = response.totalCount;

      if (!clerkUsers.length) break;

      for (const cu of clerkUsers) {
        const primaryId = (cu as any).primaryEmailAddressId;
        const emails = cu.emailAddresses ?? [];
        const email = primaryId
          ? emails.find((e: { id: string }) => e.id === primaryId)?.emailAddress
          : emails[0]?.emailAddress;
        if (!email) {
          skipped.push((cu as any).id ?? 'unknown');
          continue;
        }

        const role = (cu.publicMetadata as any)?.role
          || (cu.privateMetadata as any)?.role
          || 'student';
        const name = [cu.firstName, cu.lastName].filter(Boolean).join(' ') || email;

        const validRole = ['admin', 'student', 'lecturer', 'parent'].includes(role)
          ? role.toLowerCase()
          : 'student';

        await prisma.user.upsert({
          where: { email },
          update: {
            name: name || undefined,
            role: validRole,
          },
          create: {
            email,
            name: name || undefined,
            role: validRole,
          },
        });
        totalSynced += 1;
      }

      offset += clerkUsers.length;
      if (clerkUsers.length < limit) break;
      if (totalCount != null && offset >= totalCount) break;
    }

    const msg = totalSynced > 0
      ? `Synced ${totalSynced} user(s) from Clerk into the database.`
      : 'No users found in Clerk to sync, or they were already in the database.';
    const body: { success: boolean; message: string; synced: number; skipped?: number } = {
      success: true,
      message: skipped.length > 0 ? `${msg} (${skipped.length} skipped: no email)` : msg,
      synced: totalSynced,
    };
    if (skipped.length > 0) body.skipped = skipped.length;

    return NextResponse.json(body);
  } catch (error: any) {
    console.error('Sync from Clerk error', error);
    const message =
      error?.code === 'P1001' || error?.message?.includes('connect')
        ? 'Database unreachable. Check DATABASE_URL and that your database is running.'
        : error?.message || 'Failed to sync users from Clerk.';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

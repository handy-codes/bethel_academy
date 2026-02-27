export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST() {
  try {
    const limit = 100;
    let offset = 0;
    let totalSynced = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: clerkUsers } = await clerkClient.users.getUserList({
        limit,
        offset,
        orderBy: '-created_at',
      });

      if (!clerkUsers?.length) {
        hasMore = false;
        break;
      }

      for (const cu of clerkUsers) {
        const email = cu.emailAddresses?.[0]?.emailAddress;
        if (!email) continue;

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
      hasMore = clerkUsers.length === limit;
    }

    return NextResponse.json({
      success: true,
      message: totalSynced > 0
        ? `Synced ${totalSynced} user(s) from Clerk into the database.`
        : 'No users found in Clerk to sync, or they were already in the database.',
      synced: totalSynced,
    });
  } catch (error: any) {
    console.error('Sync from Clerk error', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sync users from Clerk.' },
      { status: 500 }
    );
  }
}

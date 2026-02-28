import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await clerkClient.users.getUser(userId);
    const primaryId = (user as any).primaryEmailAddressId;
    const emails = user.emailAddresses ?? [];
    const email = primaryId
      ? emails.find((e: { id: string }) => e.id === primaryId)?.emailAddress
      : emails[0]?.emailAddress;

    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    const currentRole = (user.publicMetadata as any)?.role as string | undefined;

    // If user is in Parent table, they must have role 'parent' in Clerk
    try {
      const parentRecord = await prisma.parent.findUnique({
        where: { email },
      });
      if (parentRecord) {
        if (currentRole !== 'parent') {
          await clerkClient.users.updateUser(userId, {
            publicMetadata: { ...(user.publicMetadata as object || {}), role: 'parent' },
            privateMetadata: { ...(user.privateMetadata as object || {}), role: 'parent' },
          });
          return NextResponse.json({
            success: true,
            email,
            role: 'parent',
            updated: true,
            message: `Role set to parent for ${email}`,
          });
        }
        return NextResponse.json({
          success: true,
          email,
          role: 'parent',
          updated: false,
          message: `Already parent for ${email}`,
        });
      }
    } catch (dbErr) {
      console.error('Fix-role Parent table check failed:', dbErr);
    }

    // No parent record: determine role by email or default to student
    let role = 'student';
    if (email.includes('admin') || email === 'paxymek@gmail.com' || email === 'paxyme@gmail.com' || email === 'walsam4christ@gmail.com') {
      role = 'admin';
    } else if (email.includes('lecturer') || email.includes('teacher')) {
      role = 'lecturer';
    }

    if (currentRole !== role) {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { ...(user.publicMetadata as object || {}), role },
        privateMetadata: { ...(user.privateMetadata as object || {}), role },
      });
      return NextResponse.json({
        success: true,
        email,
        role,
        updated: true,
        message: `Role set to ${role} for ${email}`,
      });
    }

    return NextResponse.json({
      success: true,
      email,
      role,
      updated: false,
      message: `Role already ${role} for ${email}`,
    });
  } catch (error: any) {
    console.error('Error fixing role:', error);
    return NextResponse.json(
      { error: 'Failed to fix role' },
      { status: 500 }
    );
  }
}


import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId, email, role } = await request.json();

    if (!userId || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['admin', 'student', 'lecturer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    console.log(`Updating role for user ${email} to ${role}`);

    // Update user role in Clerk
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
      privateMetadata: { role }
    });

    console.log('✅ Updated Clerk metadata');

    // Update user in database
    await prisma.user.upsert({
      where: { email },
      update: {
        role: role.toLowerCase(),
      },
      create: {
        email,
        name: 'User',
        role: role.toLowerCase(),
      }
    });

    console.log('✅ Updated database');

    return NextResponse.json({
      success: true,
      message: `Role updated to ${role} successfully`
    });

  } catch (error: any) {
    console.error('Error updating role:', error);
    return NextResponse.json(
      { error: 'Failed to update role' },
      { status: 500 }
    );
  }
}

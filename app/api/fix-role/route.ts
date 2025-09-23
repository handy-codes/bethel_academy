import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { auth } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get the current user
    const user = await clerkClient.users.getUser(userId);
    const email = user.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return NextResponse.json({ error: 'No email found' }, { status: 400 });
    }

    // Determine role based on email or default to student
    let role = 'student';
    if (email.includes('admin') || email === 'paxymek@gmail.com' || email === 'walsam4christ@gmail.com') {
      role = 'admin';
    } else if (email.includes('lecturer') || email.includes('teacher')) {
      role = 'lecturer';
    }

    // Update user metadata
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role },
      privateMetadata: { role }
    });

    return NextResponse.json({
      success: true,
      email,
      role,
      message: `Role set to ${role} for ${email}`
    });

  } catch (error: any) {
    console.error('Error fixing role:', error);
    return NextResponse.json(
      { error: 'Failed to fix role' },
      { status: 500 }
    );
  }
}


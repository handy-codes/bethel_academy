import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, lastName, role } = await request.json();

    // Validate required fields
    if (!email || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'student', 'lecturer'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, student, or lecturer' },
        { status: 400 }
      );
    }

    // Create user in Clerk
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      username: email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_'),
      password: 'TempSecurePass2024!@#', // Temporary password
      publicMetadata: { role },
      privateMetadata: { role }
    });

    // Create user in database
    const dbUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email: email,
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        role: role.toUpperCase(),
        isActive: true,
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        clerkId: clerkUser.id,
        email: dbUser.email,
        name: `${dbUser.firstName} ${dbUser.lastName}`,
        role: dbUser.role.toLowerCase(),
        isActive: dbUser.isActive,
        createdAt: dbUser.createdAt.toISOString().split('T')[0],
      },
      message: `User created successfully. They can sign in with Google OAuth or use the temporary password: TempSecurePass2024!@#`
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.status === 422) {
      return NextResponse.json(
        { error: 'User with this email already exists or invalid data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}

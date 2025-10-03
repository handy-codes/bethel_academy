export const dynamic = 'force-dynamic';
export const revalidate = 0;
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
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

    // Check if user already exists in database - if so, we'll update instead of create
    const existingDbUser = await prisma.user.findUnique({
      where: { email }
    });

    console.log('Existing DB user check:', existingDbUser ? 'Found' : 'Not found');

    // Check if user already exists in Clerk and handle appropriately
    let clerkUser;
    try {
      const existingClerkUsers = await clerkClient.users.getUserList({
        emailAddress: [email]
      });
      
      if (existingClerkUsers.data.length > 0) {
        // User exists in Clerk, update their role instead of creating new
        clerkUser = existingClerkUsers.data[0];
        console.log('User exists in Clerk, updating role...');
        
        // Update user metadata with new role
        clerkUser = await clerkClient.users.updateUser(clerkUser.id, {
          publicMetadata: { role },
          privateMetadata: { role }
        });
        
        console.log('Updated existing Clerk user role to:', role);
      }
    } catch (clerkError) {
      console.log('Error checking Clerk users:', clerkError);
    }

    // Create user in Clerk only if they don't exist
    if (!clerkUser) {
      try {
        clerkUser = await clerkClient.users.createUser({
          emailAddress: [email],
          firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
          lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
          username: email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_'),
          password: 'TempSecurePass2024!@#', // Temporary password
          publicMetadata: { role },
          privateMetadata: { role }
        });
        console.log('Created new Clerk user');
      } catch (clerkError: any) {
        console.error('Clerk user creation error:', clerkError);

        // If the identifier already exists in Clerk, treat as an update path (success)
        if (clerkError.status === 422 || clerkError.errors?.[0]?.code === 'form_identifier_exists') {
          try {
            const existingClerkUsers = await clerkClient.users.getUserList({ emailAddress: [email] });
            if (existingClerkUsers.data.length > 0) {
              clerkUser = existingClerkUsers.data[0];
              await clerkClient.users.updateUser(clerkUser.id, {
                publicMetadata: { role },
                privateMetadata: { role }
              });
              console.log('Existing Clerk user found; role updated.');
            }
          } catch (e) {
            console.warn('Fallback fetch of existing Clerk user failed', e);
          }
        } else {
          return NextResponse.json(
            { error: 'Failed to create user account. Please try again.' },
            { status: 500 }
          );
        }
      }
    }

    // Create or update user in database
    const dbUser = await prisma.user.upsert({
      where: { email },
      update: {
        name: `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`,
        role: role.toLowerCase(),
      },
      create: {
        email: email,
        name: `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${lastName.charAt(0).toUpperCase() + lastName.slice(1)}`,
        role: role.toLowerCase(),
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser.id,
        clerkId: clerkUser?.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        createdAt: dbUser.createdAt.toISOString().split('T')[0],
      },
      message: existingDbUser 
        ? `${role.charAt(0).toUpperCase() + role.slice(1)} user updated successfully! They can sign in with Google OAuth or use the temporary password: TempSecurePass2024!@#`
        : `${role.charAt(0).toUpperCase() + role.slice(1)} user created successfully! They can sign in with Google OAuth or use the temporary password: TempSecurePass2024!@#`
    });

  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle Prisma unique constraint errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

function isValidDatabaseUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('postgresql://') || trimmed.startsWith('postgres://');
}

export async function POST(request: NextRequest) {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json(
        { error: 'DATABASE_URL is not set. In Vercel: Project → Settings → Environment Variables → add DATABASE_URL with your Neon URL.' },
        { status: 503 }
      );
    }
    if (!isValidDatabaseUrl(dbUrl)) {
      return NextResponse.json(
        { error: 'DATABASE_URL must start with postgresql:// or postgres://. Check Vercel env vars and remove any extra quotes or spaces.' },
        { status: 503 }
      );
    }

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
    if (!['admin', 'student', 'lecturer', 'parent'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin, student, lecturer, or parent' },
        { status: 400 }
      );
    }

    // Check if user already exists in database - if so, we'll update instead of create
    let existingDbUser;
    try {
      existingDbUser = await prisma.user.findUnique({
        where: { email }
      });
    } catch (dbErr: any) {
      console.error('Database check failed:', dbErr);
      const msg = dbErr?.code === 'P1001' || dbErr?.message?.includes('connect')
        ? 'Database unreachable. Check DATABASE_URL and that your database is running.'
        : 'Database error. Please try again or check your connection.';
      return NextResponse.json({ error: msg }, { status: 503 });
    }

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
          const clerkMsg = clerkError?.errors?.[0]?.message || clerkError?.message || '';
          const friendly = clerkMsg.includes('identifier') || clerkError?.status === 422
            ? 'A user with this email may already exist. Try signing in or use a different email.'
            : clerkMsg
              ? `Clerk error: ${clerkMsg}`
              : 'Failed to create user in authentication. Please try again.';
          return NextResponse.json(
            { error: friendly },
            { status: 500 }
          );
        }
      }
    }

    // Create or update user in database
    let dbUser;
    try {
      dbUser = await prisma.user.upsert({
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
    } catch (dbErr: any) {
      console.error('Database upsert failed:', dbErr);
      const msg = typeof dbErr?.message === 'string' && (dbErr.message.includes('must start with the protocol') || dbErr.message.includes('postgresql://'))
        ? 'DATABASE_URL is invalid. It must start with postgresql://. Set it in Vercel → Settings → Environment Variables (no extra quotes).'
        : dbErr?.code === 'P1001' || dbErr?.message?.includes('connect')
          ? 'Database unreachable. User may exist in auth; check DATABASE_URL or try Sync from Clerk.'
          : dbErr?.code === 'P2002'
            ? 'A user with this email already exists.'
            : 'Database error while saving user. Try again or use Sync from Clerk.';
      return NextResponse.json({ error: msg }, { status: 503 });
    }

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

    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 400 }
      );
    }
    const msg = typeof error?.message === 'string' ? error.message : '';
    if (msg.includes('must start with the protocol') || msg.includes('postgresql://')) {
      return NextResponse.json(
        { error: 'DATABASE_URL is invalid. It must start with postgresql://. Set it in Vercel → Settings → Environment Variables.' },
        { status: 503 }
      );
    }
    if (error?.code === 'P1001' || msg.includes('connect')) {
      return NextResponse.json(
        { error: 'Database unreachable. Check DATABASE_URL and that your database is running.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: msg || 'Failed to create user. Please try again.' },
      { status: 500 }
    );
  }
}

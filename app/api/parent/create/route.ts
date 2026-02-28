export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, phone, studentEmail } = await request.json();

    if (!email || !name || !studentEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if student exists
    const student = await prisma.user.findFirst({
      where: { 
        email: studentEmail,
        role: 'student'
      }
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found with the provided email' },
        { status: 404 }
      );
    }

    // Check if parent already exists
    const existingParent = await prisma.parent.findUnique({
      where: { email }
    });

    if (existingParent) {
      return NextResponse.json(
        { error: 'Parent with this email already exists' },
        { status: 400 }
      );
    }

    // Create parent in Clerk
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.createUser({
        emailAddress: [email],
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
        username: email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_'),
        password: 'TempParentPass2024!@#',
        publicMetadata: { role: 'parent' },
        privateMetadata: { role: 'parent' }
      });
    } catch (clerkError: any) {
      console.error('Clerk user creation error:', clerkError);
      
      if (clerkError.status === 422 || clerkError.errors?.[0]?.code === 'form_identifier_exists') {
        return NextResponse.json(
          { error: 'This email is already registered in the system' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create parent account. Please try again.' },
        { status: 500 }
      );
    }

    // Create parent in database
    const parent = await prisma.parent.create({
      data: {
        email,
        name,
        phone,
        studentEmail,
        studentId: student.id
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Parent account created successfully',
      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        studentEmail: parent.studentEmail
      }
    });

  } catch (error) {
    console.error('Error creating parent:', error);
    return NextResponse.json(
      { error: 'Failed to create parent account' },
      { status: 500 }
    );
  }
}
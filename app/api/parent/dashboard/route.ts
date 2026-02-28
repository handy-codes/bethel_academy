export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ error: 'No email found for this account' }, { status: 400 });
    }

    const parent = await prisma.parent.findUnique({
      where: { email },
      include: {
        student: true
      }
    });

    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    if (!parent.studentId || !parent.student) {
      return NextResponse.json({ error: 'No linked student found' }, { status: 404 });
    }

    // Get student's exam results
    const results = await prisma.examResult.findMany({
      where: { studentId: parent.studentId },
      include: {
        exam: {
          select: {
            title: true,
            subject: true,
            totalQuestions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Calculate statistics
    const totalExams = results.length;
    const averageScore = totalExams > 0 
      ? results.reduce((sum, result) => sum + result.percentage, 0) / totalExams 
      : 0;
    
    const recentResults = results.slice(0, 5).map((r) => ({
      id: r.id,
      examTitle: r.exam.title,
      subject: r.exam.subject,
      percentage: r.percentage,
      grade: r.grade,
      createdAt: r.createdAt.toISOString(),
    }));
    const subjectPerformance = results.reduce((acc, result) => {
      const subject = result.exam.subject;
      if (!acc[subject]) {
        acc[subject] = { total: 0, count: 0, average: 0 };
      }
      acc[subject].total += result.percentage;
      acc[subject].count += 1;
      acc[subject].average = acc[subject].total / acc[subject].count;
      return acc;
    }, {} as Record<string, { total: number; count: number; average: number }>);

    return NextResponse.json({
      parent: {
        id: parent.id,
        name: parent.name,
        email: parent.email,
        phone: parent.phone
      },
      student: {
        id: parent.student.id,
        name: parent.student.name,
        email: parent.student.email
      },
      stats: {
        totalExams,
        averageScore: Math.round(averageScore * 100) / 100,
        recentResults,
        subjectPerformance
      }
    });

  } catch (error) {
    console.error('Error fetching parent dashboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}



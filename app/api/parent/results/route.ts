export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get parent info
    const parent = await prisma.parent.findFirst({
      where: { 
        email: { contains: userId } // This will be updated to use proper Clerk email lookup
      },
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

    // Get all student's exam results with detailed information
    const results = await prisma.examResult.findMany({
      where: { studentId: parent.studentId },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            subject: true,
            totalQuestions: true,
            duration: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format results for display
    const formattedResults = results.map(result => ({
      id: result.id,
      examTitle: result.exam.title,
      subject: result.exam.subject,
      score: result.score,
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      percentage: result.percentage,
      grade: result.grade,
      isApproved: result.isApproved,
      feedback: result.feedback,
      examDate: result.exam.createdAt,
      resultDate: result.createdAt,
      approvedAt: result.approvedAt
    }));

    return NextResponse.json({
      results: formattedResults,
      student: {
        id: parent.student.id,
        name: parent.student.name,
        email: parent.student.email
      }
    });

  } catch (error) {
    console.error('Error fetching parent results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}



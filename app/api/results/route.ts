import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/results?studentId=&examId=&lecturerId=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || undefined;
    const examId = searchParams.get('examId') || undefined;
    const lecturerId = searchParams.get('lecturerId') || undefined;

    const where: { studentId?: string; examId?: string } = {};
    if (studentId) where.studentId = studentId;
    if (examId) where.examId = examId;

    const results = await prisma.examResult.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        exam: { select: { title: true, subject: true } },
        attempt: { select: { studentName: true, studentEmail: true, submittedAt: true } },
      },
    });

    let filtered = results;
    if (lecturerId) {
      const exams = await prisma.exam.findMany({ where: { createdBy: lecturerId }, select: { id: true } });
      const ids = new Set(exams.map(e => e.id));
      filtered = results.filter(r => ids.has(r.examId));
    }

    const formatted = filtered.map(r => ({
      id: r.id,
      attemptId: r.attemptId,
      studentId: r.studentId,
      examId: r.examId,
      studentName: r.attempt?.studentName ?? '',
      studentEmail: r.attempt?.studentEmail ?? '',
      examTitle: r.exam?.title ?? '',
      subject: r.exam?.subject ?? '',
      score: r.score,
      totalQuestions: r.totalQuestions,
      correctAnswers: r.correctAnswers,
      percentage: r.percentage,
      grade: r.grade,
      isApproved: r.isApproved,
      approvedBy: r.approvedBy,
      approvedAt: r.approvedAt,
      feedback: r.feedback,
      submittedAt: r.attempt?.submittedAt ?? r.createdAt,
      createdAt: r.createdAt,
    }));

    return NextResponse.json({ results: formatted });
  } catch (err) {
    console.error('GET /api/results error', err);
    return NextResponse.json({ error: 'Failed to load results' }, { status: 500 });
  }
}



import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/results?studentId=&examId=&lecturerId=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get('studentId') || undefined;
    const examId = searchParams.get('examId') || undefined;
    const lecturerId = searchParams.get('lecturerId') || undefined;

    let where: any = {};
    if (studentId) where.studentId = studentId;
    if (examId) where.examId = examId;

    // If filtering by lecturer, join to exam.createdBy
    const results = await prisma.examResult.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    if (lecturerId) {
      const exams = await prisma.exam.findMany({ where: { createdBy: lecturerId }, select: { id: true } });
      const ids = new Set(exams.map(e => e.id));
      return NextResponse.json({ results: results.filter(r => ids.has(r.examId)) });
    }

    return NextResponse.json({ results });
  } catch (err) {
    console.error('GET /api/results error', err);
    return NextResponse.json({ error: 'Failed to load results' }, { status: 500 });
  }
}



import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/questions?subject=&difficulty=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subject = searchParams.get('subject') || undefined;
    const difficulty = searchParams.get('difficulty') || undefined;

    const questions = await prisma.question.findMany({
      where: {
        difficulty: difficulty as any | undefined,
        exam: subject ? { subject: subject as any } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: { exam: true },
    });

    // Map to include subject and createdBy from exam
    const mapped = questions.map(q => ({
      id: q.id,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      optionE: q.optionE,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      points: q.points,
      subject: q.exam.subject,
      createdBy: q.exam.createdBy,
      examId: q.examId,
      createdAt: q.createdAt,
    }));

    return NextResponse.json({ questions: mapped });
  } catch (err) {
    console.error('GET /api/questions error', err);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}



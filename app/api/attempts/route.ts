import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/attempts -> create attempt, answers, compute score, create result
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { examId, studentId, studentName, studentEmail, answers, timeSpent } = body || {};
    if (!examId || !studentId || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const exam = await prisma.exam.findUnique({ where: { id: examId }, include: { questions: true } });
    if (!exam) return NextResponse.json({ error: 'Exam not found' }, { status: 404 });

    // compute
    const totalQuestions = exam.questions.length;
    let correct = 0;
    const byId: Record<string, any> = {};
    for (const q of exam.questions) byId[q.id] = q;
    for (const a of answers) {
      const q = byId[a.questionId];
      if (q && a.selectedAnswer && a.selectedAnswer === q.correctAnswer) correct++;
    }
    const percentage = totalQuestions ? Math.round((correct / totalQuestions) * 100) : 0;

    const attempt = await prisma.examAttempt.create({
      data: {
        examId,
        studentId,
        studentName,
        studentEmail,
        totalQuestions,
        correctAnswers: correct,
        timeSpent: Number(timeSpent) || null,
        status: 'COMPLETED',
        submittedAt: new Date(),
      },
    });

    await prisma.studentAnswer.createMany({
      data: answers.map((a: any) => ({
        attemptId: attempt.id,
        questionId: a.questionId,
        selectedAnswer: a.selectedAnswer || null,
        isCorrect: (byId[a.questionId]?.correctAnswer || null) === (a.selectedAnswer || null),
        timeSpent: a.timeSpent || null,
      })),
    });

    const result = await prisma.examResult.create({
      data: {
        attemptId: attempt.id,
        studentId,
        examId,
        score: percentage,
        totalQuestions,
        correctAnswers: correct,
        percentage,
      },
    });

    return NextResponse.json({ attempt, result }, { status: 201 });
  } catch (err) {
    console.error('POST /api/attempts error', err);
    return NextResponse.json({ error: 'Failed to submit attempt' }, { status: 500 });
  }
}



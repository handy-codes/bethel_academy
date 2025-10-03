import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/exams?createdBy=clerk_user_id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const createdBy = searchParams.get('createdBy') || undefined;
    const isActiveParam = searchParams.get('isActive');
    const isActive = typeof isActiveParam === 'string' ? isActiveParam === 'true' : undefined;

    const where: any = {};
    if (createdBy) where.createdBy = createdBy;
    if (typeof isActive === 'boolean') where.isActive = isActive;

    const exams = await prisma.exam.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { questions: true },
    });

    return NextResponse.json({ exams });
  } catch (err) {
    console.error('GET /api/exams error', err);
    return NextResponse.json({ error: 'Failed to load exams' }, { status: 500 });
  }
}

// POST /api/exams
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      subject,
      duration,
      instructions,
      createdBy,
      isActive = true,
      questions = [],
    } = body || {};

    if (!title || !subject || !duration || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const exam = await prisma.exam.create({
      data: {
        title,
        description: description || null,
        subject,
        duration: Number(duration),
        totalQuestions: Array.isArray(questions) ? questions.length : 0,
        instructions: instructions || null,
        isActive: Boolean(isActive),
        createdBy,
        questions: Array.isArray(questions) && questions.length > 0 ? {
          create: questions.map((q: any) => ({
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            optionE: q.optionE,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null,
            difficulty: q.difficulty || 'MEDIUM',
            points: q.points || 1,
          }))
        } : undefined,
      },
      include: { questions: true },
    });

    return NextResponse.json({ exam }, { status: 201 });
  } catch (err) {
    console.error('POST /api/exams error', err);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}



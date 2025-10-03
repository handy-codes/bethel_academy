import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const exam = await prisma.exam.findUnique({ where: { id: params.id }, include: { questions: true } });
    if (!exam) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ exam });
  } catch (err) {
    console.error('GET /api/exams/[id] error', err);
    return NextResponse.json({ error: 'Failed to load exam' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const { title, description, subject, duration, isActive, instructions, questions } = data || {};

    const exam = await prisma.exam.update({
      where: { id: params.id },
      data: {
        title,
        description,
        subject,
        duration,
        isActive,
        instructions,
        totalQuestions: Array.isArray(questions) ? questions.length : undefined,
      },
    });

    return NextResponse.json({ exam });
  } catch (err) {
    console.error('PATCH /api/exams/[id] error', err);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.exam.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/exams/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}



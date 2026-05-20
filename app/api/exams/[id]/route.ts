import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const exam = await prisma.exam.findUnique({ where: { id }, include: { questions: true } });
    if (!exam) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ exam });
  } catch (err) {
    console.error('GET /api/exams/[id] error', err);
    return NextResponse.json({ error: 'Failed to load exam' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { title, description, subject, duration, isActive, instructions, questions } = data || {};

    const exam = await prisma.exam.update({
      where: { id },
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

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.exam.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/exams/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}



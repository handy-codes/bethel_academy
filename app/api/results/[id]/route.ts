import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/results/[id]
// body: { isApproved?: boolean, feedback?: string, approvedBy?: string }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { isApproved, feedback, approvedBy } = body || {};
    const data: any = {};
    if (typeof isApproved === 'boolean') data.isApproved = isApproved;
    if (typeof feedback === 'string') data.feedback = feedback;
    if (isApproved) {
      data.approvedAt = new Date();
      if (approvedBy) data.approvedBy = approvedBy;
    }
    const result = await prisma.examResult.update({ where: { id: params.id }, data });
    return NextResponse.json({ result });
  } catch (err) {
    console.error('PATCH /api/results/[id] error', err);
    return NextResponse.json({ error: 'Failed to update result' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Delete the result. If your schema uses cascading deletes, related rows
    // (answers/attempts) will be handled by the database.
    await prisma.examResult.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('DELETE /api/results/[id] error', err);
    return NextResponse.json({ error: 'Failed to delete result' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/admin/users/[id] error', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { email, name, role, isActive } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        email: email ?? undefined,
        name: name ?? undefined,
        role: role ?? undefined,
        // no isActive field in schema; kept for potential extension
      },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        createdAt: updated.createdAt.toISOString(),
        isActive: true,
      },
    });
  } catch (error) {
    console.error('PATCH /api/admin/users/[id] error', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}








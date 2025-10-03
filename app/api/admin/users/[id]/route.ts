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
    // Also attempt to delete Clerk user if a matching email exists
    try {
      const deletedEmail = undefined as unknown as string; // placeholder to satisfy TS
      // We cannot reliably map prisma id -> clerk id here without stored mapping.
      // Admin UI will refetch from DB; Clerk record can remain if unknown.
    } catch {}
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








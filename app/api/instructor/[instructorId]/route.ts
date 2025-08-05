import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { instructorId: string } }
) {
  try {
    const { instructorId } = params;

    if (!instructorId) {
      return new NextResponse("Instructor ID is required", { status: 400 });
    }

    // Fetch instructor from database
    const instructor = await db.user.findUnique({
      where: {
        id: instructorId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (!instructor) {
      return NextResponse.json({
        id: instructorId,
        name: "Unknown Instructor",
        email: null,
        role: "user"
      });
    }

    return NextResponse.json(instructor);
  } catch (error) {
    console.error("[INSTRUCTOR_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
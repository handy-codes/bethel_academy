import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin or lecturer
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "LECTURER")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { zoomLink, zoomMeetingId, zoomPassword } = body;

    if (!zoomLink || !zoomMeetingId || !zoomPassword) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Find the live class
    const liveClass = await db.liveClass.findFirst({
      where: {
        title: "Graphic Design",
        isActive: true
      }
    });

    if (!liveClass) {
      return new NextResponse("No active class found", { status: 404 });
    }

    // Update the live class with zoom details
    const updatedClass = await db.liveClass.update({
      where: { id: liveClass.id },
      data: {
        zoomLink,
        zoomMeetingId,
        zoomPassword,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: "Live class setup completed",
      liveClass: updatedClass
    });
  } catch (error) {
    console.error("Setup error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
} 
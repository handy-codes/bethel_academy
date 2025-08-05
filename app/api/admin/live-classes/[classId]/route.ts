import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user || (user.role !== "ADMIN" && user.role !== "HEAD_ADMIN")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveClass = await db.liveClass.findUnique({
      where: { id: params.classId },
      include: {
        lecturer: true,
        purchases: true,
        materials: true,
        schedules: true
      }
    });

    if (!liveClass) {
      return new NextResponse("Live class not found", { status: 404 });
    }

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        clerkUserId: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      startTime,
      endTime,
      price,
      maxStudents,
      duration,
      batchNumber,
      lecturerId,
      isActive
    } = body;

    const liveClass = await db.liveClass.update({
      where: {
        id: params.classId
      },
      data: {
        title,
        description,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        price,
        maxStudents,
        duration,
        batchNumber,
        lecturerId,
        isActive
      }
    });

    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASS_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { classId: string } }
) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await db.liveClassUser.findFirst({
      where: {
        clerkUserId: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN"]
        }
      }
    });

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First, delete all related records
    await db.$transaction([
      // Delete purchases
      db.liveClassPurchase.deleteMany({
        where: { liveClassId: params.classId }
      }),
      // Delete materials
      db.liveClassMaterial.deleteMany({
        where: { liveClassId: params.classId }
      }),
      // Delete schedules
      db.liveClassSchedule.deleteMany({
        where: { liveClassId: params.classId }
      }),
      // Delete attendance records
      db.liveClassAttendance.deleteMany({
        where: { liveClassId: params.classId }
      }),
      // Delete zoom meetings and their related records
      db.zoomMeeting.deleteMany({
        where: { liveClassId: params.classId }
      }),
      // Finally, delete the live class
      db.liveClass.delete({
        where: { id: params.classId }
      })
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[LIVE_CLASS_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
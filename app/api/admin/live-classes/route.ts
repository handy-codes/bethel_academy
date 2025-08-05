import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[LIVE_CLASSES_GET] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // Log the authentication attempt for debugging
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[LIVE_CLASSES_GET] Attempting auth for: ${userEmail}`);

    // More permissive check - look for any user that might be an admin
    const isAdmin = await db.liveClassUser.findFirst({
      where: {
        OR: [
          // Check by email
          { 
            email: userEmail,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          },
          // Check by clerkUserId
          {
            clerkUserId: userId,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          }
        ]
      }
    });

    if (!isAdmin) {
      console.error(`[LIVE_CLASSES_GET] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const liveClasses = await db.liveClass.findMany({
      include: {
        lecturer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`[LIVE_CLASSES_GET] Found ${liveClasses.length} live classes`);
    return NextResponse.json(liveClasses);
  } catch (error) {
    console.error("[LIVE_CLASSES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the current Clerk user to access their email
    const clerkUser = await currentUser();
    
    if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
      console.error("[LIVE_CLASSES_POST] No email found for user");
      return new NextResponse("User email not found", { status: 401 });
    }

    // Log the authentication attempt for debugging
    const userEmail = clerkUser.emailAddresses[0].emailAddress;
    console.log(`[LIVE_CLASSES_POST] Attempting auth for: ${userEmail}`);

    // More permissive check - look for any user that might be an admin
    const isAdmin = await db.liveClassUser.findFirst({
      where: {
        OR: [
          // Check by email
          { 
            email: userEmail,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          },
          // Check by clerkUserId
          {
            clerkUserId: userId,
            role: {
              in: ["HEAD_ADMIN", "ADMIN"]
            }
          }
        ]
      }
    });

    if (!isAdmin) {
      console.error(`[LIVE_CLASSES_POST] User not authorized: ${userEmail}`);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    console.log(`[LIVE_CLASSES_POST] Received request with body:`, body);
    
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
      zoomLink,
      zoomMeetingId,
      zoomPassword,
      isActive
    } = body;

    // Validate required fields
    if (!title) {
      return new NextResponse("Title is required", { status: 400 });
    }
    
    if (!startTime || !endTime) {
      return new NextResponse("Start and end times are required", { status: 400 });
    }
    
    if (!lecturerId) {
      return new NextResponse("Lecturer ID is required", { status: 400 });
    }

    if (!zoomLink || !zoomMeetingId) {
      return new NextResponse("Zoom meeting details are required", { status: 400 });
    }

    const liveClass = await db.liveClass.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        price,
        maxStudents,
        duration,
        batchNumber,
        lecturerId,
        zoomLink,
        zoomMeetingId,
        zoomPassword,
        isActive: isActive ?? true
      }
    });

    console.log(`[LIVE_CLASSES_POST] Created live class with ID: ${liveClass.id}`);
    return NextResponse.json(liveClass);
  } catch (error) {
    console.error("[LIVE_CLASSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
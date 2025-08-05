import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

// Define host roles
const HOST_ROLES = ['ADMIN', 'HEAD_ADMIN', 'LECTURER'] as const;
type HostRole = typeof HOST_ROLES[number];

const isHost = (role: LiveClassUserRole): role is HostRole => {
  return HOST_ROLES.includes(role as HostRole);
};

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;

    if (!courseId) {
      return new NextResponse("Course ID is required", { status: 400 });
    }

    // Get user details from Clerk
    let userEmail = "unknown@email.com";
    let userName = "New User";
    
    try {
      const clerkUser = await clerkClient.users.getUser(userId);
      userEmail = clerkUser.emailAddresses[0]?.emailAddress || userEmail;
      userName = clerkUser.firstName && clerkUser.lastName 
        ? `${clerkUser.firstName} ${clerkUser.lastName}`
        : clerkUser.firstName || userName;
    } catch (clerkError) {
      console.error("Error fetching Clerk user details:", clerkError);
    }

    // Find user in our database
    let user = await db.liveClassUser.findFirst({
      where: {
        OR: [
          { clerkUserId: userId },
          { email: userEmail }
        ]
      }
    });

    // If no user found, create one as LEARNER
    if (!user) {
      user = await db.liveClassUser.create({
        data: {
          clerkUserId: userId,
          email: userEmail,
          name: userName,
          role: "LEARNER"
        }
      });
    }

    // Find the live class by matching the courseId to the title
    const titleMap: { [key: string]: string } = {
      'frontend': 'Frontend Development',
      'fullstack': 'Fullstack Development',
      'data-science': 'Data Science',
      'ai-ml': 'Artificial Intelligence',
      'software-devt': 'Software Development',
      'digital-marketing': 'Digital Marketing',
      'ui-ux': 'UI-UX Design',
      'cybersecurity': 'Cybersecurity',
      'project-mgt': 'Project Management',
      'graphic-design': 'Graphic Design',
      'mathematics-jss': 'Mathematics JSS'
    };

    const courseTitle = titleMap[courseId];
    if (!courseTitle) {
      console.log(`[JOIN_LIVE_CLASS] Invalid courseId: ${courseId}`);
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    console.log(`[JOIN_LIVE_CLASS] Looking for live class with title: ${courseTitle}`);
    
    // First check for a live class
    const liveClass = await db.liveClass.findFirst({
      where: {
        title: courseTitle,
        isActive: true
      }
    });

    console.log(`[JOIN_LIVE_CLASS] Live class search result:`, liveClass ? {
      id: liveClass.id,
      title: liveClass.title,
      isActive: liveClass.isActive,
      hasZoomLink: !!liveClass.zoomLink
    } : 'No live class found');

    // Check for course zoom meeting regardless of live class status
    console.log(`[JOIN_LIVE_CLASS] Checking course zoom meetings for courseId: ${courseId}`);
    
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        zoomMeetings: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    console.log(`[JOIN_LIVE_CLASS] Course search result:`, course ? {
      id: course.id,
      title: course.title,
      hasZoomMeetings: course.zoomMeetings.length > 0,
      activeZoomMeetings: course.zoomMeetings.map(m => ({
        id: m.id,
        isActive: m.isActive,
        hasZoomLink: !!m.zoomLink
      }))
    } : 'No course found');

    // If we have a live class with a zoom link, use that
    if (liveClass?.zoomLink) {
      console.log(`[JOIN_LIVE_CLASS] Using live class zoom details:`, {
        id: liveClass.id,
        title: liveClass.title,
        hasZoomLink: !!liveClass.zoomLink,
        hasZoomMeetingId: !!liveClass.zoomMeetingId
      });

      // Check if user has purchased the course
      const purchase = await db.liveClassPurchase.findFirst({
        where: {
          studentId: user.id,
          liveClassId: liveClass.id,
          isActive: true,
          endDate: { gt: new Date() }
        }
      });

      console.log(`[JOIN_LIVE_CLASS] Live class purchase check:`, {
        userId: user.id,
        liveClassId: liveClass.id,
        hasPurchase: !!purchase
      });

      // Check if user is a host
      const isUserHost = isHost(user.role);
      console.log(`[JOIN_LIVE_CLASS] User role check:`, {
        userId: user.id,
        role: user.role,
        isHost: isUserHost
      });

      //remove && user.role !== 'LEARNER' in two places later

      if (!isUserHost && !purchase && user.role !== 'LEARNER') {
        console.log(`[JOIN_LIVE_CLASS] Access denied - user is not a host and has no purchase`);
        return new NextResponse("You need to purchase this course to join the live class", { status: 403 });
      }

      // Log attendance
      await db.liveClassAttendance.create({
        data: {
          studentId: user.id,
          liveClassId: liveClass.id,
          status: "PRESENT",
          joinTime: new Date(),
        }
      });

      console.log(`[JOIN_LIVE_CLASS] Successfully created attendance record for user: ${user.id}`);

      return NextResponse.json({
        zoomLink: liveClass.zoomLink,
        zoomMeetingId: liveClass.zoomMeetingId,
        isHost: isUserHost,
        message: `Successfully ${isUserHost ? 'started' : 'joined'} the live class`
      });
    }

    // If no live class with zoom link, try to use course zoom meeting
    if (course && course.zoomMeetings && course.zoomMeetings.length > 0) {
      const activeZoomMeeting = course.zoomMeetings[0];
      console.log(`[JOIN_LIVE_CLASS] Found active zoom meeting:`, {
        id: activeZoomMeeting.id,
        isActive: activeZoomMeeting.isActive,
        hasZoomLink: !!activeZoomMeeting.zoomLink
      });

      // Check if user has purchased the course
      const purchase = await db.purchase.findFirst({
        where: {
          customerId: user.id,
          courseId: course.id,
        }
      });

      console.log(`[JOIN_LIVE_CLASS] Purchase check result:`, {
        userId: user.id,
        courseId: course.id,
        hasPurchase: !!purchase
      });

      // Check if user is a host
      const isUserHost = isHost(user.role);
      console.log(`[JOIN_LIVE_CLASS] User role check:`, {
        userId: user.id,
        role: user.role,
        isHost: isUserHost
      });

      // const learning = {user.learner};
      // remove this later && user.role !== 'LEARNER'

      if (!isUserHost && !purchase && user.role !== 'LEARNER') {
        console.log(`[JOIN_LIVE_CLASS] Access denied - user is not a host and has no purchase`);
        return new NextResponse("You need to purchase this course to join the live class", { status: 403 });
      }

      return NextResponse.json({
        zoomLink: activeZoomMeeting.zoomLink,
        zoomMeetingId: activeZoomMeeting.id,
        isHost: isUserHost,
        message: `Successfully ${isUserHost ? 'started' : 'joined'} the live class`
      });
    }

    // If we get here, we have no valid zoom link from either source
    console.log(`[JOIN_LIVE_CLASS] No valid zoom link found in either live class or course zoom meetings`);
    return new NextResponse("No active class link available. Please contact support.", { status: 404 });

  } catch (error) {
    console.error("[JOIN_LIVE_CLASS] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
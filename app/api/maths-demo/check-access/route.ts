import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ hasAccess: false, isDemoMode: false });
    }

    // Check if demo mode is enabled - use a simpler query
    const classMode = await db.classMode.findFirst({
      where: { id: "1" },
      select: { mode: true }
    });

    const isDemoMode = classMode?.mode === "demo";

    if (!isDemoMode) {
      return NextResponse.json({ hasAccess: false, isDemoMode: false });
    }

    // Get user email from Clerk - use a more efficient approach
    let email = "";
    try {
      const user = await clerkClient.users.getUser(userId);
      email = user.emailAddresses[0]?.emailAddress || "";
    } catch (error) {
      console.error("Error fetching user from Clerk:", error);
      return NextResponse.json({ hasAccess: false, isDemoMode: true });
    }

    if (!email) {
      return NextResponse.json({ hasAccess: false, isDemoMode: true });
    }

    // First, find the user in our database
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: email }
        ]
      }
    });

    if (!dbUser) {
      return NextResponse.json({ hasAccess: false, isDemoMode: true });
    }

    // Check if user has already registered for demo - use a more efficient query
    const existingRegistration = await db.mathsDemo.findFirst({
      where: { 
        userId: dbUser.id
      },
      select: {
        name: true,
        class: true,
        trainingDate: true
      }
    });

    return NextResponse.json({ 
      hasAccess: !!existingRegistration, 
      isDemoMode: true,
      registration: existingRegistration || null
    });
  } catch (error) {
    console.error("[MATHS_DEMO_CHECK_ACCESS]", error);
    return NextResponse.json({ hasAccess: false, isDemoMode: false });
  }
} 
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId, sessionClaims } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get email from Clerk session claims
    const userEmail = sessionClaims?.email as string | undefined;

    // Find the user in both databases
    const [liveClassUser, courseUser] = await Promise.all([
      db.liveClassUser.findFirst({
        where: { clerkUserId: userId },
      }),
      userEmail
        ? db.user.findFirst({
            where: { email: userEmail },
          })
        : null,
    ]);

    if (!liveClassUser && !courseUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Combine roles from both tables
    const roles = [];
    if (liveClassUser) roles.push(liveClassUser.role);
    if (courseUser) roles.push(courseUser.role);

    const isAdmin = roles.some(
      (role) => role === "HEAD_ADMIN" || role === "ADMIN" || role === "LECTURER"
    );

    return NextResponse.json({
      roles,
      isAdmin,
    });
  } catch (error) {
    console.error("[USER_ROLE_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

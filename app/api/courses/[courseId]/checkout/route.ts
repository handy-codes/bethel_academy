import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export const POST = async (
  req: NextRequest,
  { params }: { params: { courseId: string } }
) => {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, isPublished: true },
    });

    if (!course) {
      return new NextResponse("Course Not Found", { status: 404 });
    }

    // Updated access check: only allow payment if no active, completed purchase
    const now = new Date();
    const purchase = await db.purchase.findFirst({
      where: {
        customerId: user.id,
        courseId: course.id,
        status: "COMPLETED",
        isActive: true,
        endDate: { gt: now },
      },
    });

    if (purchase) {
      return new NextResponse("Course Already Purchased", { status: 400 });
    }

    // Generate a unique transaction reference
    const tx_ref = `${course.id}-${uuidv4()}`;

    // Create a pending purchase record with permanent access
    await db.purchase.create({
      data: {
        customerId: user.id,
        courseId: course.id,
        status: "PENDING",
        amount: course.price || 0,
        currency: "NGN",
        txRef: tx_ref,
        isActive: false,
        startDate: new Date(),
        endDate: new Date("2099-12-31"), // Set far future date for permanent access
      },
    });

    console.log("[CHECKOUT] Purchase record created:", {
      txRef: tx_ref,
      courseId: course.id,
      customerId: user.id,
    });

    // Return Flutterwave payment details
    return NextResponse.json({
      tx_ref,
      amount: course.price,
      currency: "NGN",
      redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/courses/${course.id}/overview?success=true`,
      customer: {
        email: user.emailAddresses[0].emailAddress,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
      },
      courseTitle: course.title,
      courseDescription: course.description,
    });
  } catch (err) {
    console.error("[CHECKOUT] Error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

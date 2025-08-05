import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { PurchaseStatus } from "@prisma/client";
import { countryPricing } from "@/lib/countryPricing";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get payment data from frontend
    const { transactionId, status, flwRef, txRef, currency, amount, countryCode } = await req.json();

    console.log("Payment success data:", {
      transactionId, status, flwRef, txRef, currency, amount, clerkUserId, countryCode
    });

    if (!transactionId || !currency || !amount) {
      return NextResponse.json({ error: "Missing required payment info" }, { status: 400 });
    }

    // Validate currency against supported list
    const supportedCurrencies = new Set(Object.values(countryPricing).map(p => p.currency));
    if (!supportedCurrencies.has(currency)) {
      console.warn("[CHECKOUT] Unsupported currency received:", currency);
    }

    // Find or create user
    let user = await db.liveClassUser.findUnique({ where: { clerkUserId } });

    let clerkUserData;
    try {
      clerkUserData = await clerkClient.users.getUser(clerkUserId);
    } catch (clerkError) {
      console.error("Error fetching Clerk user data:", clerkError);
      return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
    }

    const userEmail = clerkUserData.emailAddresses[0]?.emailAddress || "";
    const userName = clerkUserData.firstName && clerkUserData.lastName
      ? `${clerkUserData.firstName} ${clerkUserData.lastName}`
      : clerkUserData.firstName || "";

    if (!user) {
      user = await db.liveClassUser.create({
        data: {
          clerkUserId,
          email: userEmail,
          name: userName,
          role: "LEARNER",
          isActive: true
        }
      });
      console.log("Created new LEARNER:", user.id);
    }

    // Find the active course
    const liveClass = await db.liveClass.findFirst({
      where: {
        title: "Project Management",
        isActive: true,
        endTime: { gt: new Date() }
      }
    });

    if (!liveClass) {
      return NextResponse.json({ error: "No active class found" }, { status: 404 });
    }

    // Calculate course end date (12 weeks)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (12 * 7));

    // Check for existing purchase
    const existingPurchase = await db.liveClassPurchase.findFirst({
      where: {
        studentId: user.id,
        liveClassId: liveClass.id
      }
    });

    const purchaseData = {
      status: PurchaseStatus.PENDING,
      amount,
      currency,
      txRef: txRef?.toString() || null,
      flwRef: flwRef?.toString() || null,
      transactionId: transactionId.toString(),
      isActive: false,
      startDate: new Date(),
      endDate,
      courseName: liveClass.title,
      studentEmail: user.email,
      studentName: user.name
    };

    let purchase;

    if (existingPurchase) {
      purchase = await db.liveClassPurchase.update({
        where: { id: existingPurchase.id },
        data: purchaseData
      });
      console.log("Updated purchase:", purchase.id);
    } else {
      purchase = await db.liveClassPurchase.create({
        data: {
          studentId: user.id,
          liveClassId: liveClass.id,
          ...purchaseData
        }
      });
      console.log("Created new purchase:", purchase.id);
    }

    return NextResponse.json({
      success: true,
      purchase,
      courseTitle: liveClass.title
    });
  } catch (error) {
    console.error("[PURCHASE_SUCCESS_POST]", error);
    return NextResponse.json({ error: "There is Internal Error" }, { status: 500 });
  }
}

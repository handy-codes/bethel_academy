import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { LiveClassUserRole } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is an admin
    const user = await db.liveClassUser.findUnique({
      where: { clerkUserId: userId },
    });

    if (
      !user ||
      (user.role !== LiveClassUserRole.ADMIN &&
        user.role !== LiveClassUserRole.HEAD_ADMIN)
    ) {
      return new NextResponse("Unauthorized - Admin access required", {
        status: 403,
      });
    }

    // Fetch all purchases without the relation
    const purchases = await db.liveClassPurchase.findMany({
      include: {
        student: true,
        liveClass: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Ensure currency is always present
    const purchasesWithCurrency = purchases.map((p) => ({
      ...p,
      currency: p.currency || "USD",
    }));

    return NextResponse.json({
      success: true,
      purchases: purchasesWithCurrency,
    });
  } catch (error: any) {
    console.error("[FETCH_PURCHASES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

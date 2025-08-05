import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { getUserCountryCode } from "@/lib/getUserCountry";
import { getCurrencyData } from "@/lib/CountryCurrency";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { email, name, courseId, courseName, amount, currency } = body;

    if (!email || !name || !courseId || !courseName || !amount || !currency) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get user's country and currency data
    const countryCode = await getUserCountryCode();
    const currencyData = getCurrencyData(countryCode || "NGN");

    // Generate a unique transaction reference
    const txRef = `${courseId}-${uuidv4()}`;

    // Calculate end date (90 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    // Create a pending purchase record
    const purchase = await db.liveClassPurchase.create({
      data: {
        studentId: userId,
        liveClassId: courseId,
        amount: amount,
        currency: currency,
        status: "PENDING",
        txRef,
        isActive: false,
        startDate: new Date(),
        endDate,
        courseName,
        studentEmail: email,
        studentName: name,
      },
    });

    // Initialize Flutterwave payment
    const flutterwaveConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email,
        name,
      },
      customizations: {
        title: courseName,
        description: `Payment for ${courseName}`,
        logo: "https://your-logo-url.com/logo.png",
      },
    };

    // Return the Flutterwave configuration and session ID
    return NextResponse.json({
      flutterwaveConfig,
      sessionId: purchase.id,
    });
  } catch (error) {
    console.error("[PAYMENT_CREATE_SESSION] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

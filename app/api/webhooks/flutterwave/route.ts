import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // Verify the webhook signature
    const secretHash = process.env.FLUTTERWAVE_SECRET_HASH;
    const signature = req.headers.get("x-flutterwave-signature");
    
    if (!secretHash || !signature) {
      return new NextResponse("Missing signature or secret hash", { status: 400 });
    }
    
    // Verify the signature
    const expectedSignature = crypto
      .createHmac("sha512", secretHash)
      .update(rawBody)
      .digest("hex");
    
    if (signature !== expectedSignature) {
      return new NextResponse("Invalid signature", { status: 400 });
    }
    
    // Extract payment details
    const { 
      tx_ref, 
      transaction_id, 
      status, 
      amount, 
      currency, 
      customer 
    } = body;
    
    // Check if this is a successful payment
    if (status !== "successful") {
      return new NextResponse("Payment not successful", { status: 200 });
    }
    
    // Extract course ID from tx_ref (format: courseId-uuid)
    const courseId = tx_ref.split("-")[0];
    
    // First check for a regular course purchase
    let purchase = await db.purchase.findFirst({
      where: {
        txRef: tx_ref,
      },
    });

    // If not found, check for a live class purchase
    if (!purchase) {
      const liveClassPurchase = await db.liveClassPurchase.findFirst({
        where: {
          txRef: tx_ref,
        },
      });
      
      if (liveClassPurchase) {
        // This is a live class purchase - set 180 days access
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 180);

        await db.liveClassPurchase.update({
          where: {
            id: liveClassPurchase.id,
          },
          data: {
            status: "COMPLETED",
            isActive: true,
            transactionId: transaction_id,
            endDate: endDate,
          },
        });
        
        // Update user's access to the live class
        if (liveClassPurchase.studentId) {
          await db.liveClassUser.update({
            where: {
              id: liveClassPurchase.studentId,
            },
            data: {
              isActive: true,
            },
          });
        }
        
        console.log("[FLUTTERWAVE_WEBHOOK] Successfully processed live class payment for tx_ref:", tx_ref);
        return new NextResponse("Webhook processed successfully", { status: 200 });
      }
    }
    
    if (!purchase) {
      console.error("[FLUTTERWAVE_WEBHOOK] Purchase not found for tx_ref:", tx_ref);
      return new NextResponse("Purchase not found", { status: 404 });
    }

    // Verify the payment amount and currency match
    if (purchase.amount !== amount || purchase.currency !== currency) {
      console.error("[FLUTTERWAVE_WEBHOOK] Payment amount or currency mismatch:", {
        expected: { amount: purchase.amount, currency: purchase.currency },
        received: { amount, currency }
      });
      return new NextResponse("Payment amount or currency mismatch", { status: 400 });
    }

    // If purchase is already completed, just return success
    if (purchase.status === "COMPLETED") {
      console.log("[FLUTTERWAVE_WEBHOOK] Purchase already completed for tx_ref:", tx_ref);
      return new NextResponse("Purchase already completed", { status: 200 });
    }
    
    // This is a regular course purchase - set permanent access
    await db.purchase.update({
      where: {
        id: purchase.id,
      },
      data: {
        status: "COMPLETED",
        isActive: true,
        transactionId: transaction_id,
        endDate: new Date('2099-12-31'), // Set far future date for permanent access
      },
    });
    
    console.log("[FLUTTERWAVE_WEBHOOK] Successfully processed course payment for tx_ref:", tx_ref);
    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("[FLUTTERWAVE_WEBHOOK] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 
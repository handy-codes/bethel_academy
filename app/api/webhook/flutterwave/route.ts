// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import fetch from "node-fetch";
// import { countryPricing } from "@/lib/countryPricing";

// // Format amount into human-readable currency string
// function formatCurrency(currency: string, amount: number) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency,
//     minimumFractionDigits: 0,
//   }).format(amount);
// }

// // Fetch verified Flutterwave transaction details
// async function getFlutterwaveTransaction(tx_ref: string) {
//   const secretKey = process.env.FLW_SECRET_KEY!;
//   const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`;
//   const res = await fetch(url, {
//     headers: {
//       Authorization: `Bearer ${secretKey}`,
//       "Content-Type": "application/json",
//     },
//   });
//   if (!res.ok) throw new Error("Failed to fetch transaction from Flutterwave");
//   const data = await res.json();
//   return data.data;
// }

// export async function POST(req: Request) {
//   try {
//     const secretHashHeader = req.headers.get("verif-hash");
//     const expectedHash = process.env.FLW_SECRET_HASH;

//     if (process.env.NODE_ENV === "production" && secretHashHeader !== expectedHash) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const rawBody = await req.text();
//     let body;
//     try {
//       body = JSON.parse(rawBody);
//     } catch (err) {
//       return new NextResponse("Invalid JSON", { status: 400 });
//     }

//     const data = body.data || body;
//     let { status, tx_ref, flw_ref } = data;
//     let transaction_id = data.id || data.transaction_id;

//     if (!tx_ref && transaction_id) {
//       const parts = transaction_id.split("-");
//       if (parts.length > 1) tx_ref = parts.slice(0, -1).join("-");
//     }

//     if (!status || !tx_ref || !transaction_id) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     }

//     let purchase = await db.liveClassPurchase.findFirst({
//       where: { txRef: tx_ref },
//       include: { liveClass: true },
//     });

//     if (!purchase) {
//       const parts = tx_ref.split("-");
//       if (parts.length >= 1) {
//         const liveClassId = parts[0];
//         purchase = await db.liveClassPurchase.findFirst({
//           where: { txRef: { startsWith: liveClassId } },
//           include: { liveClass: true },
//         });
//       }
//     }

//     if (!purchase) {
//       return NextResponse.json({ status: "error", code: 404, message: "Purchase not found" }, { status: 404 });
//     }

//     if (purchase.status === "COMPLETED" && purchase.isActive) {
//       return NextResponse.json({ status: "success", message: "Purchase already completed" });
//     }

//     let flwTxn;
//     try {
//       flwTxn = await getFlutterwaveTransaction(tx_ref);
//     } catch (err) {
//       if (process.env.NODE_ENV !== "production" && status === "successful") {
//         const fallbackAmount = data.amount;
//         const fallbackCurrency = data.currency;
//         const formattedAmount = formatCurrency(fallbackCurrency, fallbackAmount);

//         const updatedPurchase = await db.liveClassPurchase.update({
//           where: { id: purchase.id },
//           data: {
//             status: "COMPLETED",
//             isActive: true,
//             transactionId: transaction_id,
//             flwRef: flw_ref,
//             startDate: new Date(),
//             endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//             currency: fallbackCurrency,
//             amount: fallbackAmount,
//             formattedAmount,
//           },
//         });

//         return NextResponse.json({ status: "success", message: "DEV fallback updated purchase" });
//       }

//       return NextResponse.json({ error: "Could not verify transaction" }, { status: 400 });
//     }

//     const realStatus = flwTxn.status;
//     const realCurrency = flwTxn.currency || data.currency || purchase.currency || "NGN";
//     const realAmount = flwTxn.amount || data.amount || purchase.amount || 0;
//     const realTransactionId = flwTxn.id || flwTxn.transaction_id;
//     const realFlwRef = flwTxn.flw_ref;
//     const formattedAmount = formatCurrency(realCurrency, realAmount);

//     const supportedCurrencies = Array.from(new Set(Object.values(countryPricing).map(p => p.currency)));
//     if (!supportedCurrencies.includes(realCurrency)) {
//       console.warn("[WEBHOOK] Unsupported currency received:", realCurrency);
//     }

//     await db.liveClassPurchase.update({
//       where: { id: purchase.id },
//       data: {
//         status: realStatus === "successful" ? "COMPLETED" : "FAILED",
//         isActive: realStatus === "successful",
//         transactionId: realTransactionId,
//         flwRef: realFlwRef,
//         startDate: new Date(),
//         endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//         currency: realCurrency,
//         amount: realAmount,
//         formattedAmount,
//       },
//     });

//     return NextResponse.json({ status: "success", message: "Purchase updated successfully" });
//   } catch (error) {
//     console.error("[WEBHOOK] Error processing webhook:", error);
//     return NextResponse.json({ status: "error", code: 500, message: "Internal server error" }, { status: 500 });
//   }
// }







import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import fetch from "node-fetch";
import { countryPricing } from "@/lib/countryPricing";

// Fetch verified Flutterwave transaction details
async function getFlutterwaveTransaction(tx_ref: string) {
  const secretKey = process.env.FLW_SECRET_KEY;
  const url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to fetch transaction from Flutterwave");
  const data = await res.json();
  return data.data;
}

export async function POST(req: Request) {
  try {
    // Validate secret hash
    const secretHashHeader = req.headers.get("verif-hash");
    const expectedHash = process.env.FLW_SECRET_HASH;

    console.log("[WEBHOOK] Expected hash from env:", expectedHash);
    console.log("[WEBHOOK] Received hash from Flutterwave:", secretHashHeader);
    console.log("[WEBHOOK] All headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

    if (process.env.NODE_ENV === "production") {
      if (!secretHashHeader || secretHashHeader !== expectedHash) {
        console.warn("[WEBHOOK] Invalid or missing secret hash");
        return new NextResponse("Unauthorized", { status: 401 });
      }
    } else {
      if (!secretHashHeader || secretHashHeader !== expectedHash) {
        console.warn("[WEBHOOK][DEV MODE] Invalid or missing secret hash, bypassing for local testing");
      }
    }

    const rawBody = await req.text();
    console.log("[WEBHOOK] Raw request body:", rawBody);

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("[WEBHOOK] Failed to parse JSON body:", parseError);
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    // Extract fields
    const data = body.data || body;
    let { status, tx_ref, flw_ref } = data;
    let transaction_id = data.id || data.transaction_id;

    if ((!tx_ref || tx_ref === "") && transaction_id && typeof transaction_id === "string") {
      const parts = transaction_id.split("-");
      if (parts.length > 1) tx_ref = parts.slice(0, -1).join("-");
    }

    if (!status || !tx_ref || !transaction_id) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    let purchase = await db.liveClassPurchase.findFirst({
      where: { txRef: tx_ref },
      include: { liveClass: true },
    });

    if (!purchase) {
      const parts = tx_ref.split("-");
      if (parts.length >= 1) {
        const liveClassId = parts[0];
        purchase = await db.liveClassPurchase.findFirst({
          where: { txRef: { startsWith: liveClassId } },
          include: { liveClass: true },
        });
      }
    }

    if (!purchase) {
      console.error("[WEBHOOK] Purchase not found for tx_ref:", tx_ref);
      return NextResponse.json({ status: "error", code: 404, message: "Purchase not found" }, { status: 404 });
    }

    if (purchase.status === "COMPLETED" && purchase.isActive) {
      console.log("[WEBHOOK] Purchase already completed and active:", purchase.id);
      return NextResponse.json({ status: "success", message: "Purchase already completed" });
    }

    // Verify transaction with Flutterwave
    let flwTxn;
    try {
      flwTxn = await getFlutterwaveTransaction(tx_ref);
    } catch (err) {
      console.error("[WEBHOOK] Failed to fetch transaction from Flutterwave:", err);

      // Allow fallback in dev mode
      if (process.env.NODE_ENV !== "production" && status === "successful") {
        const fallbackAmount = data.amount;
        const fallbackCurrency = data.currency;

        const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        const updatedPurchase = await db.liveClassPurchase.update({
          where: { id: purchase.id },
          data: {
            status: "COMPLETED",
            isActive: true,
            transactionId: transaction_id,
            flwRef: flw_ref,
            startDate: new Date(),
            endDate: ninetyDaysFromNow,
            currency: fallbackCurrency || purchase.currency,
            amount: fallbackAmount || purchase.amount,
          },
        });

        return NextResponse.json({ status: "success", message: "DEV fallback: Purchase updated without FLW verification" });
      }

      return NextResponse.json({ error: "Could not verify transaction" }, { status: 400 });
    }

    // Extract final values from FLW
    const realStatus = flwTxn.status;
    const realCurrency = flwTxn.currency || data.currency || purchase.currency || "NGN";
    const realAmount = flwTxn.amount || data.amount || purchase.amount || 0;
    const realTransactionId = flwTxn.id || flwTxn.transaction_id;
    const realFlwRef = flwTxn.flw_ref;

    // Validate against supported currencies from countryPricing
    const supportedCurrencies = Array.from(new Set(Object.values(countryPricing).map(p => p.currency)));
    if (!supportedCurrencies.includes(realCurrency)) {
      console.warn("[WEBHOOK] Unsupported currency received:", realCurrency);
    }

    console.log("[WEBHOOK] Updating purchase with FLW data:", {
      status: realStatus,
      isActive: realStatus === "successful",
      transactionId: realTransactionId,
      flwRef: realFlwRef,
      currency: realCurrency,
      amount: realAmount,
    });

    const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const updatedPurchase = await db.liveClassPurchase.update({
      where: { id: purchase.id },
      data: {
        status: realStatus === "successful" ? "COMPLETED" : "FAILED",
        isActive: realStatus === "successful",
        transactionId: realTransactionId,
        flwRef: realFlwRef,
        startDate: new Date(),
        endDate: ninetyDaysFromNow,
        currency: realCurrency,
        amount: realAmount,
      },
    });

    console.log("[WEBHOOK] Updated purchase:", updatedPurchase);

    return NextResponse.json({ status: "success", message: "Purchase updated successfully" });
  } catch (error) {
    console.error("[WEBHOOK] Error processing webhook:", error);
    return NextResponse.json({ status: "error", code: 500, message: "Internal server error" }, { status: 500 });
  }
}

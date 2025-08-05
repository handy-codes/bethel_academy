import { PrismaClient } from "@prisma/client";
import fetch from "node-fetch";

const db = new PrismaClient();

async function getFlutterwaveTransaction(
  txRef: string,
  transactionId?: string
) {
  const secretKey = process.env.FLW_SECRET_KEY;

  // Try by txRef first
  let url = `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${txRef}`;
  let res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    const data = await res.json();
    if (data.data) return data.data;
    console.warn("Flutterwave response missing data for txRef:", txRef, data);
  } else {
    const errorData = await res.text();
    console.error(
      "Flutterwave API error response for txRef:",
      txRef,
      errorData
    );
  }

  // If not found and transactionId is available, try by transactionId
  if (transactionId) {
    url = `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`;
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) return data.data;
      console.warn(
        "Flutterwave response missing data for transactionId:",
        transactionId,
        data
      );
    } else {
      const errorData = await res.text();
      console.error(
        "Flutterwave API error response for transactionId:",
        transactionId,
        errorData
      );
    }
  }

  throw new Error(
    `Failed to fetch transaction for ${txRef}${
      transactionId ? ` or ${transactionId}` : ""
    }`
  );
}

function extractTxRefFromTransactionId(transactionId: string): string | null {
  // If transactionId contains a hyphen, assume txRef is the prefix before the last hyphen
  const parts = transactionId.split("-");
  if (parts.length > 1) {
    return parts.slice(0, -1).join("-");
  }
  return null;
}

async function main() {
  const pendingPurchases = await db.liveClassPurchase.findMany({
    where: { status: "PENDING" },
  });

  console.log(`Found ${pendingPurchases.length} pending purchases.`);

  for (const purchase of pendingPurchases) {
    try {
      let txRef = purchase.txRef;
      let transactionId = purchase.transactionId ?? undefined;

      if (!txRef && transactionId) {
        // Try to extract txRef from transactionId
        const extracted = extractTxRefFromTransactionId(transactionId);
        if (extracted) {
          txRef = extracted;
          console.log(
            `Extracted txRef "${txRef}" from transactionId "${transactionId}"`
          );
        }
      }

      if (!txRef) {
        console.warn(
          `Skipping purchase ${purchase.id}: txRef is null and could not be extracted`
        );
        continue;
      }

      // Try both txRef and transactionId if available
      let flwTxn: any;
      try {
        flwTxn = await getFlutterwaveTransaction(txRef, transactionId);
      } catch (err) {
        // If failed, and transactionId exists, try extracting txRef from transactionId and try again
        if (transactionId) {
          const extracted = extractTxRefFromTransactionId(transactionId);
          if (extracted && extracted !== txRef) {
            try {
              flwTxn = await getFlutterwaveTransaction(
                extracted,
                transactionId
              );
              txRef = extracted;
            } catch (err2) {
              console.error(
                `Error fetching with extracted txRef for purchase ${purchase.id}:`,
                err2
              );
              continue;
            }
          } else {
            console.error(`Error processing purchase ${purchase.id}:`, err);
            continue;
          }
        } else {
          console.error(`Error processing purchase ${purchase.id}:`, err);
          continue;
        }
      }

      if (!flwTxn) {
        console.warn(`No Flutterwave transaction found for txRef: ${txRef}`);
        continue;
      }

      const realStatus = flwTxn.status;
      const realCurrency = flwTxn.currency;
      const realTransactionId = flwTxn.id || flwTxn.transaction_id;
      const realFlwRef = flwTxn.flw_ref;

      // Only update if status is successful
      if (realStatus === "successful") {
        await db.liveClassPurchase.update({
          where: { id: purchase.id },
          data: {
            status: "COMPLETED",
            isActive: true,
            transactionId: realTransactionId,
            flwRef: realFlwRef,
            currency: realCurrency,
            startDate: new Date(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            txRef, // update txRef if it was extracted
          },
        });
        console.log(
          `Updated purchase ${purchase.id} to COMPLETED (${realCurrency}) [txRef: ${txRef}]`
        );
      } else {
        console.log(
          `Purchase ${purchase.id} is not successful (status: ${realStatus}) [txRef: ${txRef}]`
        );
      }
    } catch (err) {
      console.error(`Error processing purchase ${purchase.id}:`, err);
    }
  }

  await db.$disconnect();
}

async function inspectPurchases(studentId: string, liveClassId: string) {
  const purchases = await db.liveClassPurchase.findMany({
    where: {
      studentId,
      liveClassId,
    },
    orderBy: { createdAt: 'desc' },
  });
  if (purchases.length === 0) {
    console.log('No purchases found for this user and class.');
  } else {
    purchases.forEach((purchase, idx) => {
      console.log(`--- Purchase #${idx + 1} ---`);
      console.dir(purchase, { depth: null });
    });
  }
}

// Replace with the actual IDs you want to inspect
const studentId = '71a9eea9-ba11-4ba0-b9f2-bacc1c06f45f';
const liveClassId = '7963a445-66b2-43c2-ad6f-1e1b3ceb61ca';

inspectPurchases(studentId, liveClassId)
  .catch((e) => {
    console.error('Error inspecting purchases:', e);
  })
  .finally(async () => {
    await db.$disconnect();
  });

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

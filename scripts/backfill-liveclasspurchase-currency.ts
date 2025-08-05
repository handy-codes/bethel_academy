import { PrismaClient } from "@prisma/client";

// Import your countryPricing map
import { countryPricing } from "../lib/countryPricing";

const prisma = new PrismaClient();

async function main() {
  const purchases = await prisma.liveClassPurchase.findMany();
  let updated = 0;

  for (const purchase of purchases) {
    // Skip if already has a valid currency
    if (purchase.currency && purchase.currency.length === 3) continue;

    // Try to match by amount
    let detectedCurrency: string | undefined = undefined;
    for (const [code, { amount, currency }] of Object.entries(countryPricing)) {
      if (purchase.amount === amount) {
        detectedCurrency = currency;
        break;
      }
    }
    // Fallback to USD if not found
    if (!detectedCurrency) detectedCurrency = "USD";

    await prisma.liveClassPurchase.update({
      where: { id: purchase.id },
      data: { currency: detectedCurrency },
    });
    updated++;
    console.log(`Updated purchase ${purchase.id} to currency ${detectedCurrency}`);
  }

  console.log(`Backfill complete. Updated ${updated} purchases.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
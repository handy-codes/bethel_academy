import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const prisma = new PrismaClient();

async function cleanup() {
  await prisma.$disconnect();
}

async function main() {
  try {
    const categories = [
      {
        name: "IT & Software",
        subCategories: {
          create: [
            { name: "Web Development" },
            { name: "Data Science" },
            { name: "Cybersecurity" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Business",
        subCategories: {
          create: [
            { name: "E-Commerce" },
            { name: "Marketing" },
            { name: "Finance" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Design",
        subCategories: {
          create: [
            { name: "Graphic Design" },
            { name: "3D & Animation" },
            { name: "Interior Design" },
            { name: "Others" },
          ],
        },
      },
      {
        name: "Health",
        subCategories: {
          create: [
            { name: "Fitness" },
            { name: "Yoga" },
            { name: "Nutrition" },
            { name: "Others" },
          ],
        },
      },
    ];

    process.stdout.write("Starting database cleanup...\n");
    
    try {
      // First delete courses that reference subcategories
      await prisma.course.deleteMany({});
      process.stdout.write("[OK] Deleted existing courses\n");
      
      // Then delete subcategories
      await prisma.subCategory.deleteMany({});
      process.stdout.write("[OK] Deleted existing subcategories\n");
      
      // Finally delete categories
      await prisma.category.deleteMany({});
      process.stdout.write("[OK] Deleted existing categories\n");
      
      // Delete levels
      await prisma.level.deleteMany({});
      process.stdout.write("[OK] Deleted existing levels\n");
    } catch (error: any) {
      process.stderr.write(`Error during cleanup: ${error.message}\n`);
      throw error;
    }

    process.stdout.write("\nStarting data creation...\n");

    try {
      // Sequentially create each category with its subcategories
      for (const category of categories) {
        await prisma.category.create({
          data: {
            name: category.name,
            subCategories: category.subCategories,
          },
          include: {
            subCategories: true,
          },
        });
        process.stdout.write(`[OK] Created category: ${category.name}\n`);
      }

      // Create new levels
      await prisma.level.createMany({
        data: [
          { name: "Beginner" },
          { name: "Intermediate" },
          { name: "Expert" },
          { name: "All levels" },
        ],
      });
      process.stdout.write("[OK] Created levels\n");

      process.stdout.write("\n[SUCCESS] Seeding completed successfully!\n");
      await cleanup();
      return 0;
    } catch (error: any) {
      process.stderr.write(`Error during data creation: ${error.message}\n`);
      throw error;
    }
  } catch (error: any) {
    process.stderr.write(`\n[ERROR] Seeding failed: ${error.message}\n`);
    await cleanup();
    return 1;
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await cleanup();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await cleanup();
  process.exit(0);
});

// Run the script and exit with the appropriate code
main().then((code) => {
  process.exit(code);
});

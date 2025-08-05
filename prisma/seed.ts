import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create system settings
  await prisma.systemSettings.create({
    data: {
      siteName: "TechXOS Academy",
      siteUrl: "https://techxos.com",
      maintenanceMode: false,
      emailNotifications: true,
      studentEnrollmentNotifications: true,
      paymentNotifications: true,
    },
  });

  // Create categories
  const categories = [
    { name: "Programming" },
    { name: "Design" },
    { name: "Business" },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category.name,
      },
    });
  }

  // Create subcategories
  const subcategories = [
    { name: "Web Development", categoryName: "Programming" },
    { name: "Mobile Development", categoryName: "Programming" },
    { name: "UI/UX Design", categoryName: "Design" },
    { name: "Graphic Design", categoryName: "Design" },
    { name: "Digital Marketing", categoryName: "Business" },
  ];

  for (const subcategory of subcategories) {
    const category = await prisma.category.findUnique({
      where: { name: subcategory.categoryName },
    });

    if (category) {
      await prisma.subCategory.create({
        data: {
          name: subcategory.name,
          categoryId: category.id,
        },
      });
    }
  }

  // Create live course categories
  const liveCategories = [
    { id: "frontend", name: "Frontend Development" },
    { id: "backend", name: "Backend Development" },
    { id: "mobile", name: "Mobile Development" },
    { id: "design", name: "UI/UX Design" },
  ];

  for (const category of liveCategories) {
    await prisma.liveCourseCategory.create({
      data: {
        id: category.id,
        name: category.name,
      },
    });
  }

  // Create live course subcategories
  const liveSubcategories = [
    { id: "react", name: "React.js", categoryId: "frontend" },
    { id: "vue", name: "Vue.js", categoryId: "frontend" },
    { id: "node", name: "Node.js", categoryId: "backend" },
    { id: "python", name: "Python", categoryId: "backend" },
    { id: "flutter", name: "Flutter", categoryId: "mobile" },
    { id: "ui-design", name: "UI Design", categoryId: "design" },
  ];

  for (const subcategory of liveSubcategories) {
    await prisma.liveCourseSubCategory.create({
      data: {
        id: subcategory.id,
        name: subcategory.name,
        categoryId: subcategory.categoryId,
      },
    });
  }

  // Create class modes
  const classModes = [
    { mode: "paid" },
    { mode: "free" },
  ];

  for (const mode of classModes) {
    await prisma.classMode.create({
      data: {
        mode: mode.mode,
      },
    });
  }

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
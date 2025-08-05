import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Find any live class with title "Fullstack Development"
    const liveClasses = await prisma.liveClass.findMany({
      where: {
        title: "Fullstack Development"
      }
    });

    // Update each live class to "Software Development"
    for (const liveClass of liveClasses) {
      await prisma.liveClass.update({
        where: { id: liveClass.id },
        data: {
          title: "Software Development"
        }
      });
      console.log(`Updated title for class: ${liveClass.id}`);
    }

    console.log('Successfully updated course titles');
  } catch (error) {
    console.error('Error updating course titles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 
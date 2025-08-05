import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function removeInvalidCourse() {
  const invalidCourseId = '8801e9b6-f6fb-4898-ae63-78d0abc894fc';
  
  try {
    // First check if the course exists
    const course = await prisma.course.findUnique({
      where: { id: invalidCourseId },
      include: {
        sections: true
      }
    });

    if (!course) {
      console.log('Course not found');
      return;
    }

    console.log('Found course:', {
      id: course.id,
      title: course.title,
      sections: course.sections?.length || 0
    });

    // Delete the course (this will cascade delete related records)
    await prisma.course.delete({
      where: { id: invalidCourseId }
    });

    console.log('Successfully removed invalid course');
  } catch (error) {
    console.error('Error removing course:', error);
  } finally {
    await prisma.$disconnect();
  }
}

removeInvalidCourse()
  .then(() => {
    console.log('Operation complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Operation failed:', error);
    process.exit(1);
  }); 
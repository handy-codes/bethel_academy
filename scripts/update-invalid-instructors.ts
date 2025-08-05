import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface Course {
  id: string;
  title: string;
  instructorId: string;
}

interface UpdateResult {
  courseId: string;
  oldInstructorId: string;
  newInstructorId: string;
  newInstructorName: string;
}

interface FailedUpdate {
  courseId: string;
  error: string;
}

async function updateInvalidInstructors() {
  console.log("Starting instructor update process...");
  
  try {
    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        instructorId: true,
      },
    });

    console.log(`Found ${courses.length} courses to check`);

    const updatedCourses: UpdateResult[] = [];
    const failedUpdates: FailedUpdate[] = [];

    for (const course of courses) {
      try {
        // Skip if instructor ID is valid
        if (course.instructorId.startsWith('user_')) {
          try {
            await clerkClient.users.getUser(course.instructorId);
            continue; // Skip valid instructors
          } catch (error) {
            console.log(`Instructor ${course.instructorId} not found in Clerk for course ${course.id}`);
          }
        }

        // Find an active admin user to assign as instructor
        const { data: adminUsers } = await clerkClient.users.getUserList({
          query: "role:admin"
        });

        if (!adminUsers || adminUsers.length === 0) {
          console.log("No admin users found");
          continue;
        }

        const newInstructor = adminUsers[0];
        
        // Update the course with the new instructor ID
        await prisma.course.update({
          where: { id: course.id },
          data: { instructorId: newInstructor.id },
        });

        updatedCourses.push({
          courseId: course.id,
          oldInstructorId: course.instructorId,
          newInstructorId: newInstructor.id,
          newInstructorName: newInstructor.firstName + ' ' + (newInstructor.lastName || '')
        });

        console.log(`Updated course ${course.id} with new instructor ${newInstructor.id}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Failed to update course ${course.id}:`, errorMessage);
        failedUpdates.push({
          courseId: course.id,
          error: errorMessage
        });
      }
    }

    console.log("\nUpdate Results:");
    console.log("--------------");
    console.log(`Total courses checked: ${courses.length}`);
    console.log(`Successfully updated: ${updatedCourses.length}`);
    console.log(`Failed updates: ${failedUpdates.length}`);

    if (updatedCourses.length > 0) {
      console.log("\nUpdated Courses:");
      console.log("---------------");
      updatedCourses.forEach(update => {
        console.log(`Course ID: ${update.courseId}`);
        console.log(`Old Instructor: ${update.oldInstructorId}`);
        console.log(`New Instructor: ${update.newInstructorId} (${update.newInstructorName})`);
        console.log("---");
      });
    }

    if (failedUpdates.length > 0) {
      console.log("\nFailed Updates:");
      console.log("---------------");
      failedUpdates.forEach(failure => {
        console.log(`Course ID: ${failure.courseId}`);
        console.log(`Error: ${failure.error}`);
        console.log("---");
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error during update process:", errorMessage);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateInvalidInstructors()
  .then(() => {
    console.log("Update process complete");
    process.exit(0);
  })
  .catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Update process failed:", errorMessage);
    process.exit(1);
  }); 
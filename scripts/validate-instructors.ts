import { PrismaClient } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

interface Course {
  id: string;
  title: string;
  instructorId: string;
}

interface ValidationResult {
  course: Course;
  error?: string;
  instructorName?: string;
  clerkTraceId?: string;
  clerkErrorCode?: string;
}

async function validateInstructors() {
  console.log("Starting instructor validation...");
  
  try {
    // Get all courses
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        title: true,
        instructorId: true,
      },
    });

    console.log(`Found ${courses.length} courses to validate`);

    const invalidCourses: ValidationResult[] = [];
    const validCourses: ValidationResult[] = [];

    for (const course of courses) {
      try {
        // Check if instructor ID is in correct format
        if (!course.instructorId.startsWith('user_')) {
          console.error(`Invalid instructor ID format for course ${course.id}: ${course.instructorId}`);
          invalidCourses.push({
            course,
            error: 'Invalid ID format',
            clerkErrorCode: 'invalid_format'
          });
          continue;
        }

        // Try to fetch instructor from Clerk
        const instructor = await clerkClient().users.getUser(course.instructorId);
        validCourses.push({
          course,
          instructorName: instructor.fullName || undefined
        });
      } catch (error) {
        let errorMessage = 'Unknown error occurred';
        let clerkTraceId: string | undefined;
        let clerkErrorCode: string | undefined;

        if (error instanceof Error) {
          errorMessage = error.message;
          
          // Extract Clerk-specific error information
          const errorObj = error as any;
          if (errorObj.clerkTraceId) {
            clerkTraceId = errorObj.clerkTraceId;
          }
          if (errorObj.errors?.[0]?.code) {
            clerkErrorCode = errorObj.errors[0].code;
          }
        }

        console.error(`Error fetching instructor for course ${course.id}:`, {
          error: errorMessage,
          traceId: clerkTraceId,
          errorCode: clerkErrorCode
        });

        invalidCourses.push({
          course,
          error: errorMessage,
          clerkTraceId,
          clerkErrorCode
        });
      }
    }

    console.log("\nValidation Results:");
    console.log("------------------");
    console.log(`Total courses: ${courses.length}`);
    console.log(`Valid courses: ${validCourses.length}`);
    console.log(`Invalid courses: ${invalidCourses.length}`);

    if (invalidCourses.length > 0) {
      console.log("\nInvalid Courses:");
      console.log("---------------");
      invalidCourses.forEach(result => {
        console.log(`Course: ${result.course.title}`);
        console.log(`ID: ${result.course.id}`);
        console.log(`Instructor ID: ${result.course.instructorId}`);
        console.log(`Error: ${result.error}`);
        if (result.clerkTraceId) {
          console.log(`Clerk Trace ID: ${result.clerkTraceId}`);
        }
        if (result.clerkErrorCode) {
          console.log(`Clerk Error Code: ${result.clerkErrorCode}`);
        }
        console.log("---");
      });
    }

    if (validCourses.length > 0) {
      console.log("\nValid Courses:");
      console.log("-------------");
      validCourses.forEach(result => {
        console.log(`Course: ${result.course.title}`);
        console.log(`ID: ${result.course.id}`);
        console.log(`Instructor: ${result.instructorName || 'Unknown'}`);
        console.log("---");
      });
    }

    return {
      validCourses,
      invalidCourses
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Error during validation:", errorMessage);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the validation
validateInstructors()
  .then(() => {
    console.log("Validation complete");
    process.exit(0);
  })
  .catch((error) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error("Validation failed:", errorMessage);
    process.exit(1);
  }); 
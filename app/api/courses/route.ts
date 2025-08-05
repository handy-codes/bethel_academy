import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Check if user has required role in database
    const user = await db.liveClassUser.findFirst({
      where: {
        clerkUserId: userId,
        role: {
          in: ["HEAD_ADMIN", "ADMIN", "LECTURER"]
        }
      }
    });

    if (!user) {
      console.error(`[courses_POST] User ${userId} does not have required permissions`);
      return new NextResponse("User does not have required permissions", { status: 403 });
    }

    const { title, categoryId, subCategoryId } = await req.json()

    // Validate required fields
    if (!title || !categoryId || !subCategoryId) {
      console.error("[courses_POST] Missing required fields:", { title, categoryId, subCategoryId });
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Verify category and subcategory exist
    const category = await db.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return new NextResponse("Category not found", { status: 404 });
    }

    const subCategory = await db.subCategory.findUnique({
      where: { id: subCategoryId }
    });

    if (!subCategory) {
      return new NextResponse("Subcategory not found", { status: 404 });
    }

    // Create the course
    const course = await db.course.create({
      data: {
        title,
        categoryId,
        subCategoryId,
        instructorId: userId,
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSES_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
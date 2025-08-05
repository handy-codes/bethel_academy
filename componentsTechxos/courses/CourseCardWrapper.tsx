'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import CourseCard from "./CourseCard";

interface CourseCardWrapperProps {
  course: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    price: number | null;
    isPublished: boolean;
    categoryId: string;
    subCategoryId: string;
    instructorId: string;
    levelId?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    subtitle?: string | null;
  };
}

export default async function CourseCardWrapper({ course }: CourseCardWrapperProps) {
  let level;
  if (course.levelId) {
    level = await db.level.findUnique({
      where: {
        id: course.levelId,
      },
    });
  }

  return <CourseCard course={course} level={level} />;
} 
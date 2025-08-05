'use client';

import { Course, Section } from "@prisma/client";
import Link from "next/link";
import { Progress } from "../ui/progress";
import { usePathname } from "next/navigation";

interface CourseSideBarClientProps {
  course: Course;
  publishedSections: Section[];
  progressPercentage: number;
  purchase: any;
}

const CourseSideBarClient = ({ 
  course, 
  publishedSections, 
  progressPercentage,
  purchase 
}: CourseSideBarClientProps) => {
  const pathname = usePathname();
  const isOverview = pathname === `/courses/${course.id}/overview`;

  return (
    <div className="hidden md:flex flex-col w-64 border-r shadow-md px-3 my-3 text-sm font-medium">
      <h1 className="text-lg font-bold text-center mb-4">{course.title}</h1>
      {purchase && (
        <div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs">{Math.round(progressPercentage)}% completed</p>
        </div>
      )}
      <Link
        href={`/courses/${course.id}/overview`}
        className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isOverview ? 'bg-blue-500 text-white' : ''}`}
      >
        Overview
      </Link>
      <div className="overflow-y-auto max-h-screen flex flex-col text-[16px] font-semibold">
        {publishedSections.map((section) => (
          <Link
            key={section.id}
            href={`/courses/${course.id}/sections/${section.id}`}
            className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3`}
          >
            {section.title}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBarClient; 
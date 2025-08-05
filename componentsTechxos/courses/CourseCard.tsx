'use client';

import { Gem, Loader2, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CourseCardInstructor from "./CourseCardInstructor";

interface CourseCardProps {
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
  level?: {
    name: string;
  } | null;
}

const CourseCard = ({ course, level }: CourseCardProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoading) {
      setIsLoading(true);
      const id = setTimeout(() => {
        router.push(`/courses/${course.id}/overview`);
      }, 800);
      setTimeoutId(id);
    }
  }, [course.id, isLoading, router]);

  const handleLoaderClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsLoading(false);
  }, [timeoutId]);

  return (
    <div
      className="border rounded-lg cursor-pointer bg-[white] text-black w-[320px] group"
      onClick={handleClick}
    >
      <div className="relative w-[320px] h-[180px] overflow-hidden">
      <Image
          src={course.imageUrl || "/image_placeholder.webp"}
        alt={course.title}
          fill
          sizes="320px"
          className="rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-all duration-500">
          {isLoading ? (
            <Loader2 
              className="w-16 h-16 text-white animate-[spin_2s_linear_infinite] transition-all duration-500 cursor-pointer" 
              onClick={handleLoaderClick}
            />
          ) : (
            <PlayCircle className="w-16 h-16 text-white transition-all duration-500" />
          )}
        </div>
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold hover:[#FDAB04]">{course.title}</h2>
        <div className="flex justify-between text-sm font-medium">
          <CourseCardInstructor instructorId={course.instructorId} />
          {level && (
            <div className="flex gap-2">
              <Gem size={20} />
              <p>{level.name}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;








// 'use client';

// import { Gem, PlayCircle } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import CourseCardInstructor from "./CourseCardInstructor";

// interface CourseCardProps {
//   course: {
//     id: string;
//     title: string;
//     description: string | null;
//     imageUrl: string | null;
//     price: number | null;
//     isPublished: boolean;
//     categoryId: string;
//     subCategoryId: string;
//     instructorId: string;
//     levelId?: string | null;
//     createdAt?: Date;
//     updatedAt?: Date;
//     subtitle?: string | null;
//   };
//   level?: {
//     name: string;
//   } | null;
// }

// const CourseCard = ({ course, level }: CourseCardProps) => {
//   return (
//     <Link
//       href={`/courses/${course.id}/overview`}
//       className="border rounded-lg cursor-pointer bg-[white] text-black w-[320px] group"
//     >
//       <div className="relative w-[320px] h-[180px] overflow-hidden">
//         <Image
//           src={course.imageUrl ? course.imageUrl : "/image_placeholder.webp"}
//           alt={course.title}
//           fill
//           className="rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//         <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
//           <PlayCircle className="w-16 h-16 text-white" />
//         </div>
//       </div>
//       <div className="px-4 py-3 flex flex-col gap-2">
//         <h2 className="text-lg font-bold hover:[#FDAB04]">{course.title}</h2>
//         <div className="flex justify-between text-sm font-medium">
//           <CourseCardInstructor />
//           {level && (
//             <div className="flex gap-2">
//               <Gem size={20} />
//               <p>{level.name}</p>
//             </div>
//           )}
//         </div>

//         <p className="text-sm font-bold">NGN {course.price}</p>
//       </div>
//     </Link>
//   );
// };

// export default CourseCard;

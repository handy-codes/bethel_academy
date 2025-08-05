'use client';

import { Course, Section } from "@prisma/client";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SectionMenuProps {
  course: Course & { sections: Section[] };
}

const SectionMenu = ({ course }: SectionMenuProps) => {
  const pathname = usePathname();
  const isOverview = pathname === `/courses/${course.id}/overview`;

  const handleSectionClick = (sectionId: string) => {
    // Force navigation through JS for better mobile handling
    window.location.href = `/courses/${course.id}/sections/${sectionId}`;
  };

  return (
    <div className="relative font-extrabold px-6 py-3 z-20 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button>Chapters</Button>
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className="flex flex-col w-[60vw] sm:w-[300px] p-0 z-50 fixed inset-0 border-r bg-gray-100"
        >
          <Link
            href={`/courses/${course.id}/overview`}
            className={`p-3 m-3 w-fit rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isOverview ? 'bg-blue-500 text-white' : ''}`}
          >
            Overview
          </Link>
          <div className="overflow-y-auto flex-1 p-4">
            <h3 className="font-bold text-gray-900 mb-2">Chapters</h3>
            <div className="flex flex-col gap-2 font-medium text-[16px]">
              {course.sections
                .sort((a, b) => a.position - b.position) 
                .map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className="text-left block w-full p-3 rounded-lg hover:bg-gray-100 text-gray-900 transition-colors cursor-pointer"
                  >
                    {section.title}
                  </button>
                ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SectionMenu;



// 'use client';

// import { Course, Section } from "@prisma/client";
// import React from "react";
// import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
// import { Button } from "../ui/button";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// interface SectionMenuProps {
//   course: Course & { sections: Section[] };
// }

// const SectionMenu = ({ course }: SectionMenuProps) => {
//   const pathname = usePathname();
//   const isOverview = pathname === `/courses/${course.id}/overview`;

//   return (
//     <div className="z-60 md:hidden">
//       <Sheet>
//         <SheetTrigger>
//           <Button>Chapters</Button>
//         </SheetTrigger>
//         <SheetContent className="flex flex-col">
//           <Link
//             href={`/courses/${course.id}/overview`}
//             className={`p-3 rounded-lg hover:bg-[#FFF8EB] text-[16px] mt-3 ${isOverview ? 'bg-blue-500 text-white' : ''}`}
//           >
//             Overview
//           </Link>
//           <div className="overflow-y-auto max-h-screen flex flex-col gap-1 font-semibold text-[16px]">
//             {course.sections
//               .sort((a, b) => a.position - b.position) 
//               .map((section) => (
//                 <Link
//                   key={section.id}
//                   href={`/courses/${course.id}/sections/${section.id}`}
//                   className="p-3 rounded-lg hover:bg-[#FFF8EB] mt-1"
//                 >
//                   {section.title}
//                 </Link>
//               ))}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// };

// export default SectionMenu;

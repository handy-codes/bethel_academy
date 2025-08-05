'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

interface CourseCardInstructorProps {
  instructorId: string;
}

interface Instructor {
  id: string;
  fullName: string;
  imageUrl: string;
  email: string | null;
}

const CourseCardInstructor = ({ instructorId }: CourseCardInstructorProps) => {
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchInstructor = async () => {
      try {
        const response = await fetch(`/api/instructor/${instructorId}`);
        if (response.ok) {
          const data = await response.json();
          setInstructor(data);
        }
      } catch (error) {
        console.error('Error fetching instructor:', error);
      }
    };

    if (instructorId) {
      fetchInstructor();
    }
  }, [instructorId]);

  const handleImageError = (e: any) => {
    console.log('Image failed to load:', e);
    setImageError(true);
  };

  if (!instructor) {
    return (
      <div className="flex gap-2 items-center">
        <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
          <Image
            src="/owo-blow.jpg"
            alt="Instructor photo"
            fill
            className="object-cover"
            onError={handleImageError}
            priority
          />
        </div>
        <p>Emeka Owo</p>
      </div>
    );
  }
  
  return (
    <div className="flex gap-2 items-center">
      <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
      <Image
          src={imageError ? "/avatar_placeholder.jpg" : "/owo-blow.jpg"}
          alt={instructor.fullName || "Instructor photo"}
          fill
          className="object-cover"
          onError={handleImageError}
          priority
      />
      </div>
      <p>{instructor.fullName || "Emeka Owo"}</p>
    </div>
  );
};

export default CourseCardInstructor; 
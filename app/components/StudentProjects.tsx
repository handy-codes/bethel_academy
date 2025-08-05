// components/StudentProjects.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const StudentProjects = () => {
  const projects = [
    {
      title: 'Solar-Powered Irrigation System',
      team: 'Engineering Students',
      description: 'Automated irrigation solution for small-scale farmers using solar energy',
    },
    {
      title: 'Nigerian Language Learning App',
      team: 'Computer Science',
      description: 'Mobile app for learning Yoruba, Igbo, and Hausa with voice recognition',
    },
    {
      title: 'Medical Diagnosis AI',
      team: 'AI Research Group',
      description: 'AI-powered diagnostic tool for common tropical diseases',
    },
    {
      title: 'Plastic Recycling Innovation',
      team: 'Environmental Science',
      description: 'New method for converting plastic waste into construction materials',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Student Projects</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Innovative solutions developed by our talented students
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop
          className="pb-12"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2">
                <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                <div className="p-6">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block">
                    {project.team}
                  </span>
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">{project.title}</h3>
                  <p className="text-indigo-700 mb-6">{project.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <button className="text-indigo-600 font-medium hover:text-indigo-800 text-sm">
                      View Project Details
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full">
                      Support Project
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Explore All Projects
          </button>
        </div>
      </div>
    </section>
  );
};

export default StudentProjects;
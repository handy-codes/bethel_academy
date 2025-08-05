// components/FeaturedTutorials.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const FeaturedTutorials = () => {
  const tutorials = [
    {
      title: 'Mastering Calculus Fundamentals',
      instructor: 'Dr. Femi Adekoya',
      duration: '12 hours',
      level: 'Intermediate',
      rating: 4.9,
    },
    {
      title: 'Python Programming for Beginners',
      instructor: 'Prof. Adaobi Nwosu',
      duration: '20 hours',
      level: 'Beginner',
      rating: 4.8,
    },
    {
      title: 'Organic Chemistry Reactions',
      instructor: 'Dr. Chinedu Okoro',
      duration: '15 hours',
      level: 'Advanced',
      rating: 4.7,
    },
    {
      title: 'Financial Accounting Principles',
      instructor: 'Dr. Bola Williams',
      duration: '18 hours',
      level: 'Intermediate',
      rating: 4.9,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Featured Tutorials</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Top-rated learning resources selected by our academic team
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000 }}
          loop
          className="pb-12"
        >
          {tutorials.map((tutorial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2">
                <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                      {tutorial.level}
                    </span>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-indigo-900 font-bold ml-1">{tutorial.rating}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-indigo-900 mb-3">{tutorial.title}</h3>
                  <p className="text-indigo-600 mb-4">By {tutorial.instructor}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-indigo-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{tutorial.duration}</span>
                    </div>
                    
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedTutorials;
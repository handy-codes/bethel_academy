'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Leadership = () => {
  const leaders = [
    {
      name: 'Dr. Adebayo Ojo',
      title: 'Founder & Chancellor',
      bio: 'Visionary educator with 30+ years experience in academic leadership across Africa.',
    },
    {
      name: 'Prof. Chidinma Nwosu',
      title: 'Vice Chancellor',
      bio: 'Renowned scholar in Educational Psychology and former Dean of Faculty at University of Lagos.',
    },
    {
      name: 'Dr. Femi Adekunle',
      title: 'Dean of Academics',
      bio: 'Expert in curriculum development and educational technology with multiple international awards.',
    },
    {
      name: 'Mrs. Grace Okon',
      title: 'Dean of Student Affairs',
      bio: 'Dedicated to student welfare and holistic development with 15 years of experience.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Leadership Team</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Meet our experienced leadership team guiding Bethel Academy
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
          autoplay={{ delay: 5000 }}
          loop
          className="pb-12"
        >
          {leaders.map((leader, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2">
                <div className="bg-gray-200 border-2 border-dashed w-full h-64" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-indigo-900">{leader.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{leader.title}</p>
                  <p className="text-indigo-700">{leader.bio}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Leadership;
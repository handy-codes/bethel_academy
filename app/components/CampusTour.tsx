// components/CampusTour.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const CampusTour = () => {
  const tourStops = [
    {
      id: 1,
      title: 'Main Academic Building',
      description: 'Home to our lecture halls, faculty offices, and administrative center.',
    },
    {
      id: 2,
      title: 'Innovation Hub',
      description: 'State-of-the-art technology center with labs for robotics, AI, and software development.',
    },
    {
      id: 3,
      title: 'Library & Research Center',
      description: 'Over 100,000 volumes and digital resources with 24/7 study spaces.',
    },
    {
      id: 4,
      title: 'Student Center',
      description: 'Hub for student activities, clubs, and dining facilities.',
    },
    {
      id: 5,
      title: 'Sports Complex',
      description: 'Olympic-sized swimming pool, basketball courts, and football field.',
    },
    {
      id: 6,
      title: 'Green Campus',
      description: 'Sustainable gardens and eco-friendly architecture throughout campus.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Campus Tour</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Explore our beautiful campus through a virtual tour
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Swiper
              modules={[Navigation, Pagination, Autoplay, EffectFade]}
              effect={'fade'}
              fadeEffect={{ crossFade: true }}
              spaceBetween={0}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop
              className="rounded-2xl shadow-xl overflow-hidden h-96"
            >
              {tourStops.map((stop) => (
                <SwiperSlide key={stop.id}>
                  <div className="relative w-full h-full">
                    {/* Placeholder for image */}
                    <div className="bg-gray-200 border-2 border-dashed w-full h-full" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                      <h3 className="text-xl font-bold">{stop.title}</h3>
                      <p>{stop.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-indigo-900 mb-6">Experience Campus Life</h3>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">Virtual Tour</h4>
                    <p className="text-indigo-700">Explore our campus from anywhere in the world with our 360° virtual tour experience.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-amber-100 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">Video Walkthroughs</h4>
                    <p className="text-indigo-700">Student-led tours showing daily life in classrooms, dorms, and social spaces.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-indigo-900 mb-1">In-Person Visits</h4>
                    <p className="text-indigo-700">Schedule a guided campus tour to experience Bethel Academy firsthand.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105">
                  Start Virtual Tour
                </button>
                <button className="bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium py-3 px-8 rounded-full transition-all">
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusTour;
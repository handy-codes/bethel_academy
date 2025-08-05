// components/AlumniNetwork.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const AlumniNetwork = () => {
  const alumni = [
    {
      name: 'Dr. Ada Nwosu',
      role: 'Chief Medical Officer, LUTH',
      quote: 'Bethel Academy gave me the foundation to excel in medicine and serve my community.',
      year: '2005',
    },
    {
      name: 'Emeka Okoro',
      role: 'CTO, Paystack',
      quote: 'The innovation mindset I developed at Bethel Academy drives my work in fintech today.',
      year: '2012',
    },
    {
      name: 'Funke Adebayo',
      role: 'Founder, Green Farms Initiative',
      quote: 'My social enterprise started as a class project at Bethel Academy.',
      year: '2017',
    },
    {
      name: 'Chinedu Obi',
      role: 'Senior Engineer, SpaceX',
      quote: 'The rigorous engineering program prepared me for challenges at the highest level.',
      year: '2010',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Alumni Network</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Join our global community of over 10,000 successful graduates
          </p>
        </div>
        
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          navigation
          autoplay={{ delay: 7000 }}
          loop
          className="pb-16"
        >
          {alumni.map((alum, index) => (
            <SwiperSlide key={index}>
              <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 h-full">
                <div className="flex items-start mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{alum.name}</h3>
                    <p className="text-blue-200">{alum.role}</p>
                    <p className="text-amber-400 mt-1">Class of {alum.year}</p>
                  </div>
                </div>
                <p className="text-lg italic mb-6">&lsquo;{alum.quote}&rsquo;</p>
                
                <div className="flex items-center">
                  <button className="text-white border border-white hover:bg-white/10 px-4 py-2 rounded-full text-sm mr-4">
                    Connect
                  </button>
                  <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 px-4 py-2 rounded-full text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-blue-800/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">10,000+</div>
            <p className="text-blue-200">Alumni Worldwide</p>
          </div>
          
          <div className="bg-blue-800/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">45+</div>
            <p className="text-blue-200">Countries Represented</p>
          </div>
          
          <div className="bg-blue-800/30 backdrop-blur-sm p-6 rounded-2xl border border-blue-500/30 text-center">
            <div className="text-4xl font-bold text-amber-400 mb-2">200+</div>
            <p className="text-blue-200">Events Per Year</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Join Alumni Network
          </button>
        </div>
      </div>
    </section>
  );
};

export default AlumniNetwork;
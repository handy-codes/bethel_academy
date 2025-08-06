// components/Testimonials.tsx
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Chinwe Okonkwo',
      role: 'Computer Science Graduate',
      content: 'Bethel Academy provided me with the skills and network to land my dream job at a top tech firm. The hands-on projects and industry connections were invaluable.',
      image: '',
    },
    {
      id: 2,
      name: 'Emeka Adebayo',
      role: 'Business Administration',
      content: 'The entrepreneurship program transformed how I approach business. I launched my startup during my final year and now employ 15 people.',
      image: '',
    },
    {
      id: 3,
      name: 'Funke Balogun',
      role: 'Parent of Engineering Student',
      content: 'As a parent, I appreciate the focus on both academic excellence and character development. My son has grown into a responsible, innovative thinker.',
      image: '',
    },
    {
      id: 4,
      name: 'Tunde Williams',
      role: 'Alumni, Class of 2018',
      content: 'The mentorship I received at Bethel Academy shaped my career path. I still reach out to my professors for advice years after graduation.',
      image: '/girl.png',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Student & Parent Testimonials</h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Hear from our community about their Bethel Academy experience
          </p>
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 7000 }}
          loop
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-2xl border border-blue-500/30 h-full">
                <div className="flex items-start mb-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{testimonial.name}</h3>
                    <p className="text-blue-200">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-lg italic">&quot;{testimonial.content}&quot;</p>
                <div className="flex mt-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
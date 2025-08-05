// components/Gallery.tsx
'use client';

import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Gallery = () => {
  const galleryImages = [
    { id: 1, alt: 'Campus building' },
    { id: 2, alt: 'Students in library' },
    { id: 3, alt: 'Science lab' },
    { id: 4, alt: 'Sports facility' },
    { id: 5, alt: 'Graduation ceremony' },
    { id: 6, alt: 'Cafeteria' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Campus Life</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Experience our vibrant campus community and state-of-the-art facilities
          </p>
        </div>
        
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            loop
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                  {/* Placeholder for image */}
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
                  <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold">{image.alt}</h3>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
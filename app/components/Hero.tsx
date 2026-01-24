"use client";

// components/Hero.tsx
import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background Image/Video Container */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: 'url("https://i.ibb.co/WrQ2dZT/bethel-students.jpg")',
          }}
        ></div>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
          Shaping <span className="text-amber-400">Future</span> Leaders
        </h1>
        <p className="text-xl md:text-2xl text-[white] max-w-3xl mx-auto mb-10 animate-fadeIn delay-150">
          And Championing Education in a Digital World!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn delay-300">
          <a 
            href="/college"
            className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 text-center"
          >
            Explore Programs
          </a>
          <a 
            href="/tutorials"
            className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-all text-center"
          >
            Virtual Tour
          </a>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-4 border-white flex justify-center p-1">
          <div className="w-2 h-2 bg-white rounded-full animate-scroll"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
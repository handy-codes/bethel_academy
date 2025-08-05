// components/Hero.tsx
import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 z-10"></div>
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-students-studying-together-38758-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
          Shaping <span className="text-amber-400">Future</span> Leaders
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-10 animate-fadeIn delay-150">
          Nigeria&apos;s premier institution for academic excellence and innovation. Empowering students to transform their dreams into reality.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeIn delay-300">
          <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Explore Programs
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-all">
            Virtual Tour
          </button>
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
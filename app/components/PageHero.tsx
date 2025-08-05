import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  description: string;
}

const PageHero = ({ title, subtitle, description }: PageHeroProps) => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-700 to-blue-800">
      <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>
      <div className="container mx-auto px-4 relative z-20 text-center">
        <h2 className="text-amber-400 font-bold text-lg md:text-xl mb-3 animate-fadeIn">
          {subtitle}
        </h2>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fadeIn">
          {title}
        </h1>
        <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10 animate-fadeIn delay-150">
          {description}
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fadeIn delay-300">
          <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Apply Now
          </button>
          <button className="bg-transparent border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-all">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default PageHero;
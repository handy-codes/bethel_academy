// components/Programs.tsx
import React from 'react';

const Programs = () => {
  const programs = [
    {
      title: 'Engineering & Technology',
      description: 'Cutting-edge programs in robotics, AI, and sustainable engineering.',
      icon: '⚙️'
    },
    {
      title: 'Business & Entrepreneurship',
      description: 'Develop leadership skills and business acumen for the modern economy.',
      icon: '💼'
    },
    {
      title: 'Creative Arts & Design',
      description: 'Explore digital media, graphic design, and performing arts.',
      icon: '🎨'
    },
    {
      title: 'Health Sciences',
      description: 'Programs in medicine, public health, and biotechnology.',
      icon: '⚕️'
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Academic Programs</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Offering innovative programs designed for the careers of tomorrow
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="p-8">
                <div className="text-5xl mb-6">{program.icon}</div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">{program.title}</h3>
                <p className="text-indigo-700 mb-6">{program.description}</p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  Explore program
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
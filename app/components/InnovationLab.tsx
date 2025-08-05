// components/InnovationLab.tsx
import React from 'react';

const InnovationLab = () => {
  const features = [
    {
      title: 'AI & Machine Learning',
      description: 'Powerful computing resources for deep learning projects',
      icon: '🤖',
    },
    {
      title: '3D Printing & Prototyping',
      description: 'Rapid prototyping facilities for engineering students',
      icon: '🖨️',
    },
    {
      title: 'VR/AR Development',
      description: 'Virtual and augmented reality equipment for immersive experiences',
      icon: '👓',
    },
    {
      title: 'Robotics Workshop',
      description: 'Dedicated space for building and programming robots',
      icon: '⚙️',
    },
    {
      title: 'Data Visualization',
      description: 'Advanced tools for big data analysis and presentation',
      icon: '📊',
    },
    {
      title: 'Biotech Lab',
      description: 'Cutting-edge equipment for biotechnology research',
      icon: '🧬',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-900 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Innovation Lab</h2>
            <p className="text-xl text-blue-200 mb-8">
              Our state-of-the-art innovation hub is where ideas become reality. Equipped with cutting-edge technology and staffed with expert mentors, this space empowers students to solve real-world problems.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-blue-800/30 backdrop-blur-sm p-4 rounded-lg border border-blue-500/30">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-bold mb-1">{feature.title}</h3>
                  <p className="text-blue-200 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
            
            <button className="mt-8 bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Book Lab Tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovationLab;
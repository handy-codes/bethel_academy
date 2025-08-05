// components/Stats.tsx
import React from 'react';

const Stats = () => {
  const stats = [
    { value: '95%', label: 'Graduation Rate' },
    { value: '150+', label: 'Expert Faculty' },
    { value: '10,000+', label: 'Alumni Network' },
    { value: '98%', label: 'Employment Rate' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center p-6 bg-indigo-50 rounded-xl transform transition-all hover:scale-105 hover:shadow-lg"
            >
              <div className="text-4xl font-bold text-indigo-700 mb-2">{stat.value}</div>
              <div className="text-indigo-900 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
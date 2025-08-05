'use client';

import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

const ExchangePrograms = () => {
  const [categories] = useState({
    'International': [
      {
        id: 1,
        title: 'Global Student Exchange',
        description: 'Study abroad opportunities with partner universities in 20+ countries.',
        duration: '1-2 Semesters',
        locations: ['USA', 'UK', 'Canada', 'Germany', 'Australia'],
      },
      {
        id: 2,
        title: 'African Leadership Program',
        description: 'Pan-African exchange focusing on leadership and development.',
        duration: '1 Semester',
        locations: ['Ghana', 'South Africa', 'Kenya', 'Rwanda'],
      },
    ],
    'Industry': [
      {
        id: 1,
        title: 'Corporate Immersion Program',
        description: 'Work-study program with top Nigerian companies.',
        duration: '3-6 Months',
        locations: ['Lagos', 'Abuja', 'Port Harcourt'],
      },
      {
        id: 2,
        title: 'Tech Internship Exchange',
        description: 'Hands-on experience with leading tech companies.',
        duration: '3 Months',
        locations: ['Yaba Tech Hub', 'Lekki Innovation Zone'],
      },
    ],
    'Research': [
      {
        id: 1,
        title: 'Academic Research Fellowship',
        description: 'Collaborative research with international universities.',
        duration: '6-12 Months',
        locations: ['MIT', 'Cambridge', 'ETH Zurich'],
      },
    ],
  });

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Exchange Programs</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Global opportunities for our students to learn and grow
          </p>
        </div>
        
        <Tab.Group>
          <Tab.List className="flex p-1 space-x-1 bg-indigo-100 rounded-xl mb-12 max-w-2xl mx-auto">
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }: { selected: boolean }) =>
                  `w-full py-3 text-sm font-medium leading-5 rounded-lg
                  ${
                    selected
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 hover:bg-indigo-200'
                  }`
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2">
            {Object.values(categories).map((programs, idx) => (
              <Tab.Panel
                key={idx}
                className="bg-white rounded-xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {programs.map((program) => (
                    <div 
                      key={program.id} 
                      className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100"
                    >
                      <h3 className="text-xl font-bold text-indigo-900 mb-3">{program.title}</h3>
                      <p className="text-indigo-700 mb-4">{program.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                          {program.duration}
                        </span>
                      </div>
                      <div className="mb-6">
                        <h4 className="font-medium text-indigo-900 mb-2">Available Locations:</h4>
                        <div className="flex flex-wrap gap-2">
                          {program.locations.map((location, i) => (
                            <span 
                              key={i}
                              className="bg-white text-indigo-800 border border-indigo-200 text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {location}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-full transition-all">
                        Learn More
                      </button>
                    </div>
                  ))}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </section>
  );
};

export default ExchangePrograms;
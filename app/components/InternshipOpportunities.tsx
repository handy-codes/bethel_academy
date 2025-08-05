// components/InternshipOpportunities.tsx
'use client';

import React, { useState } from 'react';

const InternshipOpportunities = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  const internships = [
    {
      id: 1,
      title: 'Software Engineering Intern',
      company: 'Flutterwave',
      location: 'Lagos, Nigeria',
      duration: '3 months',
      type: 'Tech',
      paid: true,
    },
    {
      id: 2,
      title: 'Marketing Intern',
      company: 'MTN Nigeria',
      location: 'Abuja, Nigeria',
      duration: '6 months',
      type: 'Business',
      paid: true,
    },
    {
      id: 3,
      title: 'Biotech Research Intern',
      company: 'Nigerian Institute of Medical Research',
      location: 'Yaba, Lagos',
      duration: '4 months',
      type: 'Science',
      paid: false,
    },
    {
      id: 4,
      title: 'Mechanical Engineering Intern',
      company: 'Dangote Group',
      location: 'Ogun State',
      duration: '6 months',
      type: 'Engineering',
      paid: true,
    },
    {
      id: 5,
      title: 'UI/UX Design Intern',
      company: 'Andela',
      location: 'Remote',
      duration: '3 months',
      type: 'Tech',
      paid: true,
    },
    {
      id: 6,
      title: 'Finance Intern',
      company: 'KPMG Nigeria',
      location: 'Victoria Island, Lagos',
      duration: '6 months',
      type: 'Business',
      paid: true,
    },
  ];

  const filteredInternships = activeTab === 'all' 
    ? internships 
    : internships.filter(internship => internship.type.toLowerCase() === activeTab);

  const tabs = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'tech', label: 'Tech' },
    { id: 'business', label: 'Business' },
    { id: 'engineering', label: 'Engineering' },
    { id: 'science', label: 'Science' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Internship Opportunities</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Gain real-world experience with top companies across Nigeria
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInternships.map((internship) => (
            <div 
              key={internship.id} 
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm transform transition-all hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    internship.paid ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {internship.paid ? 'Paid Position' : 'Unpaid Position'}
                  </span>
                </div>
                <span className="text-sm text-indigo-600">{internship.duration}</span>
              </div>
              
              <h3 className="text-xl font-bold text-indigo-900 mb-2">{internship.title}</h3>
              
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                <div className="ml-3">
                  <p className="font-medium text-indigo-800">{internship.company}</p>
                  <p className="text-sm text-indigo-600">{internship.location}</p>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <button className="text-indigo-600 font-medium hover:text-indigo-800 text-sm">
                  View Details
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105">
            View All Internships
          </button>
        </div>
      </div>
    </section>
  );
};

export default InternshipOpportunities;
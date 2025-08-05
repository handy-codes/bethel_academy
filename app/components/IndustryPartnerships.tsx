// components/IndustryPartnerships.tsx
import React from 'react';

const IndustryPartnerships = () => {
  const partnerships = [
    {
      name: 'Google Africa',
      description: 'Joint research in AI and machine learning applications for African contexts',
      benefits: ['Student internships', 'Research grants', 'Cloud computing credits'],
    },
    {
      name: 'Andela',
      description: 'Talent development program for software engineering students',
      benefits: ['Mentorship programs', 'Job placements', 'Project collaborations'],
    },
    {
      name: 'Dangote Group',
      description: 'Industry-academic collaboration in engineering and business',
      benefits: ['Scholarships', 'Plant tours', 'Executive lectures'],
    },
    {
      name: 'Flutterwave',
      description: 'Fintech innovation lab and startup incubator',
      benefits: ['Hackathons', 'Startup funding', 'API access'],
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Industry Partnerships</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Strategic collaborations that bridge academia and industry
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {partnerships.map((partnership, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-indigo-100 transform transition-all hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex items-start mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-indigo-900">{partnership.name}</h3>
                    <p className="text-indigo-600">{partnership.description}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-bold text-indigo-900 mb-2">Student Benefits:</h4>
                  <ul className="space-y-2">
                    {partnership.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-indigo-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="mt-6 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-medium py-3 rounded-lg transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Become a Partner</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            Join our network of industry leaders and help shape the future of education in Nigeria
          </p>
          <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Partner With Us
          </button>
        </div>
      </div>
    </section>
  );
};

export default IndustryPartnerships;
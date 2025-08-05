// components/TrustedCompanies.tsx
import React from 'react';

const TrustedCompanies = () => {
  const companies = [
    { name: 'Google', logo: '' },
    { name: 'Microsoft', logo: '' },
    { name: 'Andela', logo: '' },
    { name: 'Flutterwave', logo: '' },
    { name: 'MTN Nigeria', logo: '' },
    { name: 'Dangote Group', logo: '' },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Trusted By Industry Leaders</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Our graduates work at top companies across Nigeria and globally
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {companies.map((company, index) => (
            <div 
              key={index}
              className="bg-indigo-50 rounded-xl p-6 h-32 flex items-center justify-center transform transition-all hover:scale-105 hover:shadow-md"
            >
              <div className="text-center">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-2" />
                <span className="text-indigo-900 font-medium">{company.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedCompanies;
import React from 'react';

const TechPrograms = () => {
  const programs = [
    {
      title: 'Computer Science',
      duration: '4 Years',
      description: 'Comprehensive program covering algorithms, data structures, AI, and software engineering.',
      highlight: 'Ranked #1 in Nigeria',
    },
    {
      title: 'Data Science & AI',
      duration: '4 Years',
      description: 'Master machine learning, big data analytics, and artificial intelligence applications.',
      highlight: 'Industry partnerships',
    },
    {
      title: 'Cybersecurity',
      duration: '4 Years',
      description: 'Learn to protect systems and networks from digital attacks and threats.',
      highlight: 'State-of-the-art lab',
    },
    {
      title: 'Robotics Engineering',
      duration: '5 Years',
      description: 'Design and build intelligent machines for industrial and consumer applications.',
      highlight: 'International competitions',
    },
    {
      title: 'Software Engineering',
      duration: '4 Years',
      description: 'Develop expertise in full-stack development, DevOps, and software architecture.',
      highlight: 'Industry certifications',
    },
    {
      title: 'Cloud Computing',
      duration: '3 Years',
      description: 'Master cloud infrastructure, services, and deployment strategies.',
      highlight: 'AWS Academy member',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Technology Programs</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Cutting-edge programs designed for the digital future
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2 hover:shadow-xl border border-indigo-100"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-indigo-900">{program.title}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                    {program.duration}
                  </span>
                </div>
                <p className="text-indigo-700 mb-6">{program.description}</p>
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mb-6">
                  <span className="font-medium text-amber-700">✓ {program.highlight}</span>
                </div>
                <div className="flex justify-between">
                  <button className="text-indigo-600 font-medium hover:text-indigo-800">
                    Program Details
                  </button>
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full">
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechPrograms;
// components/LearningResources.tsx
import React from 'react';

const LearningResources = () => {
  const resources = [
    {
      title: 'Digital Library',
      description: 'Access to 100,000+ e-books, journals, and research papers',
      icon: '📚',
    },
    {
      title: 'Video Lecture Archive',
      description: 'Recorded lectures from top instructors across all subjects',
      icon: '🎥',
    },
    {
      title: 'Interactive Quizzes',
      description: 'Test your knowledge with auto-graded quizzes and exams',
      icon: '📝',
    },
    {
      title: 'Study Groups Platform',
      description: 'Connect with peers for collaborative learning sessions',
      icon: '👥',
    },
    {
      title: 'Research Databases',
      description: 'Premium access to academic databases like JSTOR and IEEE',
      icon: '🔍',
    },
    {
      title: '24/7 Tutor Support',
      description: 'On-demand help from subject matter experts',
      icon: '🦉',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Learning Resources</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Comprehensive academic support for every student
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-sm transform transition-all hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">{resource.title}</h3>
              <p className="text-indigo-700 mb-6">{resource.description}</p>
              <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                Access Resource
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Premium Resource Access</h3>
          <p className="text-blue-100 max-w-2xl mx-auto mb-6">
            All enrolled students get free access to our premium learning resources
          </p>
          <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
            Enroll Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default LearningResources;
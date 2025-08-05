// components/TutorialCategories.tsx
import React from 'react';

const TutorialCategories = () => {
  const categories = [
    {
      name: 'Science',
      icon: '🔬',
      courses: ['Physics', 'Chemistry', 'Biology', 'Integrated Science'],
    },
    {
      name: 'Mathematics',
      icon: '🧮',
      courses: ['Algebra', 'Geometry', 'Calculus', 'Statistics'],
    },
    {
      name: 'Humanities',
      icon: '📚',
      courses: ['Literature', 'History', 'Government', 'Philosophy'],
    },
    {
      name: 'Languages',
      icon: '🌐',
      courses: ['English', 'French', 'Spanish', 'Yoruba'],
    },
    {
      name: 'Technology',
      icon: '💻',
      courses: ['Programming', 'Robotics', 'Web Design', 'Data Science'],
    },
    {
      name: 'Business',
      icon: '📊',
      courses: ['Accounting', 'Economics', 'Commerce', 'Entrepreneurship'],
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Tutorial Categories</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Explore our comprehensive learning resources by subject
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-md border border-indigo-100 transform transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start mb-4">
                <span className="text-4xl mr-4">{category.icon}</span>
                <h3 className="text-xl font-bold text-indigo-900">{category.name}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.courses.map((course, i) => (
                  <span 
                    key={i}
                    className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {course}
                  </span>
                ))}
              </div>
              <button className="mt-4 text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                View tutorials
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TutorialCategories;
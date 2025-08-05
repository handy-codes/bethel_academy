// components/News.tsx
import React from 'react';

const News = () => {
  const newsItems = [
    {
      id: 1,
      title: 'Bethel Academy Ranked #1 in Nigeria for Innovation',
      date: 'June 15, 2023',
      excerpt: 'Our institution has been recognized as the most innovative university in Nigeria for the third consecutive year.',
      category: 'Achievements',
    },
    {
      id: 2,
      title: 'New AI Research Center Launched',
      date: 'May 28, 2023',
      excerpt: 'The center will focus on developing AI solutions for African healthcare and agriculture challenges.',
      category: 'Technology',
    },
    {
      id: 3,
      title: 'Annual Tech Fair Attracts 50+ Companies',
      date: 'April 10, 2023',
      excerpt: 'Students showcased innovative projects to industry leaders, with 200+ job offers extended.',
      category: 'Events',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Campus News & Events</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Stay updated with the latest happenings at Bethel Academy
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:-translate-y-2"
            >
              <div className="bg-gray-200 border-2 border-dashed w-full h-48" />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                    {item.category}
                  </span>
                  <span className="text-sm text-indigo-600">{item.date}</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">{item.title}</h3>
                <p className="text-indigo-700 mb-4">{item.excerpt}</p>
                <button className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center">
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-full transition-all transform hover:scale-105">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
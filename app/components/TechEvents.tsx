// components/TechEvents.tsx
import React from 'react';

const TechEvents = () => {
  const events = [
    {
      title: 'Annual Tech Fair',
      date: 'Oct 15-17, 2023',
      description: 'Showcase of student tech projects with industry leaders',
      type: 'Conference',
    },
    {
      title: 'Hack the Future',
      date: 'Nov 5-6, 2023',
      description: '48-hour hackathon focusing on sustainable solutions',
      type: 'Hackathon',
    },
    {
      title: 'AI Innovation Summit',
      date: 'Dec 2, 2023',
      description: 'Keynote speakers and workshops on AI applications',
      type: 'Summit',
    },
    {
      title: 'Women in Tech Conference',
      date: 'Jan 20, 2024',
      description: 'Empowering female students in technology fields',
      type: 'Conference',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">Upcoming Tech Events</h2>
          <p className="text-xl text-indigo-700 max-w-3xl mx-auto">
            Join our vibrant tech community for learning, networking, and innovation
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl overflow-hidden shadow-md border border-indigo-100 transform transition-all hover:-translate-y-2"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-3 py-1 rounded-full">
                      {event.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-indigo-900 font-bold">{event.date}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-indigo-900 mb-3">{event.title}</h3>
                <p className="text-indigo-700 mb-6">{event.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-indigo-600">Bethel Innovation Hub</span>
                  </div>
                  
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-full">
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-white mb-2">Host Your Event With Us</h3>
              <p className="text-blue-100 max-w-xl">
                Our facilities are available for tech conferences, workshops, and meetups
              </p>
            </div>
            <button className="bg-amber-400 hover:bg-amber-500 text-indigo-900 font-bold py-3 px-8 rounded-full transition-all">
              Inquire Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechEvents;
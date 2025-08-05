import React from 'react';

const CollegeHistory = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96" />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">Our History & Mission</h2>
            <p className="text-lg text-indigo-700 mb-6">
              Founded in 1992, Bethel Academy has grown from a small community college to one of Nigeria&apos;s leading institutions. Our mission is to provide accessible, high-quality education that empowers students to become leaders in their fields and communities.
            </p>
            <p className="text-lg text-indigo-700 mb-8">
              We believe in holistic development, combining academic rigor with character building and practical skills. Our graduates leave not just with degrees, but with the vision and capability to make meaningful contributions to society.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-2">Our Vision</h3>
                <p className="text-indigo-700">To be Africa&apos;s premier institution for innovative education and leadership development.</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="font-bold text-indigo-900 mb-2">Our Values</h3>
                <p className="text-indigo-700">Excellence, Integrity, Innovation, Community, and Service.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollegeHistory;
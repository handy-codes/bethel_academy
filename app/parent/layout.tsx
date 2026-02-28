'use client';

import { useState, useEffect } from 'react';
import ParentSidebar from './components/ParentSidebar';

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleToggleSidebar = () => {
      setSidebarOpen(prev => !prev);
    };

    // Listen for custom events to toggle sidebar
    window.addEventListener('dashboard:toggleSidebar:parent', handleToggleSidebar);

    return () => {
      window.removeEventListener('dashboard:toggleSidebar:parent', handleToggleSidebar);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-full flex flex-col lg:flex-row bg-gray-50 pt-16">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-5 w-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar - full height on desktop */}
      <ParentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content - reduced top padding */}
      <div className="flex-1 min-w-0 lg:ml-64">
        <main className="px-4 pt-2 pb-6 lg:px-6 lg:pt-4 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}



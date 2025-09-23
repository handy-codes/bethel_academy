"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentSidebar from "./components/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      console.log('Student layout: No user found, redirecting to sign-in');
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  // Show loading only if not loaded yet
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If no user, don't render anything (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Redirecting...</h1>
          <p className="text-gray-600">Please wait while we redirect you to sign in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ '--navbar-height': '64px' } as React.CSSProperties}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64 min-h-screen">
        {/* Animated Mobile menu button */}
        <span className={`lg:hidden fixed top-20 z-50 transition-all duration-300 ${
          sidebarOpen ? 'left-60' : 'left-4'
        }`}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 bg-white rounded-full shadow-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
          >
            {sidebarOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </span>
        <main className="p-4 sm:p-6 w-full pt-20 lg:pt-20 bg-gray-100 min-h-screen">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

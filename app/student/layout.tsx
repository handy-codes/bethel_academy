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

  // React to navbar global toggle
  useEffect(() => {
    const onToggle = () => setSidebarOpen(prev => !prev);
    const channel = 'dashboard:toggleSidebar:student';
    if (typeof window !== 'undefined') {
      window.addEventListener(channel, onToggle as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(channel, onToggle as EventListener);
      }
    };
  }, []);

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
      {/* Listen to global navbar toggle for dashboards */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              if (typeof window !== 'undefined') {
                window.addEventListener('dashboard:toggleSidebar', function(){
                  const ev = new CustomEvent('dashboard:toggleSidebar:student');
                  window.dispatchEvent(ev);
                });
              }
            })();
          `,
        }}
      />
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <StudentSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 min-h-screen">
        {/* Floating toggle below navbar on mobile - positioned to avoid content overlap */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`lg:hidden fixed z-50 top-20 left-4 p-2 rounded-full shadow-lg transition-all duration-200 ${sidebarOpen ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} `}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M9 5v14" />
            </svg>
          )}
        </button>
        <main className="p-4 sm:p-6 w-full pt-20 lg:pt-20 bg-gray-100 min-h-screen ml-0 lg:ml-0">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

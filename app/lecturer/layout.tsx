"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LecturerSidebar from "./components/LecturerSidebar";

export default function LecturerLayout({
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
    const channel = 'dashboard:toggleSidebar:lecturer';
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
      router.push("/sign-in");
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100" style={{ '--navbar-height': '64px' } as React.CSSProperties}>
      {/* Global navbar toggle hooks */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(){
              if (typeof window !== 'undefined') {
                window.addEventListener('dashboard:toggleSidebar', function(){
                  const ev = new CustomEvent('dashboard:toggleSidebar:lecturer');
                  window.dispatchEvent(ev);
                });
              }
            })();
          `,
        }}
      />
      {/* Mobile backdrop for sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <LecturerSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

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
        <main className="p-4 sm:p-6 w-full pt-20 lg:pt-20 ml-0 lg:ml-0">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}








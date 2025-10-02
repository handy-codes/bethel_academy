"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Bell, LogOut } from "lucide-react";

export default function LecturerHeader() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile dashboard sidebar toggle at top-left for lecturer */}
          <button
            className="md:hidden mr-3 text-indigo-900"
            onClick={() => {
              const ev = new Event('dashboard:toggleSidebar');
              window.dispatchEvent(ev);
            }}
            aria-label="Toggle dashboard sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M9 5v14" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Lecturer Portal
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || "Lecturer"}
              </p>
              <p className="text-xs text-gray-500">Lecturer</p>
            </div>
            <button
              onClick={() => signOut()}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}








"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle, 
  Clock,
  User,
  Settings,
  X
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/student", icon: LayoutDashboard },
  { name: "Available Exams", href: "/student/exams", icon: BookOpen },
  { name: "My Results", href: "/student/results", icon: CheckCircle },
  { name: "Exam History", href: "/student/history", icon: Clock },
  { name: "Profile", href: "/student/profile", icon: User },
  { name: "Settings", href: "/student/settings", icon: Settings },
];

interface StudentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentSidebar({ isOpen, onClose }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg pt-20 lg:pt-20
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <nav className="mt-5 px-2">
        <div className="flex items-center justify-between mb-4 px-2 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onClose()} // Close sidebar on mobile after navigation
                className={`${
                  isActive
                    ? "bg-indigo-100 text-indigo-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? "text-indigo-500" : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 h-5 w-5`}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

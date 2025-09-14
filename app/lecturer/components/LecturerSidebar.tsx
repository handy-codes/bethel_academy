"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3,
  Settings,
  FileText,
  CheckCircle
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/lecturer", icon: LayoutDashboard },
  { name: "My Exams", href: "/lecturer/exams", icon: BookOpen },
  { name: "Create Exam", href: "/lecturer/create-exam", icon: FileText },
  { name: "Students", href: "/lecturer/students", icon: Users },
  { name: "Results", href: "/lecturer/results", icon: CheckCircle },
  { name: "Analytics", href: "/lecturer/analytics", icon: BarChart3 },
  { name: "Settings", href: "/lecturer/settings", icon: Settings },
];

export default function LecturerSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg pt-20">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
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








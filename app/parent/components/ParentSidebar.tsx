'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  Calendar,
  Home,
  Users,
  Settings,
  Menu,
  X,
  SplitSquareHorizontal
} from 'lucide-react';

interface ParentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ParentSidebar({ isOpen, onClose }: ParentSidebarProps) {
  const { user } = useUser();

  const menuItems = [
    { href: '/parent', icon: Home, label: 'Dashboard' },
    { href: '/parent/results', icon: BookOpen, label: 'Exam Results' },
    { href: '/parent/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/parent/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/parent/communication', icon: Users, label: 'Communication' },
    { href: '/parent/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Parent Portal</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                onClick={onClose}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">Parent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar - full height below navbar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:top-16 lg:left-0 lg:bottom-0 lg:w-64 lg:bg-white lg:shadow-lg lg:border-r lg:z-40">
        <div className="flex items-center justify-center p-4 border-b flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-800">Parent Portal</h2>
        </div>

        <nav className="flex-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <UserButton afterSignOutUrl="/" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">Parent</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}




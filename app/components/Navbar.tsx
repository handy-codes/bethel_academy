"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useUser, SignOutButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";


interface NavbarProps {
  isAdminRoute?: boolean;
  isStudentRoute?: boolean;
}

const Navbar = ({ isAdminRoute = false, isStudentRoute = false }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "College", path: "/college" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Tech", path: "/tech" },
    { name: "Externals", path: "/externals" },
  ];

  // Get user role from metadata with better detection
  const getUserRole = useCallback(() => {
    if (!user || !isLoaded) return null;
    
    // Try multiple ways to get the role
    const role = user.publicMetadata?.role as string || 
      (user as any).role ||
      null;
    
    console.log('Navbar - User role detection:', {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      publicMetadata: user.publicMetadata,
      detectedRole: role,
      isLoaded
    });
    return role;
  }, [user, isLoaded]);

  const userRole = getUserRole();

  // Force re-render when user data changes
  useEffect(() => {
    if (isLoaded && user) {
      const role = getUserRole();
      console.log('User role updated:', role);
    }
  }, [user, isLoaded, getUserRole]);

  return (
    <header className="fixed w-full z-50 bg-white shadow-md py-5 transition-shadow duration-300">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-initial">
          {/* Logo: smaller on mobile only, full size from md up */}
          <Link
            href="/"
            className="flex-shrink-0 rounded-full overflow-hidden w-9 h-9 md:w-12 md:h-12 focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Bethel Academy home"
          >
            <Image
              src="/bethel_logo.jpg"
              alt="Bethel Academy Logo"
              width={48}
              height={48}
              className="w-9 h-9 md:w-12 md:h-12 object-cover"
            />
          </Link>
          {/* Title: larger on mobile now that logo is smaller */}
          <Link
            href="/"
            className="min-w-0 flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="font-bold text-lg leading-snug sm:text-xl md:text-2xl lg:text-3xl md:leading-normal text-[#1D4ED8]">
              The Bethel Academy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Updated link colors */}
        <nav className="hidden md:flex items-center space-x-8 h-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-semibold text-black nav-link leading-10 ${
                pathname === link.path ? "nav-link-active-scrolled" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4 h-10">
          {user ? (
            <div className="flex items-center space-x-4 h-10">
              {/* Role-based dashboard link - same height as nav for vertical alignment */}
              {userRole === 'admin' && (
                <Link
                  href="/admin"
                  className="font-semibold transition-colors bg-[#FBBF24] text-white hover:bg-amber-400 px-3 rounded-lg inline-flex items-center h-10 leading-10 box-border"
                >
                  Admin Dashboard
                </Link>
              )}
              {userRole === 'student' && (
                <Link
                  href="/student"
                  className="font-semibold transition-colors bg-[#FBBF24] text-white hover:bg-amber-400 px-3 rounded-lg inline-flex items-center h-10 leading-10 box-border"
                >
                  Student Dashboard
                </Link>
              )}
              {userRole === 'lecturer' && (
                <Link
                  href="/lecturer"
                  className="font-semibold transition-colors bg-[#FBBF24] text-white hover:bg-amber-400 px-3 rounded-lg inline-flex items-center h-10 leading-10 box-border"
                >
                  Lecturer Dashboard
                </Link>
              )}
              {userRole === 'parent' && (
                <Link
                  href="/parent"
                  className="font-semibold transition-colors bg-[#FBBF24] text-white hover:bg-amber-400 px-3 rounded-lg inline-flex items-center h-10 leading-10 box-border"
                >
                  Parent Dashboard
                </Link>
              )}
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </div>
          ) : (
            <Link href="/sign-in">
          <button className="bg-[#BF5800] hover:bg-[#a34700] text-white font-bold py-2 px-6 rounded-md transition-colors">
            Login
          </button>
            </Link>
          )}
        </div>

        {/* Mobile: menu icon first, then login/user - smaller to give title more space */}
        <div className="md:hidden flex items-center space-x-2">
          <button
            ref={menuButtonRef}
            className="h-8 w-8 flex items-center justify-center flex-shrink-0"
            style={{ color: '#FBBF24' }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          {user ? (
            <div className="relative mobile-user-button flex-shrink-0">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "!w-6 !h-6"
                  }
                }}
              />
            </div>
          ) : (
            <Link href="/sign-in">
              <button className="bg-[#BF5800] hover:bg-[#a34700] text-white font-bold py-1.5 px-2 rounded-sm text-xs whitespace-nowrap transition-colors min-w-0">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="md:hidden py-4 px-4 absolute top-full left-0 right-0 shadow-lg z-[60]"
          style={{ backgroundColor: '#2C3E50' }}
        >
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
              className={`font-semibold transition-colors px-4 py-2 rounded-lg ${
                pathname === link.path
                  ? "text-white"
                  : "text-gray-200 hover:text-white"
              }`}
              style={{
                backgroundColor: pathname === link.path ? '#1B9BFF' : 'transparent'
              }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
{/* Role-based dashboard links for mobile */}
            {user && userRole === 'admin' && (
              <Link
                href="/admin"
                className="font-semibold transition-colors px-4 py-2 rounded-lg bg-[#FBBF24] text-white hover:bg-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {user && userRole === 'student' && (
              <Link
                href="/student"
                className="font-semibold transition-colors px-4 py-2 rounded-lg bg-[#FBBF24] text-white hover:bg-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Student Dashboard
              </Link>
            )}
            {user && userRole === 'lecturer' && (
              <Link
                href="/lecturer"
                className="font-semibold transition-colors px-4 py-2 rounded-lg bg-[#FBBF24] text-white hover:bg-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Lecturer Dashboard
              </Link>
            )}
            {user && userRole === 'parent' && (
              <Link
                href="/parent"
                className="font-semibold transition-colors px-4 py-2 rounded-lg bg-[#FBBF24] text-white hover:bg-amber-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                Parent Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
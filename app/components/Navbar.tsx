"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "College", path: "/college" },
    { name: "Tutorials", path: "/tutorials" },
    { name: "Tech", path: "/tech" },
    { name: "Externals", path: "/externals" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xl p-2 rounded mr-2">BA</div> */}
            <div className="mr-2 rounded-full overflow-hidden w-12 h-12">
              <Image
                src="/bethel_logo2.jpg"
                alt="Bethel Academy Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Updated logo text */}
            <span
              className={`text-2xl sm:text-3xl font-bold ${
                isScrolled ? "text-indigo-900" : "text-white"
              }`}
            >
              The Bethel Academy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Updated link colors */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`font-medium transition-colors ${
                pathname === link.path
                  ? isScrolled
                    ? "text-indigo-600 font-bold"
                    : "text-white font-bold"
                  : isScrolled
                  ? "text-indigo-900 hover:text-indigo-600"
                  : "text-white hover:text-gray-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all transform hover:scale-105">
            Login
          </button>
        </div>

        {/* Mobile menu button - Updated icon color */}
        <button
          className={`md:hidden ${
            isScrolled ? "text-indigo-900" : "text-[#ffcc29]"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 ml w-10"
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 absolute top-full left-0 right-0 shadow-lg">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`font-medium transition-colors ${
                  pathname === link.path
                    ? "text-indigo-600 font-bold"
                    : "text-indigo-900 hover:text-indigo-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all">
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

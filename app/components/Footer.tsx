// components/Footer.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";


import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              {/* <div className="bg-white text-indigo-600 font-bold text-xl p-2 rounded mr-2">BA</div> */}
              <div className="mr-2 rounded-full overflow-hidden w-12 h-12">
                <Image
                  src="/bethel_logo.jpg"
                  alt="Bethel Academy Logo"
                  width={50}
                  height={50}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-3xl font-bold">Bethel Academy</span>
            </div>
            <p className="text-blue-200 mb-6">
              Empowering the next generation of African leaders through
              innovative education and character development.
            </p>
            <div className="flex space-x-4">
              {[
                { name: "facebook", icon: <FaFacebookF className="h-5 w-5" /> },
                { name: "twitter", icon: <FaTwitter className="h-5 w-5" /> },
                {
                  name: "instagram",
                  icon: <FaInstagram className="h-5 w-5" />,
                },
                { name: "youtube", icon: <FaYoutube className="h-5 w-5" /> },
                {
                  name: "linkedin",
                  icon: <FaLinkedinIn className="h-5 w-5" />,
                },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href="#"
                  className="bg-indigo-800 hover:bg-indigo-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                >
                  <span className="sr-only">{platform.name}</span>
                  {platform.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                "Home",
                "About Us",
                "Programs",
                "Admissions",
                "Campus Life",
                "Contact",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Academic Programs</h3>
            <ul className="space-y-3">
              {[
                "Undergraduate",
                "Postgraduate",
                "Professional Certificates",
                "Online Courses",
                "Research Programs",
                "Summer School",
              ].map((program) => (
                <li key={program}>
                  <Link
                    href="#"
                    className="text-blue-200 hover:text-white transition-colors"
                  >
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <address className="not-italic text-blue-200">
              <p className="mb-3">10 Market Road, Ogijo</p>
              <p className="mb-3">Ogun State, Nigeria</p>
              <p className="mb-3">+234 816 737 6171</p>
              <p className="mb-3">info@bethelacademy.edu.ng</p>
            </address>
          </div>
        </div>

        <div className="border-t border-indigo-800 pt-8 text-center text-blue-200">
          <p>&copy; {currentYear} Bethel Academy. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

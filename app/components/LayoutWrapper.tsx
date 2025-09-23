"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  
  // Routes that should not have navbar and footer
  const authRoutes = ['/sign-in', '/sign-up'];
  const studentRoutes = ['/student'];
  const lecturerRoutes = ['/lecturer'];
  const adminRoutes = ['/admin'];
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));
  const isLecturerRoute = lecturerRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthRoute || isLecturerRoute) {
    // For auth routes and lecturer dashboard routes, just render children without navbar/footer
    return <>{children}</>;
  }
  
  if (isStudentRoute) {
    // For student routes, render with navbar but no footer for better dashboard experience
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar isStudentRoute={true} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }
  
  if (isAdminRoute) {
    // For admin routes, render with navbar but no footer for better dashboard experience
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar isAdminRoute={true} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }
  
  // For all other routes (home page, public pages), render with navbar and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

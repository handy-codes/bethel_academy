"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import RoleSync from "./RoleSync";

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
  const parentRoutes = ['/parent'];

  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isStudentRoute = studentRoutes.some(route => pathname.startsWith(route));
  const isLecturerRoute = lecturerRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isParentRoute = parentRoutes.some(route => pathname.startsWith(route));

  if (isAuthRoute) {
    // For auth routes, just render children without navbar/footer
    return <><RoleSync />{children}</>;
  }

  if (isStudentRoute) {
    // For student routes, render with navbar but no footer for better dashboard experience
    return (
      <div className="min-h-screen flex flex-col">
        <RoleSync />
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
        <RoleSync />
        <Navbar isAdminRoute={true} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  if (isLecturerRoute) {
    // For lecturer routes, render with navbar but no footer
    return (
      <div className="min-h-screen flex flex-col">
        <RoleSync />
        {/* Reuse admin style for dashboard navbar visuals */}
        <Navbar isAdminRoute={true} />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  if (isParentRoute) {
    // For parent routes, render with navbar but no footer
    return (
      <div className="min-h-screen flex flex-col">
        <RoleSync />
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
      <RoleSync />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

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
  const dashboardRoutes = ['/admin', '/student', '/lecturer'];
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
  
  if (isAuthRoute || isDashboardRoute) {
    // For auth routes and dashboard routes, just render children without navbar/footer
    return <>{children}</>;
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

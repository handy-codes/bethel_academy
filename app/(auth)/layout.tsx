'use client';

import { useEffect } from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="h-screen overflow-hidden flex items-center justify-center py-8 px-4"
      style={{ backgroundColor: '#020817' }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
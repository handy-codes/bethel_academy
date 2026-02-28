'use client';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8 px-4">
      {children}
    </div>
  );
};

export default AuthLayout;
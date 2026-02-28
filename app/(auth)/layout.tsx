'use client';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-0 h-auto bg-gray-900 py-8 flex flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default AuthLayout;
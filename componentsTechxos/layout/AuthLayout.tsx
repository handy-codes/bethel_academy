'use client';

import { usePathname } from 'next/navigation';
import Topbar from './Topbar';
import FooterWrapper from './FooterWrapper';
import { useEffect, useState } from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setIsClient(true);
    try {
      // Check if we're on a sign-in or sign-up page
      const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
      console.log('Current pathname:', pathname);
      console.log('Is auth page:', isAuthPage);
    } catch (err) {
      console.error('Error in AuthLayout:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [pathname]);
  
  // If there's an error, show it
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-100 text-red-800 rounded">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  
  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Topbar />}
      <main className={`flex-grow ${!isAuthPage ? 'mt-[80px] xl:mt-[120px]' : ''}`}>
        {children}
      </main>
      {!isAuthPage && <FooterWrapper />}
    </div>
  );
} 



// 'use client';

// import { usePathname } from 'next/navigation';
// import Topbar from './Topbar';
// import FooterWrapper from './FooterWrapper';
// import { useEffect, useState } from 'react';

// export default function AuthLayout({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const [isClient, setIsClient] = useState(false);
//   const [error, setError] = useState<string | null>(null);
  
//   useEffect(() => {
//     setIsClient(true);
//     try {
//       // Check if we're on a sign-in or sign-up page
//       const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
//       console.log('Current pathname:', pathname);
//       console.log('Is auth page:', isAuthPage);
//     } catch (err) {
//       console.error('Error in AuthLayout:', err);
//       setError(err instanceof Error ? err.message : 'Unknown error');
//     }
//   }, [pathname]);
  
//   // If there's an error, show it
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="p-4 bg-red-100 text-red-800 rounded">
//           <h2 className="text-lg font-bold">Error</h2>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }
  
//   const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');
  
//   return (
//     <div className="min-h-screen flex flex-col">
//       {!isAuthPage && <Topbar />}
//       <main className={`flex-grow ${!isAuthPage ? 'mt-[80px] xl:mt-[120px]' : ''}`}>
//         {children}
//       </main>
//       {!isAuthPage && <FooterWrapper />}
//     </div>
//   );
// } 


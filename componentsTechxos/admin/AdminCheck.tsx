'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function AdminCheck({ children }: { children: React.ReactNode }) {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminAccess() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        console.log('User is not signed in');
        router.push('/sign-in');
        return;
      }

      if (!userId) {
        console.error('No userId available');
        setError('Authentication error. Please try signing in again.');
        setIsChecking(false);
        return;
      }

      try {
        console.log('Checking admin access for userId:', userId);
        const response = await fetch('/api/auth/check-admin');
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          console.error('User is not an admin');
          setError('You do not have admin access.');
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setError('Error checking admin access. Please try again.');
        router.push('/');
      } finally {
        setIsChecking(false);
      }
    }

    checkAdminAccess();
  }, [userId, isLoaded, isSignedIn, router]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.push('/sign-in')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
} 
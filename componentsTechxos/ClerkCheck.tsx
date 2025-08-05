'use client';

import { useClerk } from '@clerk/nextjs';

export default function ClerkCheck() {
  const { loaded } = useClerk();
  
  if (!loaded) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        <p>Clerk is not yet initialized.</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-green-100 text-green-800 rounded">
      <p>Clerk is properly initialized.</p>
    </div>
  );
} 
"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function FixMyRolePage() {
  const { user } = useUser();
  const [fixing, setFixing] = useState(false);
  const [message, setMessage] = useState("");

  const fixRole = async () => {
    setFixing(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/fix-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ ${result.message}`);
        // Force page refresh after 2 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to fix role: ${error}`);
    } finally {
      setFixing(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in first</h1>
          <a href="/sign-in" className="text-indigo-600 hover:text-indigo-700">
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Fix My Role</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Current Role:</p>
              <p className="font-medium">{user.publicMetadata?.role as string || 'None'}</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={fixRole}
            disabled={fixing}
            className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {fixing ? 'Fixing Role...' : 'Fix My Role'}
          </button>

          <p className="text-xs text-gray-500 mt-4">
            This will automatically assign the correct role based on your email
          </p>
        </div>
      </div>
    </div>
  );
}


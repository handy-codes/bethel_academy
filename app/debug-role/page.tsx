"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function DebugRolePage() {
  const { user } = useUser();
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");

  const updateRole = async (role: string) => {
    setUpdating(true);
    setMessage("");
    
    try {
      const response = await fetch('/api/admin/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user?.id,
          email: user?.emailAddresses[0]?.emailAddress,
          role 
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Role updated to ${role}! Please refresh the page.`);
        // Force page refresh after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Failed to update role: ${error}`);
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Debug: User Role Management</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="text-sm text-gray-900 font-mono bg-gray-100 p-2 rounded">{user.id}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="text-sm text-gray-900">{user.emailAddresses[0]?.emailAddress}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Role</label>
              <p className="text-sm text-gray-900">
                {user.publicMetadata?.role as string || 'undefined'}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Public Metadata</label>
              <pre className="text-xs text-gray-900 bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(user.publicMetadata, null, 2)}
              </pre>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
        </div>
          )}

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Set Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => updateRole('admin')}
                disabled={updating}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors"
              >
                {updating ? 'Updating...' : 'Set as Admin'}
              </button>
              
              <button
                onClick={() => updateRole('student')}
                disabled={updating}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {updating ? 'Updating...' : 'Set as Student'}
              </button>
              
              <button
                onClick={() => updateRole('lecturer')}
                disabled={updating}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {updating ? 'Updating...' : 'Set as Lecturer'}
              </button>
          </div>
        </div>
        
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
            <div className="space-y-2">
              <a href="/admin" className="block text-indigo-600 hover:text-indigo-700">
                → Admin Dashboard
              </a>
              <a href="/student" className="block text-indigo-600 hover:text-indigo-700">
                → Student Dashboard  
              </a>
              <a href="/lecturer" className="block text-indigo-600 hover:text-indigo-700">
                → Lecturer Dashboard
              </a>
              <a href="/" className="block text-indigo-600 hover:text-indigo-700">
                → Homepage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

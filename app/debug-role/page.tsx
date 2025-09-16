"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function DebugRolePage() {
  const { user, isLoaded } = useUser();
  const [roleInfo, setRoleInfo] = useState<any>(null);

  useEffect(() => {
    if (user && isLoaded) {
      setRoleInfo({
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress,
        publicMetadata: user.publicMetadata,
        privateMetadata: user.privateMetadata,
        unsafeMetadata: user.unsafeMetadata,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not signed in</h1>
          <p className="text-gray-600">Please sign in to see role information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Role Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">User ID</label>
              <p className="mt-1 text-sm text-gray-900 font-mono">{roleInfo?.userId}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{roleInfo?.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{roleInfo?.fullName}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Public Metadata</label>
              <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(roleInfo?.publicMetadata, null, 2)}
              </pre>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Private Metadata</label>
              <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(roleInfo?.privateMetadata, null, 2)}
              </pre>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Unsafe Metadata</label>
              <pre className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded overflow-auto">
                {JSON.stringify(roleInfo?.unsafeMetadata, null, 2)}
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detected Role</h2>
          <div className="text-lg">
            <span className="font-medium">Role: </span>
            <span className="text-indigo-600 font-bold">
              {roleInfo?.publicMetadata?.role || 
               roleInfo?.privateMetadata?.role || 
               roleInfo?.unsafeMetadata?.role || 
               'No role detected'}
            </span>
          </div>
        </div>
        
        <div className="mt-8 bg-blue-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Instructions</h2>
          <div className="text-blue-800 space-y-2">
            <p>1. Check the metadata above to see if the role is set correctly</p>
            <p>2. If no role is detected, run: <code className="bg-blue-100 px-2 py-1 rounded">node scripts/set-user-role.js {roleInfo?.email} admin</code></p>
            <p>3. After setting the role, sign out and sign back in</p>
            <p>4. The middleware should redirect you to the correct dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}

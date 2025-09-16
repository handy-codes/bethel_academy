"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export default function DebugUser() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">User Debug Information</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Current Path:</strong> {pathname}
        </div>
        
        <div>
          <strong>User Status:</strong> {user ? "Signed In" : "Not Signed In"}
        </div>
        
        {user && (
          <>
            <div>
              <strong>User ID:</strong> {user.id}
            </div>
            
            <div>
              <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
            </div>
            
            <div>
              <strong>First Name:</strong> {user.firstName}
            </div>
            
            <div>
              <strong>Last Name:</strong> {user.lastName}
            </div>
            
            <div>
              <strong>Public Metadata:</strong> 
              <pre className="bg-gray-100 p-2 rounded text-sm">
                {JSON.stringify(user.publicMetadata, null, 2)}
              </pre>
            </div>
            
            <div>
              <strong>Private Metadata:</strong>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                Not available on client side
              </pre>
            </div>
            
            <div>
              <strong>Detected Role:</strong> {
                user.publicMetadata?.role || 
                'No role detected'
              }
            </div>
            
            <div>
              <strong>Is Admin:</strong> {
                user.publicMetadata?.role === 'admin' ? 'Yes' : 'No'
              }
            </div>
          </>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Test Navigation:</h2>
          <div className="space-x-4">
            <a href="/" className="text-blue-600 hover:underline">Home</a>
            <a href="/admin" className="text-blue-600 hover:underline">Admin</a>
            <a href="/student" className="text-blue-600 hover:underline">Student</a>
            <a href="/lecturer" className="text-blue-600 hover:underline">Lecturer</a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

export default function SetupPage() {
  const [zoomLink, setZoomLink] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [zoomPassword, setZoomPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/live-courses/graphic-design/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          zoomLink,
          zoomMeetingId,
          zoomPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to set up live class");
      }

      const data = await response.json();
      toast.success("Live class setup completed successfully!");
      console.log("Setup response:", data);
    } catch (error) {
      console.error("Setup error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to set up live class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Unauthorized</h1>
          <p className="text-center text-gray-600">Please sign in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Setup Graphic Design Live Class</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zoom Link</label>
            <input
              type="text"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Zoom Meeting ID</label>
            <input
              type="text"
              value={zoomMeetingId}
              onChange={(e) => setZoomMeetingId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Zoom Password</label>
            <input
              type="text"
              value={zoomPassword}
              onChange={(e) => setZoomPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Setting up..." : "Setup Live Class"}
          </button>
        </form>
      </div>
    </div>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const status = searchParams.get("status");
        const txRef = searchParams.get("tx_ref");
        const transactionId = searchParams.get("transaction_id");

        console.log("Payment success params:", { status, txRef, transactionId });

        if (status !== "successful") {
          setError("Payment was not successful. Please try again.");
          setIsProcessing(false);
          return;
        }

        if (!txRef || !transactionId) {
          setError("Missing transaction information. Please contact support.");
          setIsProcessing(false);
          return;
        }

        // Call the webhook endpoint to verify and process the payment
        const response = await fetch("/api/webhook/flutterwave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            tx_ref: txRef,
            transaction_id: transactionId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to process payment");
        }

        // Payment processed successfully
        setIsProcessing(false);
        
        // Wait for the webhook to complete and database to update
        let retries = 0;
        const maxRetries = 10;
        const checkInterval = 2000; // 2 seconds

        const checkAccess = async () => {
          try {
            const response = await fetch('/api/live-courses/graphic-design/lecture');
            if (!response.ok) {
              throw new Error('Failed to check access');
            }
            const data = await response.json();
            return data.hasAccess;
          } catch (error) {
            console.error('Error checking access:', error);
            return false;
          }
        };

        while (retries < maxRetries) {
          const hasAccess = await checkAccess();
          if (hasAccess) {
            // Redirect to the course page
            router.push("/pages/graphic-design");
            return;
          }
          await new Promise(resolve => setTimeout(resolve, checkInterval));
          retries++;
        }

        // If we've exhausted all retries, show an error
        setError("Payment processed but access not granted. Please refresh the page or contact support.");
        setIsProcessing(false);
        
      } catch (error) {
        console.error("Payment processing error:", error);
        setError("There was an error processing your payment. Please contact support.");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Status</h1>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
            <p className="text-gray-600">Please wait. Leaving this page may cancel your payment</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Link 
              href="/pages/graphic-design" 
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Course
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Your payment was successful! Redirecting you to the course...</p>
          </div>
        )}
      </div>
    </div>
  );
} 
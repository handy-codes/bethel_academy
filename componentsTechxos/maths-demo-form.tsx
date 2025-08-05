"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { FaCheckCircle } from "react-/icons/fa";

export const MathsDemoForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    topic: "",
    trainingDate: "19th April 5:00pm",
  });

  // Check registration status from backend first, then fallback to localStorage
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      try {
        const response = await fetch("/api/maths-demo/check-access");
        if (!response.ok) {
          throw new Error("Failed to check registration status");
        }
        const data = await response.json();
        
        // If backend says user has access, keep both backend and localStorage in sync
        if (data.hasAccess) {
          localStorage.setItem("mathsDemoRegistered", "true");
          setIsAlreadyRegistered(true);
        } else {
          // If backend says no access, clear localStorage and show form
          localStorage.removeItem("mathsDemoRegistered");
          setIsAlreadyRegistered(false);
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
        // On error, fallback to localStorage
        const localStatus = localStorage.getItem("mathsDemoRegistered");
        setIsAlreadyRegistered(localStatus === "true");
      }
    };

    checkRegistrationStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, trainingDate: value }));
  };

  const scrollToJoinButton = () => {
    // Try multiple selectors to find the Join Live Class button
    const selectors = [
      '.bg-\\[\\#3259E6\\]', // Original selector
      '.bg-blue-500', // Alternative selector
      'a[href*="chat.whatsapp.com"]', // WhatsApp link selector
      '.mt-6.p-4.bg-blue-50', // Container of the Join Live Class button
      '.bg-green-700', // The button itself
      '#join-live-class-container', // ID selector
      '.join-live-class-button' // Class selector
    ];
    
    let elementFound = false;
    
    // Try each selector until we find an element
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        // Check if this element or its children contain the text "Join Live Class"
        if (element.textContent && element.textContent.includes('Join Live Class')) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log(`Scrolled to element with selector: ${selector}`);
          elementFound = true;
          break;
        }
      }
      if (elementFound) break;
    }
    
    // If no element found with the selectors, try a more general approach
    if (!elementFound) {
      // Find any element containing the text "Join Live Class"
      const allElements = document.querySelectorAll('*');
      for (const element of allElements) {
        if (element.textContent && element.textContent.includes('Join Live Class')) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          console.log('Scrolled to element with "Join Live Class" text');
          break;
        }
      }
    }
    
    console.log('Could not find element to scroll to');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/maths-demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      // Set localStorage and show success message
      localStorage.setItem("mathsDemoRegistered", "true");
      
      // Store registration details
      localStorage.setItem("mathsDemoDetails", JSON.stringify({
        name: formData.name,
        class: formData.class,
        trainingDate: formData.trainingDate
      }));
      
      // Set a flag in sessionStorage to indicate a fresh registration
      sessionStorage.setItem("freshRegistration", "true");
      
      toast.success("Registration Successful!");
      
      // Reload the page to show the Join Live Class button
      window.location.reload();
      
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
      localStorage.removeItem("mathsDemoRegistered");
      localStorage.removeItem("mathsDemoDetails");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user has already registered, show only the Join Live Class button
  if (isAlreadyRegistered) {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="mt-4">
          <Button
            onClick={scrollToJoinButton}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Join Live Class
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register for Free Demo Class</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name*</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class*</Label>
          <Input
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            placeholder="Enter your class (e.g., JSS1, JSS2)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            placeholder="What topic would you like to learn? (optional)"
          />
        </div>

        <div className="space-y-2">
          <Label>Training Date*</Label>
          <RadioGroup
            value={formData.trainingDate}
            onValueChange={handleRadioChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="19th April 5:00pm" id="date1" />
              <Label htmlFor="date1">19th April 5:00pm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="20th April 5:00pm" id="date2" />
              <Label htmlFor="date2">20th April 5:00pm</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Both" id="date3" />
              <Label htmlFor="date3">Both</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}; 
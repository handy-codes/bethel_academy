"use client";
import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaCheckCircle, FaRegClock, FaCopy } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { HiLocationMarker } from "react-icons/hi";
import { IoMdOptions } from "react-icons/io";
import { Loader2 } from "lucide-react";
import Frontend from "@/components/curriculum/Frontend";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import JoinLiveClassButton from "@/components/course/JoinLiveClassButton";
import FlutterwavePayment from "@/components/payment/FlutterwavePayment";
import { useRouter } from "next/navigation";
import { getUserCountryCode } from "@/lib/getUserCountry";
import { countryPricing, defaultPricing } from "@/lib/countryPricing";

interface LiveLecture {
  id: string;
  date: Date;
  recordingUrl: string | null;
  title: string | null;
  isRecorded: boolean;
}

interface LiveCourseWithLectures {
  id: string;
  zoomLink: string | null;
  lectures: LiveLecture[];
  hasAccess: boolean;
  studentEmail?: string;
  studentName?: string;
}

export default function Page() {
  const [formData, setFormData] = useState({
    courseTitle: "Frontend Development",
    name: "",
    surname: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [lecture, setLecture] = useState<LiveCourseWithLectures | null>(null);
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
  amount: defaultPricing.amount,
  currency: defaultPricing.currency,
  });

  useEffect(() => {
  async function fetchCountryAndSetPricing() {
    const countryCode = await getUserCountryCode();
    console.log("Detected country code:", countryCode);
    if (countryCode && countryPricing[countryCode]) {
      setPaymentInfo({
        amount: countryPricing[countryCode].amount,
        currency: countryPricing[countryCode].currency,
      });
    } else {
      setPaymentInfo(defaultPricing);
    }
  }
  fetchCountryAndSetPricing();
  }, []);

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get("/api/live-courses/frontend/lecture");
      console.log("Lecture details response:", response.data);

      setLecture({
        ...response.data.lecture,
        hasAccess: response.data.hasAccess
      });

    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; statusText?: string; data?: any };
        message?: string;
      };
      console.error("Detailed fetch error:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });

      if (err.response?.status === 401) {
        toast.error("Please sign in to access this course");
      } else if (err.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error("Failed to load lecture details");
      }
    }
  }, []);

  useEffect(() => {
    if (isSignedIn) {
      fetchLectureDetails();
    }
  }, [isSignedIn, fetchLectureDetails]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formDataToSend = new FormData();
    formDataToSend.append("courseTitle", formData.courseTitle);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("surname", formData.surname);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("message", formData.message);

    try {
      const response = await fetch("/api/nofilesubmit-form", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitStatus("success");
      setFormData({
        courseTitle: "Frontend Development",
        name: "",
        surname: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(user?.primaryEmailAddress?.emailAddress || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to render lecture information if available
  const renderLectureInfo = () => {
    if (!isSignedIn) {
      return (
        <div className="mt-6">
          <Link
            href="/sign-in"
            className="inline-block text-white bg-green-700 px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
          >
            Enroll Now
          </Link>
        </div>
      );
    }

    if (!lecture) {
      return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-gray-600 font-medium">Loading course information...</p>
        </div>
      );
    }
    
    return (
      <div className="mt-6 p-4 bg-blue-50 rounded-lg shadow-sm">
        {/* <h3 className="text-xl font-semibold mb-2">Current Course Information</h3> */}
        {lecture.lectures && lecture.lectures.length > 0 ? (
          <div>
            {/* <p className="mb-2">
              <span className="font-medium">Latest lecture:</span>{" "}
              {lecture.lectures[0].title || "Upcoming Session"}
            </p>
            <p className="mb-2">
              <span className="font-medium">Date:</span>{" "}
              {new Date(lecture.lectures[0].date).toLocaleString()}
            </p> */}
            {lecture.lectures[0].isRecorded && lecture.lectures[0].recordingUrl && (
              <div className="mt-2">
                <a 
                  href={lecture.lectures[0].recordingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Recording
                </a>
              </div>
            )}
          </div>
        ) : (
          <p>No scheduled lectures at this time. Please check back later.</p>
        )}
        <div className="mt-4">
          {lecture.hasAccess ? (
            <div>
              <div className="mb-4">
                <p className="relative inline-block">
                   Thanks you {user?.firstName || user?.username || "Student"}! You can now join and register for the zoom class after 3hrs or anytime before course date. Copy and use your registered email address here: <span className="font-bold text-blue-600">{user?.primaryEmailAddress?.emailAddress || ""}</span>
                  {/* Copy Meeting Passcode here to join faster.: <span className="font-bold">iQEq6e</span> */}
                  <div className="relative inline-block">
                    <button 
                      onClick={copyToClipboard}
                      className="ml-2 p-1 rounded hover:bg-gray-200 transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      <FaCopy className="text-gray-500" />
                    </button>
                    {isCopied && (
                      <div className="absolute -top-4 left-3/4 -translate-x-1/2 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm whitespace-nowrap">
                        <FaCheckCircle className="text-sm" />
                        <span>Copied!</span>
                      </div>
                    )}
                  </div>
                </p>
              </div>
              <p className="mb-4 my-4">You can also get real time meeting updates from the:
              <Link 
                href="https://chat.whatsapp.com/EJBlzWqgDXUJBhtFVvOee4"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 font-font-extrabold hover:underline block"
              >
                Course Group Chat
              </Link>
              {/* <Link 
                href="https://chat.whatsapp.com/EJBlzWqgDXUJBhtFVvOee4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[white] p-4 mt-4 w-fit bg-[#3259E6] shadow-md rounded-md underline font-font-extrabold hover:underline block"
              >
                Join Whatsapp Group Chat
              </Link> */}
              </p>
              <JoinLiveClassButton 
                courseId="frontend" 
                courseName="Frontend Development" 
              />
            </div>
          ) : (
            <div className="inline-block">
              <FlutterwavePayment 
                courseId="frontend"
                courseName="Frontend Development"
                amount={paymentInfo.amount} // UPDATED
                currency={paymentInfo.currency} // UPDATED
                email={user?.primaryEmailAddress?.emailAddress || ""}
                name={`${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student"}
                onSuccess={() => {
                  toast.success("Payment successful! Redirecting to course...");
                  router.push("/frontend/success");
                }}
                onError={(error) => {
                  console.error("Payment error:", error);
                  toast.error("Payment failed. Please try again.");
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Head>
        <title>Course Page</title>
        <meta
          name="description"
          content="Welcome to the Frontend Development Course"
        />
      </Head>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Frontend Development
              </h1>
              <p className="text-xl mb-8">
                How about crafting stunning, interactive websites that millions
                of users adore—that is Frontend Development. It is where
                creativity meets code, letting you design sleek interfaces,
                animate pixels into life, and turn ideas into immersive digital
                experiences.
              </p>
            </div>
            {/* Video modal code commented out
            <div className="mt-12">
              <div 
                className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer group" 
                onClick={() => setShowModal(true)}
              >
                <Image 
                  src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
                  alt="Frontend Course Demo Video"
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="12,9 28,18 12,27" fill="#22c55e"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 text-white text-xs px-4 py-2 opacity-0 group-hover:opacity-100">
                  Frontend Development Course Demo
                </div>
              </div>

              {showModal && (
                <div 
                  className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out"
                  onClick={() => {
                    setShowModal(false);
                    setIsModalPlaying(false);
                    setIframeLoaded(false);
                  }}
                >
                  <div 
                    className="bg-white rounded-xl shadow-2xl m-4 p-4 w-full max-w-3xl relative animate-scaleIn overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="text-lg font-bold text-gray-800 mb-2">Frontend Development Intro Video comes here. Testing...</div>
                    <div className="relative w-full aspect-video flex-1 bg-black rounded-lg overflow-hidden">
                      {!isModalPlaying ? (
                        <div className="relative w-full h-full flex items-center justify-center cursor-pointer group" onClick={() => {
                          setIsModalPlaying(true);
                          setIframeLoaded(false);
                        }}>
                          <Image 
                            src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
                            alt="Frontend Course Demo Video"
                            fill
                            className="object-cover"
                            sizes="100vw"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="12,9 28,18 12,27" fill="#22c55e"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {(!iframeLoaded || !isModalPlaying) && (
                            <>
                              <Image
                                src="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
                                alt="Frontend Course Demo Video"
                                fill
                                className="object-cover"
                                sizes="100vw"
                                style={{
                                  zIndex: 2,
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                  transition: 'opacity 0.2s',
                                  opacity: iframeLoaded ? 0 : 1,
                                  pointerEvents: 'none'
                                }}
                              />
                              {isModalPlaying && !iframeLoaded && (
                                <div style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  zIndex: 3
                                }}>
                                  <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                                </div>
                              )}
                            </>
                          )}
                          {isModalPlaying && (
                            <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1"
                            title="Frontend Course Demo"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded-b-xl w-full h-full"
                            style={{
                              background: 'transparent',
                              zIndex: 1,
                              position: 'relative'
                            }}
                            onLoad={() => setIframeLoaded(true)}
                          ></iframe>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div> 
            */}
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://media.istockphoto.com/id/1500238408/photo/program-code-development-icon-on-a-digital-lcd-display-with-reflection.jpg?b=1&s=612x612&w=0&k=20&c=PB45SiRelu95ne_GCzPcNJ7XZ0eN1nB_c-nBIAB1dFg="
                alt="Team Collaboration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  maxWidth: "100%"
                }} />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 text-black">
          <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
              Frontend Development
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
          </h1>          
          <p className="text-justify font-semibold max-sm:mb-1">
            In 12 weeks, Techxos turbocharges your journey: Code real
            projects, collaborate with industry pros, and join a tribe of
            creators obsessed with pixel perfection. Whether you are animating a
            button or architecting a full-scale web app, every lesson sharpens
            your skills for a tech world hungry for design-savvy coders. Ready
            to paint the digital canvas? Enroll now and start turning
            imagination into code—one breathtaking webpage at a time. 🎨🚀
          </p>
          <div className="p-2 md:p-4 mt-2 md:mt-3 mb-1 shadow-md hover:bg-green-700 hover:text-white transition-all duration-500 border-2 border-[#38a169] rounded-md inline-block bg-white font-bold border-solid">
            <a
              href="https://wa.me/2348167715107"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact an Advisor
            </a>
          </div>
          <div className="font-semibold">
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <FaRegClock className="text-black text-[22px]" />
              <span>Duration: 12 weeks</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <AiFillSchedule className="text-black text-[24px]" />
              <span>Schedule: 9 hours/week</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <HiLocationMarker className="text-black text-[27px]" />
              <span>Location: In-person or online</span>
            </div>
            <div className="flex items-center gap-3 mt-3 md:mt-4">
              <IoMdOptions className="text-black text-[24px]" />
              <span>Options: Evening Class, Executive (one-to-one) class</span>
            </div>
            <h2 className="text-2xl font-bold mb-2 mt-6">
              Frontend Development Virtual (Start Date: Mon 12th-May-2025)
            </h2>
            
            {/* Display lecture information if available */}
            {renderLectureInfo()}
          </div>
        </div>

        <div
          id="contact"
          className="flex-1 text-black bg-gray-100 p-6 rounded-lg shadow-md"
        >
          <h1 className="text-2xl font-bold mb-4">
            Contact Us for More Enquiry
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Course Title:
              </label>
              <input
                type="text"
                name="courseTitle"
                value={formData.courseTitle}
                readOnly
                className="w-full p-2 border font-bold text-2xl rounded bg-gray-200"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name*</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Surname*</label>
              <input
                type="text"
                name="surname"
                required
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject*</label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Message*</label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            {submitStatus === "success" && (
              <div className="mt-4 flex items-center text-green-600">
                <FaCheckCircle className="mr-2" size={24} />
                <p className="font-bold">Form submitted successfully!</p>
              </div>
            )}
            {submitStatus === "error" && (
              <p className="mt-4 text-red-600">
                Failed to submit this form. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
      <Frontend />
      <ScrollToTopButton />
    </div>
  );
}


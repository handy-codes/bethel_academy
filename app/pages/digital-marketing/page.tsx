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
import DigitalMarketing from "@/components/curriculum/Digital-Marketing";
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
    courseTitle: "Digital Marketing",
    name: "",
    surname: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      user?.primaryEmailAddress?.emailAddress || ""
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const fetchLectureDetails = useCallback(async () => {
    try {
      console.log("Fetching lecture details...");
      const response = await axios.get(
        "/api/live-courses/digital-marketing/lecture"
      );
      console.log("Lecture details response:", response.data);

      setLecture({
        ...response.data.lecture,
        hasAccess: response.data.hasAccess,
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
        courseTitle: "Digital Marketing",
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
          <p className="text-gray-600 font-medium">
            Loading course information...
          </p>
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
            </p> */}
            {/* <p className="mb-2">
              <span className="font-medium">Date:</span>{" "}
              {new Date(lecture.lectures[0].date).toLocaleString()}
            </p> */}
            {lecture.lectures[0].isRecorded &&
              lecture.lectures[0].recordingUrl && (
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
                  Thanks you {user?.firstName || user?.username || "Student"}!
                  You can now join and register for the zoom class after 3hrs or
                  anytime before course date. Copy and use your registered email
                  address here:{" "}
                  <span className="font-bold text-blue-600">
                    {user?.primaryEmailAddress?.emailAddress || ""}
                  </span>
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
              <p className="mb-4 my-4">
                You can also get real time meeting updates from the:
                <Link
                  href="https://chat.whatsapp.com/HaUuiGz3o7V1HNCwPeLHji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 font-font-extrabold hover:underline block"
                >
                  Course Group Chat
                </Link>
              </p>
              <JoinLiveClassButton
                courseId="digital-marketing"
                courseName="Digital Marketing"
              />
            </div>
          ) : (
            <div className="inline-block">
              <FlutterwavePayment
                courseId="digital-marketing"
                courseName="Digital Marketing"
                amount={paymentInfo.amount}
                currency={paymentInfo.currency}
                email={user?.primaryEmailAddress?.emailAddress || ""}
                name={
                  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
                  "Student"
                }
                onSuccess={() => {
                  toast.success("Payment successful! Redirecting to course...");
                  router.push("/digital-marketing/success");
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
          content="Welcome to the Digital Marketing Course"
        />
      </Head>
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Digital Marketing
              </h1>
              <p className="text-xl mb-8">
                Master the Art of Digital Marketing! Learn to create compelling
                campaigns, analyze data, and drive real business growth. From
                SEO to social media, email marketing to content strategy, you
                will develop the skills to reach and engage your target audience
                effectively in the digital age.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8NDw8ODQ8PDg0PEA4NDRAQEBAQEBAQFRgXFxURFhUYHighGBolGxUVJTEhJSkrMy4uFyAzODUsNygtLisBCgoKDQ0NDg8NDisZFRkrNysrKysrNzcrKy0tKzcrNysrLS0rKy0rLS0tKzcrLSsrKysrKy03KysrKysrKysrK//AABEIALcBEwMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAAAQIEBQYDB//EAD0QAAEDAgMGAwUFBgcBAAAAAAEAAgMEEQUSIQYTMUFRcSI0YTKBkaGyBxQjQrEzYnKC0eEVFkNSc5LBY//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFhEBAQEAAAAAAAAAAAAAAAAAABEB/9oADAMBAAIRAxEAPwD5e/ie5VSrP4nuV5yFUbLZqnzzmQ8Im3H8TtB8sy6krV7N0+7gDjxkJkPbg35D5rZlAKqVJVSg1+LYUyqbr4ZB7DwNR6HqFxVZSPgeWSNs7iOYcOoPML6IViYhRR1DMkg9Wke009QVUfP0WZieHSUzrP1afYeODv6H0WGgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg7HZ3ysfeT63ImzvlY+8n1uRFad/E9yvJsZke2NvF7g0el+a9JOJ7lZ+zMGeZ0h4Rt0/idoPldQdQxgaA1ugaA0D0GgQqSqoIKhSVUoIKgoVBQeVRA2VpZI0OaeIP691x+L4Q6nOZt3wng7m30d/VdmVR7QQQQCDoQdQQqj54i3WM4KYryQgmPi5vEs9R1H6LSoCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIg7HZ3ysfeT63ImzvlY+8n1uRFaSc6nuV02zdPu6cOPtSkyHtwb8gD71zO6MkgjHF78vxOpXctaGgNGgAAHYKAVBRQUEFQUKgoIKqVJVSqgVUqSokq6WONzZXS/enFopmNbdj7kA5nW04k8uCgqVz+MYJe8kA11L4+vq319Fvysx+EVAphWGO1KTl3hcwa5svs3vq42Gmqo+ZIu3l2UfXtnmp9218EZmlL3ZGuaLk++wOvxXEuaQbEEHmCLFBCIiAiIgIiICIiAiIgIiICIiAiIgIiICIiDsdnfKx95PrcibO+Vj7yfW5EVjbOU+eofIeEQNv4nXA+WZdOVrsAp93Dc+1I50h7HRvyA+K2JUEFVKkqCiIKqpKqVRBUFSVu9kcM+8T53C8UFpHdC/wDI34gn+UqDXyQyUR3lTQ1E8fslsbLloP5/XpxHFYWHNNQ9gI3W8eTlJ/ZsJJAN+Ybb3r6FjFbDRtEtTOKeNzxG1zs5u83IFmgnkdeS1zn0tcC1r6OtadCA6KR3w9oIrX7SYPS0tO+obv43AsZGxzmua973BrWjS/O/PQFaOhw2vrs8ME1RNTsMcz6UygQgt9iwcQBrrYcSFvn7L0l2gxzxBri9rWzymNriCMwY8kDQnh1XpHhNbTHPhNbEwnWSGpgYWy24AvsbW14W4oOQrsLjdKIa38DdPyzOdf8ABBtnLgOPh1tzWNj+GU0skkdNUMqBEWtZUxtAY+7Q61gTcDNbjxusytpaiOST760/eZXvmnzDRznm5LeRZyFtLBY7I2sFmtDRxsAAPkiOMqIHxOLHizh8COoPMLyXY1tIyZuV4/hI4tPULl62jfA6ztQfZcODv7+ioxkREBERAREQEREBERAREQEREBERAREQdjs75WPvJ9bkTZ3ysfeT63Iit9lDfCNANAOgHBQrP4nuVQqCCoKlVKIgqCpKqVRC+q7OYV90pmREfiu/Fm/5HW8PuAA9x6rjNiML+8VO9eLxU9pDfg6T/Tb8QT/L6rq9s8bNBRySs8zKRT0g/wDs+9ndmi7v5VFchtBBPjFdM2kiM9PhwNOLFuV07v2rxmIva2QW/wBrlyuJ7PMjeWVFMYpLZrOaY3W115aaHX0X1vY/BRh9FFAdHkb6oc7jncLnMfQcfW65HDsLdj01ZiBlMMBeynoiWF+aKO9tLgi+YuP/ACDog5CEVMHlq6pi6Nc/es/6u0W6wraueJwZiDY3RmwFVEMmQ9ZWcLfvDh6rxxzD/udQ6mdIyV7WMlJYHCzX3y3uND4Tp2WvcL6HUHQoPotfTMrIjDJYEXMMnExv5EdWnmOY9bFfOZWFjnMeLPa5zHjo4GxHxC7bBi5sEAN9I2AX42t4flZcjjL81XVW5StHv3bCfmSgxCvGeFsjS14u08v/AFZMELpXsjYLvkc1jB1c42HzK7yt2Dohka3ENxLJcRtqDDaVzQM2QZmk8RoL2ug+K4jh7oDf2ozwd09CsJfVdpNiqqhY6R4jqKYWD5I7nKDYeNjgCAb8dR6rga3BJQHSwRySRNtvMrHP3V72uQOGh+CqNQiIgIiICIiAiIgIiICIiAiIgIiIOx2d8rH3k+tyJs75WPvJ9bkRWnfxPcqqIoCIiAiIgIiICIiAoIREFSxebokRB5OhXpHVys/NmHR2vz4oiDKjxQfnaR6jULMZIHjM03BREAqCiKoqVUoiCpUFEQVKqURBUqFCIIKhEQVKgoiDFmitqOHMLxREHY7O+Vj7yfW5ERFf/Z"
                alt="Team Collaboration"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  maxWidth: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="container mx-auto p-4 mt-4 flex flex-col md:flex-row gap-8">
        <div className="flex-1 text-black">
          <div className="mt-4 md:mt-0 mb-4 md:mb-2 lg:mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold mb-[4px]">
              Digital Marketing
            </h1>
            <div className="h-[8px] w-[80px] md:w-[150px] bg-[#E79D09]"></div>
          </div>
          <h1 className="text-3xl text-green-800 lg:text-4xl font-extrabold mb-4 md:mb-2 lg:mb-6">
            {paymentInfo.amount.toLocaleString()} {paymentInfo.currency}
          </h1>
          <p className="text-justify font-semibold max-sm:mb-1">
            Techxos powers your rise: Master the art of digital marketing, from
            SEO to social media strategy. Learn from industry experts who have
            driven millions in revenue through digital campaigns. Join a
            community of marketers passionate about creating impactful online
            presence. Dive into analytics, content creation, and campaign
            management while earning certifications that showcase your
            expertise. Ready to become a digital marketing expert? Enroll now
            and start driving growth—one campaign at a time. 📱📈🚀
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
              <span>Duration: 16 weeks</span>
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
              Digital Marketing Virtual Course (Start Date: Wed 14th-May-2025)
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
                Failed to submit the form. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
      <DigitalMarketing />
      <ScrollToTopButton />
    </div>
  );
}

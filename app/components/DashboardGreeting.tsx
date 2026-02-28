"use client";

import { useUser } from "@clerk/nextjs";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}

interface DashboardGreetingProps {
  fallbackName?: string;
}

export default function DashboardGreeting({ fallbackName = "User" }: DashboardGreetingProps) {
  const { user } = useUser();
  const greeting = getTimeGreeting();
  const email = user?.primaryEmailAddress?.emailAddress ?? user?.emailAddresses?.[0]?.emailAddress ?? "";
  const emailLocal = email ? email.split("@")[0] : "";

  const external = (user as any)?.externalAccounts?.[0];
  const firstName =
    external?.firstName ||
    user?.firstName ||
    (emailLocal ? emailLocal.split(/[._]/)[0] : "") ||
    user?.username ||
    fallbackName;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Good {greeting}, <span style={{ color: "#1D4ED8" }}>{firstName}</span>
      </h1>
      <p className="text-gray-600 mt-2">
        You are logged in as {email || "—"}
      </p>
    </div>
  );
}

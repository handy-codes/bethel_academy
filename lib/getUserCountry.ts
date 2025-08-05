// lib/getUserCountry.ts
export async function getUserCountryCode(): Promise<string | undefined> {
  // ✅ Check if running on the browser and a test country is passed via URL
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const testCountry = params.get("country");
    if (testCountry) {
      console.log("🧪 Using test country from URL:", testCountry.toUpperCase());
      return testCountry.toUpperCase();
    }
  }

  // 🌍 Real IP-based country detection
  try {
    const res = await fetch("https://ipinfo.io/json?token=117a5c08192219");
    if (!res.ok) return undefined;
    const data = await res.json();
    console.log("🌍 Detected user country:", data.country);
    return data.country;
  } catch (e) {
    console.error("❌ Failed to fetch user country from IP info:", e);
    return undefined;
  }
}

// import { headers } from "next/headers";

// // For testing purposes, you can set this to any country code
// // Available test codes: 'NG' (Nigeria), 'KE' (Kenya), 'UG' (Uganda), 'GH' (Ghana),
// // 'US' (USA), 'GB' (UK), 'EU' (Europe), 'ZA' (South Africa), 'TZ' (Tanzania), 'RW' (Rwanda)
// const TEST_COUNTRY_CODE = "US"; // Testing US currency

// export async function getUserCountry(): Promise<string> {
//   // For development/testing, return the test country code
//   if (process.env.NODE_ENV === "development") {
//     return TEST_COUNTRY_CODE;
//   }

//   try {
//     // In production, use the actual IP geolocation
//     const response = await fetch("https://ipapi.co/json/");
//     const data = await response.json();
//     return data.country_code;
//   } catch (error) {
//     console.error("Error getting user country:", error);
//     return "NG"; // Default to Nigeria if there's an error
//   }
// }

// // Utility to get user's country code using ipinfo.io
// // Returns country code (e.g., 'NG', 'KE', 'US') or undefined

// export async function getUserCountryCode(): Promise<string | undefined> {
//   try {
//     const res = await fetch("https://ipinfo.io/json?token=117a5c08192219"); // Replace with your ipinfo.io token
//     if (!res.ok) return undefined;
//     const data = await res.json();
//     return data.country as string | undefined;
//   } catch (e) {
//     return undefined;
//   }
// }

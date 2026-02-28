'use client';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full max-w-md flex items-center justify-center">
      <SignIn
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: "#6C47FF",
          },
          elements: {
            headerTitle: "text-[#01579B]",
            headerSubtitle: "text-[#01579B]",
            formButtonPrimary:
              "bg-[#6C47FF] hover:opacity-90 text-white border-0",
          },
          layout: {
            logoImageUrl: "/bethel_logo.jpg",
            logoLinkUrl: "/",
            logoPlacement: "inside",
          },
        }}
      />
    </div>
  );
}
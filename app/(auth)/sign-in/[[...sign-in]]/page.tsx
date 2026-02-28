'use client';

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full max-w-md flex items-center justify-center px-4 py-6 sign-in-compact">
      <SignIn
        fallbackRedirectUrl="/"
        appearance={{
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
"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useEffect } from "react";

/**
 * When a signed-in user has no role, or has role 'student' but is in the Parent table,
 * call the fix-role API once and reload so Clerk session gets the correct role.
 */
export default function RoleSync() {
  const { user, isLoaded } = useUser();
  const triedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const role = user.publicMetadata?.role as string | undefined;
    const needsFix = role == null || role === "" || role === "student";
    if (!needsFix) return;
    if (triedRef.current) return;
    triedRef.current = true;

    fetch("/api/fix-role", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json().catch(() => ({}));
        if (data.updated) window.location.reload();
      })
      .catch(() => {});
  }, [isLoaded, user]);

  return null;
}

"use client";

import { useUser } from "@clerk/nextjs";
import { useRef, useEffect } from "react";

/**
 * When a signed-in user has no role in Clerk (e.g. new production instance),
 * call the fix-role API once and reload so Clerk session gets the updated role.
 */
export default function RoleSync() {
  const { user, isLoaded } = useUser();
  const triedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    const role = user.publicMetadata?.role as string | undefined;
    if (role != null && role !== "") return;
    if (triedRef.current) return;
    triedRef.current = true;

    fetch("/api/fix-role", { method: "POST" })
      .then((res) => {
        if (res.ok) window.location.reload();
      })
      .catch(() => {});
  }, [isLoaded, user]);

  return null;
}

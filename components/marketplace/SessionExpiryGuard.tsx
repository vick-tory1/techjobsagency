"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionExpiryGuard({ expiresAt }: { expiresAt?: string }) {
  useEffect(() => {
    const expiry = expiresAt ? Date.parse(expiresAt) : Number.NaN;
    if (!Number.isFinite(expiry)) return;

    const expireSession = () => {
      void signOut({ redirect: false }).finally(() => {
        window.location.replace("/login?expired=1");
      });
    };
    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      expireSession();
      return;
    }

    const timeout = window.setTimeout(expireSession, remaining);
    return () => window.clearTimeout(timeout);
  }, [expiresAt]);

  return null;
}

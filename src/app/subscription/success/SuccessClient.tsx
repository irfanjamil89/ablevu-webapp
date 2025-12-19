"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    // optional: session id store for debug / future
    if (sessionId) {
      sessionStorage.setItem("stripe_session_id", sessionId);
    }

    // basic safety
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    const userStr =
      typeof window !== "undefined"
        ? sessionStorage.getItem("user")
        : null;

    if (!token || !userStr) {
      router.replace("/"); // logout / invalid state
      return;
    }

    let user: any = null;
    try {
      user = JSON.parse(userStr);
    } catch {
      router.replace("/");
      return;
    }

    // ⏳ thora delay for better UX
    const t = setTimeout(() => {
      // ✅ role-based redirect (same as your style)
      if (user.user_role === "Business") {
        router.replace("/dashboard/business-overview");
      } else if (user.user_role === "Contributor") {
        router.replace("/dashboard/contributor-overview");
      } else {
        router.replace("/dashboard");
      }
    }, 1500);

    return () => clearTimeout(t);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold text-green-600 mb-2">
          Subscription Successful
        </h1>
        <p className="text-gray-600">
          Please wait, Your Business has been created..
        </p>
      </div>
    </div>
  );
}

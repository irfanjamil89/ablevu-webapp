"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    // basic safety
    const token = localStorage.getItem("access_token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/"); // logout / invalid state
      return;
    }

    const user = JSON.parse(userStr);

    // ⏳ thora delay for better UX
    setTimeout(() => {
      // ✅ role-based redirect
      if (user.user_role === "Business") {
        router.replace("/dashboard/business-overview");
      } else if (user.user_role === "Contributor") {
        router.replace("/dashboard/contributor-overview");
      } else {
        router.replace("/dashboard");
      }
    }, 1500);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold text-green-600 mb-2">
          Payment Successful 
        </h1>
        <p className="text-gray-600">
          Please wait, Business has been Claimed...
        </p>
      </div>
    </div>
  );
}

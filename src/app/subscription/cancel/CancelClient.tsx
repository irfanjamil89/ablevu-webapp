"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CancelClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const draftId = searchParams.get("draft_id"); // optional

    const token = localStorage.getItem("access_token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/");
      return;
    }

    const user = JSON.parse(userStr);

    setTimeout(() => {
      if (user.user_role === "Business") {
        router.replace("/dashboard/business-overview");
      } else if (user.user_role === "Contributor") {
        router.replace("/dashboard/contributor-overview");
      } else {
        router.replace("/dashboard");
      }
    }, 1800);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-xl font-bold text-red-600 mb-2">
          Subscription Cancelled
        </h1>
        <p className="text-gray-600">
          You cancelled the subscription checkout. No charges were made.
        </p>
        <p className="text-sm text-gray-400 mt-3">
          Redirecting you back to dashboard...
        </p>
      </div>
    </div>
  );
}

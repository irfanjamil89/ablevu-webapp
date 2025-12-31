"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RefreshClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/");
      return;
    }

    setTimeout(() => {
      router.replace("/dashboard/contributor-overview");
    }, 1800);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-xl font-bold text-orange-600 mb-2">
          Onboarding Link Expired
        </h1>
        <p className="text-gray-600">
          Please restart onboarding from your dashboard.
        </p>
        <p className="text-sm text-gray-400 mt-3">Redirecting...</p>
      </div>
    </div>
  );
}

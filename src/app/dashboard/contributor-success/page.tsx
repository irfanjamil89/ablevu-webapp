"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContributorSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  const status = params.get("status");

  useEffect(() => {
    if (status !== "success") return;

    // ⏳ 3 seconds ke baad contributor overview par redirect
    const timer = setTimeout(() => {
      router.replace("/dashboard/contributor-overview?from=success");
    }, 3000);

    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h1 className="text-xl font-bold text-green-600 mb-2">
          You’re Almost Done!
        </h1>
        <p className="text-gray-600">
           Your Stripe account has been successfully connected.
          You are being redirected to your contributor dashboard…
        </p>
      </div>
    </div>
  );
}

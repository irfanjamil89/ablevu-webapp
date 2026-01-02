"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReturnClient() {
  const router = useRouter();
  const [ui, setUi] = useState<"checking" | "success" | "incomplete">("checking");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userStr = sessionStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/");
      return;
    }

    // ✅ poll existing "me" endpoint (NO new endpoint)
    let tries = 0;
    const maxTries = 6; // ~12 seconds
    const interval = setInterval(async () => {
      tries++;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const me = await res.json();

        // update session copy
        sessionStorage.setItem("user", JSON.stringify(me));

        if (me?.paid_contributor) {
          setUi("success");
          clearInterval(interval);
          setTimeout(() => router.replace("/dashboard/contributor-overview"), 1200);
          return;
        }

        if (tries >= maxTries) {
          setUi("incomplete"); // still not marked (maybe user backed out)
          clearInterval(interval);
          setTimeout(() => router.replace("/dashboard/contributor-overview"), 1200);
        }
      } catch {
        if (tries >= maxTries) {
          setUi("incomplete");
          clearInterval(interval);
          setTimeout(() => router.replace("/dashboard/contributor-overview"), 1200);
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
        {ui === "checking" && (
          <>
            <h1 className="text-xl font-bold text-blue-600 mb-2">Verifying...</h1>
            <p className="text-gray-600">Checking your Stripe onboarding status.</p>
          </>
        )}

        {ui === "success" && (
          <>
            <h1 className="text-xl font-bold text-green-600 mb-2">
              Now you&apos;re a Paid Contributor
            </h1>
            <p className="text-gray-600">Setup completed successfully.</p>
          </>
        )}

        {ui === "incomplete" && (
          <>
            <h1 className="text-xl font-bold text-orange-600 mb-2">
              Still Pending
            </h1>
            <p className="text-gray-600">
              If you didn’t finish onboarding, please retry from dashboard.
            </p>
          </>
        )}

        <p className="text-sm text-gray-400 mt-3">Redirecting...</p>
      </div>
    </div>
  );
}

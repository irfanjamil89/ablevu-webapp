"use client";

import { useState } from "react";
import Header from "../component/Header2";
import Footer from "../component/Footer";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}stripe/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "abc123",
            orderId: "order_001",
            items: [
              {
                name: "Pro Plan",
                unitAmount: 1999, // cents
                quantity: 1,
              },
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await res.json();
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <main className="max-w-lg mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">
          Pro Plan — <b>$19.99</b>
        </p>

        <button
          onClick={startCheckout}
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-full font-semibold hover:bg-blue-800 disabled:opacity-60"
        >
          {loading ? "Redirecting…" : "Pay Now"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

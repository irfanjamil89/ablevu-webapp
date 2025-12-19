"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "../component/Header2";
import Footer from "../component/Footer";

type CartItem = {
  id: string;
  business_id: string;
  batch_id: string;
  amount: string | number;
  status: string;
  created_at: string;
};

type Business = {
  id: string;
  name: string;
  logo_url?: string | null;
  address?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  const [businessMap, setBusinessMap] = useState<Record<string, Business>>({});

  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const total = useMemo(() => {
    return cart.reduce((sum, item) => {
      const v =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [cart]);

  const formatMoney = (v: string | number) => {
    const n = typeof v === "string" ? parseFloat(v) : v;
    const safe = Number.isFinite(n) ? n : 0;
    return safe.toFixed(2);
  };

  const statusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    const base =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-bold border";
    if (s === "paid")
      return `${base} bg-green-50 text-green-700 border-green-200`;
    if (s === "pending")
      return `${base} bg-yellow-50 text-yellow-700 border-yellow-200`;
    if (s === "cancelled")
      return `${base} bg-red-50 text-red-700 border-red-200`;
    return `${base} bg-gray-50 text-gray-700 border-gray-200`;
  };

  // ✅ 1) fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      setLoadingCart(true);
      setError(null);

      try {
        if (!token || token === "null" || token === "undefined") {
          setCart([]);
          setError("Please login to view your cart.");
          return;
        }

        const res = await fetch(`${API_BASE}business-claim-cart/my-cart`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load cart items");

        const data = await res.json();
        const items = Array.isArray(data) ? data : data?.data ?? [];
        setCart(Array.isArray(data) ? data : data?.data ?? []);
        setCart(items.filter((x: any) => (x.status || "").toLowerCase() === "pending"));
      } catch (e: any) {
        setError(e.message || "Something went wrong");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [token]);

  // ✅ 2) fetch business list + build map (id -> business)
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoadingBusinesses(true);
      try {
        const res = await fetch(`${API_BASE}business/list1`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to load business list");

        const json = await res.json();
        const list: Business[] = json?.data ?? [];

        const map: Record<string, Business> = {};
        for (const b of list) map[b.id] = b;

        setBusinessMap(map);
      } catch (e) {
        // business list fail ho jaye to bhi cart work kare
        setBusinessMap({});
      } finally {
        setLoadingBusinesses(false);
      }
    };

    fetchBusinesses();
  }, []);

  const removeItem = async (cartId: string) => {
    try {
      if (!token) {
        throw new Error("Please login first");
      }

      const res = await fetch(
        `${API_BASE}business-claim-cart/delete/${cartId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to remove item");
      }

      // ✅ UI se bhi remove
      setCart((prev) => prev.filter((i) => i.id !== cartId));
    } catch (e: any) {
      setError(e.message || "Failed to remove item");
    }
  };

  const startCheckout = async () => {
  setPayLoading(true);
  setError(null);

  try {
    if (!token || token === "null" || token === "undefined") {
      throw new Error("Please login first.");
    }

    if (!cart.length) {
      throw new Error("Your cart is empty.");
    }

    const batch_id = cart[0]?.batch_id;
    if (!batch_id) throw new Error("batch_id not found in cart.");

    const res = await fetch("http://localhost:3006/stripe/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ batch_id }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message || "Failed to create checkout session");

    // ✅ UI: remove this batch from cart (pending list)
    setCart((prev) => prev.filter((i) => i.batch_id !== batch_id));

    window.location.href = data.url;
  } catch (e: any) {
    setError(e.message || "Something went wrong");
    setPayLoading(false);
  }
};

  return (
    <div>
      <Header />

      <main className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-2">Checkout</h1>
        <p className="text-gray-600 mb-6">
          Review your claim cart and proceed to payment.
        </p>

        {/* Cart Listing */}
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Cart</h2>
            {(loadingCart || loadingBusinesses) && (
              <span className="text-sm text-gray-500">Loading…</span>
            )}
          </div>

          {loadingCart ? (
            <div className="p-6 text-gray-600">Loading cart...</div>
          ) : cart.length === 0 ? (
            <div className="p-6 text-gray-600">No items in cart.</div>
          ) : (
            <div className="divide-y">
              {cart.map((item) => {
                const biz = businessMap[item.business_id];
                const name = biz?.name || "Business";
                const logo = biz?.logo_url || "/assets/images/b-img.png";
                const address = biz?.address || "";

                return (
                  <div
                    key={item.id}
                    className="p-5 flex items-start justify-between gap-4"
                  >
                    {/* left */}
                    <div className="flex gap-4 flex-1">
                      <img
                        src={logo}
                        alt={name}
                        className="w-14 h-14 rounded-xl object-cover border bg-gray-50"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-gray-900 text-lg leading-tight">
                              {name}
                            </p>
                            {address ? (
                              <p className="text-sm text-gray-600 mt-1">
                                {address}
                              </p>
                            ) : null}
                          </div>

                          {/* ✅ bigger status badge */}
                          <span className={statusBadge(item.status)}>
                            {(item.status || "pending").toUpperCase()}
                          </span>
                        </div>

                        {/* ✅ removed batch + removed business_id */}
                        <p className="text-xs text-gray-400 mt-2">
                          Added:{" "}
                          {item.created_at
                            ? new Date(item.created_at).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {/* right */}
                    <div className="text-right min-w-[120px] flex flex-col items-end gap-2">
                      <p className="font-extrabold text-gray-900 text-lg">
                        ${formatMoney(item.amount)}
                      </p>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total */}
          <div className="p-5 border-t bg-gray-50 flex items-center justify-between">
            <span className="font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={startCheckout}
          disabled={payLoading || loadingCart || cart.length === 0}
          className="mt-6 w-full bg-blue-700 text-white py-3 rounded-full font-semibold hover:bg-blue-800 disabled:opacity-60"
        >
          {payLoading ? "Redirecting…" : "Pay Now"}
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

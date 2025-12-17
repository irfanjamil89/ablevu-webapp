
"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../component/Header2";
import { ShoppingCart, Trash2 } from "lucide-react";

type CartItem = {
  id: string;
  business_id: string;
  amount: string | number;
  status: string;
  created_at: string;
};

type BusinessMini = {
  id: string;
  name: string;
  logo_url?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  paid_contributor: boolean;
  email: string;
  profile_picture_url?: string;
}
import Header from '../component/Header2';
import DashboardContent from '../component/DashboardContent';
import { useUser } from "@/app/component/UserContext";

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() >= expiry;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  const pathname = usePathname();
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ✅ Cart states (REAL)
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  const [bizMap, setBizMap] = useState<Record<string, BusinessMini>>({});
  const cartRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);



  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const loggedIn = !!token && token !== "null" && token !== "undefined";

  // ✅ USD formatter
  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  // ✅ total from cart amount
  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const v =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [cartItems]);
  // Update imageKey when user profile picture changes
  useEffect(() => {
    if (user?.profile_picture_url) {
      setImageKey(Date.now());
    }
  }, [user?.profile_picture_url]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;

    // cart
    if (cartOpen && cartRef.current && !cartRef.current.contains(target)) {
      setCartOpen(false);
    }

    // notifications (optional)
    if (
      notificationsOpen &&
      notifRef.current &&
      !notifRef.current.contains(target)
    ) {
      setNotificationsOpen(false);
    }
    
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [cartOpen, notificationsOpen, ]);


  // ✅ fetch businesses list to map id -> name/logo
  const fetchBusinessesMini = async () => {
    try {
      const res = await fetch(`${API_BASE}business/list1`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) return;

      const json = await res.json();
      const arr: any[] = Array.isArray(json) ? json : json?.data ?? [];

      const map: Record<string, BusinessMini> = {};
      arr.forEach((b) => {
        if (b?.id) {
          map[b.id] = { id: b.id, name: b.name, logo_url: b.logo_url };
        }
      });

      setBizMap(map);
    } catch (e) {
      console.error("fetchBusinessesMini error", e);
    }
  };

  // ✅ fetch cart from backend
  const fetchCart = async () => {
    try {
      if (!loggedIn) {
        setCartItems([]);
        return;
      }

      setCartLoading(true);

      const res = await fetch(`${API_BASE}business-claim-cart/my-cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to load cart");

      const data = await res.json();
      const items: CartItem[] = Array.isArray(data) ? data : data?.data ?? [];
      setCartItems(items);
    } catch (e) {
      console.error("fetchCart error", e);
    } finally {
      setCartLoading(false);
    }
  };

  // ✅ delete single item from backend
  const removeFromCart = async (id: string) => {
    try {
      if (!loggedIn) return;

      const res = await fetch(`${API_BASE}business-claim-cart/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to remove item");

      setCartItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error("removeFromCart error", e);
    }
  };

  // ✅ clear cart backend (delete all)
  const clearCart = async () => {
    try {
      if (!loggedIn) return;
      await Promise.all(cartItems.map((x) => removeFromCart(x.id)));
      setCartItems([]);
    } catch (e) {
      console.error("clearCart error", e);
    }
  };

  useEffect(() => {
    // ✅ preload business map once
    fetchBusinessesMini();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Token from localStorage:", token);

    if (!token) {
      setError("Please log in to continue.");
      setLoading(false);
      router.push("/");
      return;
    }

    if (isTokenExpired(token)) {
      console.log("Token expired, logging out...");
      handleLogout();
      return;
    }

    fetch("https://staging-api.qtpack.co.uk/users/1", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    // If user is already loaded from context, skip API call
    if (user) {
      setLoading(false);
      return;
    }

    // Fetch user data using the token for authentication
    fetch('https://staging-api.qtpack.co.uk/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then((response) => {
        if (response.status === 401) {
          console.log("Token invalid or expired (401), logging out...");
          handleLogout();
          return null;
        }
        return response.json();
      })
      .then((data) => {
        if (!data) return;

        setUser(data);
        sessionStorage.setItem("user", JSON.stringify(data));

        if (data.user_role === "Business") {
          router.push("/dashboard/business-overview");
          setLoading(false);
          return;
        } else if (data.user_role === "Contributor") {
          router.push("/dashboard/contributor-overview");
          setLoading(false);
          return;
        } else if (data.user_role === "User") {
          router.push("/dashboard/saved");
          setLoading(false);
          return;
        }

        sessionStorage.setItem('user', JSON.stringify(data));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Failed to fetch user data.");
        setLoading(false);
      });

    const tokenCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem("access_token");
      if (!currentToken || isTokenExpired(currentToken)) {
        console.log("Token expired during session, logging out...");
        clearInterval(tokenCheckInterval);
        handleLogout();
      }
    }, 60000);

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}notifications/getnotification`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}notifications/read/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (item: any) => {
    if (!item.meta) return;
    const meta = typeof item.meta === "string" ? JSON.parse(item.meta) : item.meta;

    switch (meta.type) {
      case "business-created":
      case "business-status":
        window.location.href = `/business-profile/${meta.id}`;
        break;
      default:
        console.log("Unhandled notification type:", meta.type);
    }

    markAsRead(item.id);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Get profile image URL with cache busting
  const getProfileImageUrl = () => {
    if (!user?.profile_picture_url) {
      return "/assets/images/profile.png";
    }
    const url = user.profile_picture_url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${imageKey}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }

  return (
    <div>
      {user?.user_role == "Admin" ? (
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 lg:px-6 py-1">
            <div className="flex items-center gap-[85px]">
              <Link href="/" className="w-[180px]">
                <img src="/assets/images/logo.png" alt="AbleVu Logo" className="w-[180px]" />
              </Link>

              <div className="flex items-center gap-5 text-gray-700">
                <span className="text-2xl">👋</span>
                <span className="font-medium text-xl">
                  Welcome Back! <span>{user.first_name} {user.last_name} ({user.user_role})</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 relative">
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setCartOpen(false);
                    if (!notificationsOpen) fetchNotifications();
                  }}
                  className="flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 17h5l-1.405-1.405C18.21 14.79 18 13.918 18 13V9a6 6 0 10-12 0v4c0 .918-.21 1.79-.595 2.595L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>

                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
                    <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                      {notifications.length === 0 && (
                        <li className="px-4 py-6 text-gray-500 text-sm text-center">
                          No new notifications
                        </li>
                      )}

                      {notifications.map((item) => (
                        <li
                          key={item.id}
                          className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleNotificationClick(item)}
                        >
                          <div className="w-full pr-2">
                            <p className="text-sm font-medium">{item.content}</p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            className="hover:opacity-80"
                          >
                            <img
                              src="https://www.svgrepo.com/show/490436/trash-can.svg"
                              alt="Mark as read"
                              className="w-5 h-5"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Cart Dropdown */}
              <div className="relative" ref={cartRef}>
                <button
                  onClick={async () => {
                    setCartOpen((prev) => !prev);
                    setNotificationsOpen(false);

                    // ✅ open par fetch latest cart
                    if (!cartOpen) {
                      await fetchCart();
                    }
                  }}
                  className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full shadow">
                      {cartItems.length}
                    </span>
                  )}
                </button>

                {cartOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="px-5 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-base text-gray-900">Cart</p>
                          <p className="text-xs text-gray-500">
                            {cartItems.length} item{cartItems.length > 1 ? "s" : ""} in your cart
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-[11px] text-gray-500">Total</p>
                          <p className="font-extrabold text-gray-900">{formatUSD(cartTotal)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    {cartLoading ? (
                      <div className="px-6 py-10 text-center text-gray-600">Loading cart...</div>
                    ) : cartItems.length === 0 ? (
                      <div className="px-6 py-10 text-center">
                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="h-6 w-6 text-gray-500" />
                        </div>
                        <p className="text-sm font-semibold text-gray-800">Your cart is empty</p>
                        <p className="text-xs text-gray-500 mt-1">Add items to see them here.</p>
                      </div>
                    ) : (
                      <ul className="max-h-96 overflow-y-auto">
                        {cartItems.map((item) => {
                          const biz = bizMap[item.business_id];
                          const businessName =
                            biz?.name ?? `Business (${item.business_id?.slice(0, 6)}...)`;
                          const logo = biz?.logo_url || "/assets/images/b-img.png";

                          const amountNum =
                            typeof item.amount === "string"
                              ? parseFloat(item.amount)
                              : item.amount;

                          return (
                            <li
                              key={item.id}
                              className="px-5 py-4 border-b last:border-b-0 hover:bg-gray-50 transition"
                            >
                              <div className="flex items-start gap-4">
                                <img
                                  src={logo}
                                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                                  alt={businessName}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      "/assets/images/b-img.png";
                                  }}
                                />

                                <div className="flex-1">
                                  <p className="text-sm font-bold text-gray-900 leading-5">
                                    {businessName}
                                  </p>

                                  {/* ✅ status bigger */}
                                  <p className="mt-1 text-sm font-semibold text-gray-700">
                                    Status:{" "}
                                    <span className="capitalize">{item.status}</span>
                                  </p>

                                  <p className="text-sm font-extrabold text-gray-900 mt-2">
                                    {formatUSD(Number(amountNum || 0))}
                                  </p>
                                </div>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                  }}
                                  className="p-2 rounded-xl hover:bg-red-50 text-red-600 transition"
                                  title="Remove"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}

                    {/* Footer */}
                    {cartItems.length > 0 && (
                      <div className="p-4 border-t bg-white">
                        <div className="flex gap-3">
                          <button
                            onClick={() => (window.location.href = "/checkout")}
                            className="w-full rounded-xl bg-[#0519ce] text-white py-2.5 text-sm font-bold hover:opacity-90 shadow"
                          >
                            View Cart
                          </button>

                          <button
                            onClick={clearCart}
                            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold hover:bg-gray-50"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Logout */}
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Header />
      )}

      <div className="flex">
        <div className=" w-[300px] pt-5  bg-white border-r border-gray-200 flex flex-col justify-between">
          {/* Top Navigation */}
          <div className="p-4 mb-15 sticky top-0 ">
            <ul className="space-y-4 font-medium">
              {user?.user_role === "Admin" ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${pathname === "/dashboard"
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75h-5.25V14.25h-6v7.5H3.75A.75.75 0 013 21V9.75z"
                      />
                    </svg>

                    Overview

                  </Link>

                  <button
                    onClick={() => setIsSetupOpen(!isSetupOpen)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" />
                      </svg>
                      <span className="font-semibold">Setup</span>
                    </div>
                    <svg
                      className={`w-4 h-4 transition-transform ${isSetupOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isSetupOpen && (
                    <div className="pl-4 space-y-1">
                      <Link href="/dashboard/business-type"
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-type")
                          ? "bg-blue-700 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                          <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Business Type
                      </Link>

                      <Link href="/dashboard/accessibility-feature-type"
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/accessibility-feature-type")
                          ? "bg-blue-700 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-1.5l1.2 4.8a1 1 0 0 1-1.94.485L12 14.236l-.765 3.049a1 1 0 0 1-1.94-.485L10.5 12H9a1 1 0 0 1-1-1z" />
                        </svg>
                        Features type
                      </Link>

                      <Link href="/dashboard/review-type"
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/review-type")
                          ? "bg-blue-700 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-7 9H5V9h8v2zm4-4H5V5h12v2z" />
                          <path d="M19 14.5l-1.41-1.41-2.09 2.09-1.5-1.5-1.41 1.41 2.91 2.91z" />
                        </svg>
                        Review Type
                      </Link>

                      <Link href="/dashboard/feedback-type"
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/feedback-type")
                          ? "bg-blue-700 text-white font-semibold"
                          : "text-gray-700 hover:bg-gray-100"
                          }`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Feedback Type
                      </Link>
                    </div>
                  )}
                  <Link href="/dashboard/accessibility-features"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/accessibility-features")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    {/* <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v12M6 12h12" />
                      <circle cx="12" cy="12" r="3" />
                    </svg> */}

                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 2c4.418 0 8 3.582 8 8s-3.582 8-8 8-8-3.582-8-8 3.582-8 8-8zm0 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-4 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2h-1.5l1.2 4.8a1 1 0 0 1-1.94.485L12 14.236l-.765 3.049a1 1 0 0 1-1.94-.485L10.5 12H9a1 1 0 0 1-1-1z" />
                    </svg>


                    Accessibility Features

                  </Link>


                  <Link href="/dashboard/businesses" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/businesses")

                    ? "bg-blue-700 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}>

                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>

                    Businesses

                  </Link>

                  {/* <!-- Accessible Cities --> */}
                  <Link href="/dashboard/accessible-cities"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/accessible-cities")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- Thumbs Up Icon --> */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    Accessible Cities

                  </Link>


                  <Link href="/dashboard/partners"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/partners")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`} >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    Partners

                  </Link>


                  {/* <!-- Coupon Codes --> */}
                  <Link href="/dashboard/couponcodes"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/couponcodes")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>


                    Coupon Codes

                  </Link>


                  {/* <!-- Feedback --> */}

                  <Link href="/dashboard/feedback"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/feedback")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>

                    Feedback

                  </Link>



                  <Link href="/dashboard/users"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/users")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>

                    Users
                  </Link>


                  <Link href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/profile")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={24}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {/* Outer Circle */}
                      <circle cx="256" cy="256" r="208" />
                      {/* Head */}
                      <circle cx="256" cy="176" r="72" />
                      {/* Shoulders/Upper Body */}
                      <path d="M128 400c0-88 256-88 256 0" />
                    </svg>

                    Profile
                  </Link>
                </>
              ) : user?.user_role === "Business" ? (
                <>
                  <Link href="/dashboard/business-overview"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-overview")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <img src="/assets/images/overview.svg" className='w-5 h-5' alt="" />

                    Overview

                  </Link>

                  <Link href="/dashboard/subscriptions"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/subscriptions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={24}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {/* Outer Circle */}
                      <circle cx="256" cy="256" r="208" />
                      {/* Head */}
                      <circle cx="256" cy="176" r="72" />
                      {/* Shoulders/Upper Body */}
                      <path d="M128 400c0-88 256-88 256 0" />
                    </svg>

                    Subscriptions
                  </Link>



                  <Link href="/dashboard/questions"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/questions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M200 200a56 56 0 01112 0c0 28-21 44-33 52s-23 18-23 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="256" cy="336" r="16" fill="currentColor" />
                    </svg>

                    Questions
                  </Link>




                  <Link href="/dashboard/reviews"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/reviews")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M128 224H64a32 32 0 00-32 32v192a32 32 0 0032 32h64a32 32 0 0032-32V256a32 32 0 00-32-32z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M384 224h-92l12-70c6-36-12-70-41-86a14 14 0 00-23 9v94c0 28-22 53-48 53h-20v224h226c27 0 49-20 52-47l17-160c3-29-17-53-43-53z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Reviews
                  </Link>

                  <Link href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/profile")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={24}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {/* Outer Circle */}
                      <circle cx="256" cy="256" r="208" />
                      {/* Head */}
                      <circle cx="256" cy="176" r="72" />
                      {/* Shoulders/Upper Body */}
                      <path d="M128 400c0-88 256-88 256 0" />
                    </svg>

                    Profile
                  </Link>

                </>
              ) : user?.user_role == "Contributor" ? (
                <>

                  <Link href="/dashboard/contributor-overview"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/contributor-overview")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <img src="/assets/images/overview.svg" className='w-5 h-5' alt="" />

                    Overview

                  </Link>
                  {user?.paid_contributor ? (
                    <Link
                      href="/dashboard/subscriptions"
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/subscriptions")
                        ? "bg-blue-700 text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 256 256"
                        width="32"
                        height="32"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a87.77,87.77,0,0,1-54.14-18.69,52,52,0,0,1,108.28,0A87.77,87.77,0,0,1,128,216Zm0-80a40,40,0,1,1,40-40A40,40,0,0,1,128,136Z" />
                      </svg>
                      Subscriptions
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard/saved" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/saved")
                        ? "bg-blue-700 text-white font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                          width="32"
                          height="32"
                          className="w-5 h-5"
                        >
                          <path
                            d="M352 48H160a48 48 0 00-48 48v368l144-112 144 112V96a48 48 0 00-48-48z"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="32"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        Saved
                      </Link>
                    </>
                  )
                  }







                  <Link href="/dashboard/questions"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/questions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M200 200a56 56 0 01112 0c0 28-21 44-33 52s-23 18-23 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="256" cy="336" r="16" fill="currentColor" />
                    </svg>

                    Questions
                  </Link>




                  <Link href="/dashboard/reviews"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/reviews")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M128 224H64a32 32 0 00-32 32v192a32 32 0 0032 32h64a32 32 0 0032-32V256a32 32 0 00-32-32z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M384 224h-92l12-70c6-36-12-70-41-86a14 14 0 00-23 9v94c0 28-22 53-48 53h-20v224h226c27 0 49-20 52-47l17-160c3-29-17-53-43-53z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Reviews
                  </Link>

                  <Link href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/profile")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={24}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {/* Outer Circle */}
                      <circle cx="256" cy="256" r="208" />
                      {/* Head */}
                      <circle cx="256" cy="176" r="72" />
                      {/* Shoulders/Upper Body */}
                      <path d="M128 400c0-88 256-88 256 0" />
                    </svg>

                    Profile
                  </Link>

                </>
              ) : user?.user_role === "User" ? (
                <>
                  <Link href="/dashboard/saved" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/saved")
                    ? "bg-blue-700 text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                    }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M352 48H160a48 48 0 00-48 48v368l144-112 144 112V96a48 48 0 00-48-48z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Saved
                  </Link>



                  <Link href="/dashboard/questions"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/questions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M256 64C150 64 64 150 64 256s86 192 192 192 192-86 192-192S362 64 256 64z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeMiterlimit="10"
                      />
                      <path
                        d="M200 200a56 56 0 01112 0c0 28-21 44-33 52s-23 18-23 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle cx="256" cy="336" r="16" fill="currentColor" />
                    </svg>

                    Questions
                  </Link>




                  <Link href="/dashboard/reviews"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/reviews")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      className="w-5 h-5"
                    >
                      <path
                        d="M128 224H64a32 32 0 00-32 32v192a32 32 0 0032 32h64a32 32 0 0032-32V256a32 32 0 00-32-32z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M384 224h-92l12-70c6-36-12-70-41-86a14 14 0 00-23 9v94c0 28-22 53-48 53h-20v224h226c27 0 49-20 52-47l17-160c3-29-17-53-43-53z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="32"
                        strokeLinejoin="round"
                      />
                    </svg>

                    Reviews
                  </Link>

                  <Link href="/dashboard/become-contributor"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/become-contributor")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <img src="/assets/images/becomecontributor.svg" alt="" className='w-5 h-5' />
                    Become Contributor
                  </Link>

                  <Link href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/profile")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      width="32"
                      height="32"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={24}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      {/* Outer Circle */}
                      <circle cx="256" cy="256" r="208" />
                      {/* Head */}
                      <circle cx="256" cy="176" r="72" />
                      {/* Shoulders/Upper Body */}
                      <path d="M128 400c0-88 256-88 256 0" />
                    </svg>

                    Profile
                  </Link>
                </>
              ) : (
                <>
                </>

              )}


            </ul>
          </div>

          {/* <!-- Bottom Profile Section --> */}
          <div className="border-t mt-4 border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {user ? (

                  // <img
                  //   src={user.profile_picture_url || "/assets/images/profile.png"}
                  //   alt={user.first_name}
                  //   className=""
                  //   onError={(e) => {
                  //     (e.target as HTMLImageElement).src = "/assets/images/profile.png";
                  //   }}
                  // />\

                  <img
                    key={imageKey}
                    src={getProfileImageUrl()}
                    alt={user?.first_name || "User"}
                    className="cursor-pointer h-10 w-10 mr-1 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src !== "/assets/images/profile.png") {
                        console.log("Header: Image load error, using fallback");
                        target.src = "/assets/images/profile.png";
                      }
                    }}
                  />

                ) : (
                  <div>Loading...</div> // Show loading message until user data is fetched
                )}



              </div>
              {/* Display User Info */}
              <div>
                {/* Show User's Name and Role */}
                {user ? (
                  <>
                    <div className="text-sm font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                    <div className="text-xs text-gray-500">{user.user_role}</div>
                  </>
                ) : (
                  <div>Loading...</div> // Show loading message until user data is fetched
                )}
              </div>
            </div>
          </div>
        </div >
        <DashboardContent>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
}
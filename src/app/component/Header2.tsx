"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";
import Feedback from "./Feedback";
import AddBusinessModal from "./AddBusinessModal";
import { ShoppingCart, Trash2 } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  paid_contributor: boolean;
  email: string;
  profile_picture_url: string;
}

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


export default function Header2() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [OpenFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [OpenAddBusinessModal, setOpenAddBusinessModal] = useState(false);

  const [Loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // ✅ Cart states
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);

  // ✅ Business map: business_id -> {name, logo}
  const [bizMap, setBizMap] = useState<Record<string, BusinessMini>>({});
  const cartRef = useRef<HTMLLIElement | null>(null);
  const notifRef = useRef<HTMLLIElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);


  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      const v =
        typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
      return sum + (Number.isFinite(v) ? v : 0);
    }, 0);
  }, [cartItems]);

  const getUserFromSession = (): User | null => {
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
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

      // user dropdown (optional)
      if (dropdownOpen && userRef.current && !userRef.current.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, notificationsOpen, dropdownOpen]);


  const handleBusinessCreated = () => setOpenAddBusinessModal(false);

  useEffect(() => {
    const storedUser = getUserFromSession();
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!isMounted) return;
    const t = localStorage.getItem("access_token");
    setIsLoggedIn(!!t && t !== "null" && t !== "undefined");
  }, [isMounted]);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    window.location.href = "/";
  };

  // -----------------------------
  // ✅ Fetch Businesses (list1) -> build id->name map
  // -----------------------------
  const fetchBusinessMap = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}business/list1`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) return;

      const json = await res.json();
      const rows: BusinessMini[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : [];

      const map: Record<string, BusinessMini> = {};
      for (const b of rows) map[b.id] = b;
      setBizMap(map);
    } catch (e) {
      console.error("fetchBusinessMap error:", e);
    }
  }, []);

  // -----------------------------
  // ✅ Fetch Cart (my-cart)
  // -----------------------------
  const fetchCart = useCallback(async () => {
  try {
    if (!token || token === "null" || token === "undefined") {
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

    if (!res.ok) {
      setCartItems([]);
      return;
    }

    const json = await res.json();
    const rows: CartItem[] = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
      ? json.data
      : [];

    // ✅ only pending
    const pendingOnly = rows.filter(
      (x: any) => (x.status || "").toLowerCase() === "pending"
    );

    setCartItems(pendingOnly);
  } catch (e) {
    console.error("fetchCart error:", e);
    setCartItems([]);
  } finally {
    setCartLoading(false);
  }
}, [token]);

  // ✅ When cart opens => load cart + business names
  useEffect(() => {
    if (!cartOpen) return;
    fetchCart();
    fetchBusinessMap();
  }, [cartOpen, fetchCart, fetchBusinessMap]);

  // ✅ Remove from cart (backend + UI)
  const removeFromCart = async (id: string) => {
    try {
      if (!token) return;

      // optimistic UI
      setCartItems((prev) => prev.filter((x) => x.id !== id));

      const res = await fetch(`${API_BASE}business-claim-cart/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // if failed => reload actual
      if (!res.ok) {
        await fetchCart();
      }
    } catch (e) {
      console.error("removeFromCart error:", e);
      await fetchCart();
    }
  };

  // -----------------------------
  // Notifications (same as yours)
  // -----------------------------
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
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (item: any) => {
    if (!item.meta) return;
    const meta =
      typeof item.meta === "string" ? JSON.parse(item.meta) : item.meta;

    switch (meta.type) {
      case "business-created":
        window.location.href = `/business-profile/${meta.id}`;
        break;
      case "business-status":
        window.location.href = `/business-profile/${meta.id}`;
        break;
      default:
        console.log("Unhandled notification type:", meta.type);
    }
    markAsRead(item.id);
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchNotifications();
    const interval = setInterval(() => fetchNotifications(), 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // --------------------------------
  // Loading screen
  // --------------------------------
  if (Loading) {
    return (
      <div className="fixed h-screen w-full flex justify-center items-center z-10 ">
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
      <header className="relative z-50  w-full  border-b border-gray-200">
        <div className="m-auto bg-white px-1  lg:mx-auto rounded-full lg:px-6 lg:py-4 md:px-12 md:bg-transparent">
          <div className="flex w-full items-center justify-between rounded-full bg-white px-5 md:px-4 py-2">
            <div className="w-48">
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Home"
              >
                <img
                  src="/assets/images/logo.png"
                  alt="logo-Ablevu"
                  className="w-48"
                />
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                name="hamburger"
                id="hamburger"
                className="peer hidden"
              />
              <label
                htmlFor="hamburger"
                className="peer-checked:hamburger z-20 block cursor-pointer p-2 lg:hidden"
              >
                <div className="m-auto h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
                <div className="m-auto mt-2 h-0.5 w-6 rounded bg-sky-900 transition duration-300"></div>
              </label>

              <div className="fixed inset-0 w-[100%] translate-x-[-100%] border-r shadow-xl transition duration-300 peer-checked:translate-x-0 lg:static lg:w-auto lg:translate-x-0 lg:border-r-0 lg:shadow-none">
                <div className="flex h-full flex-col justify-center lg:flex-row lg:items-center w-full bg-white lg:bg-transparent">
                  <ul className="list-center space-y-8 px-6 pt-32 text-gray-700 md:pe-6 lg:flex lg:space-x-4 lg:space-y-0 lg:pt-0 font-['Roboto'] font-bold">
                    <li>
                      <Link href="/" className="group relative">
                        <span className="text-black-800 relative">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/business" className="group relative">
                        <span className="group-hover:text-black-800 relative">
                          Businesses
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contributor" className="group relative">
                        <span className="group-hover:text-black-800 relative">
                          Contributor
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/access-friendly-city"
                        className="group relative"
                      >
                        <span className="group-hover:text-black-800 relative">
                          Access-friendly Cities
                        </span>
                      </Link>
                    </li>

                    {isLoggedIn ? (
                      <div className="flex">
                        <li
                          onClick={() => setOpenFeedbackModal(true)}
                          className="mr-4 cursor-pointer"
                        >
                          <span className="relative">Share Feedback</span>
                        </li>

                        { user?.user_role !== "User" ? (
                          <li
                            onClick={() => setOpenAddBusinessModal(true)}
                            className="cursor-pointer"
                          >
                            <span className="relative">Add Business</span>
                          </li>
                        ) : null }
                      </div>
                    ) : null}

                    <li>
                      <Link href="/search" className="group relative">
                        <span className="group-hover:text-black-800 relative">
                          Search
                        </span>
                      </Link>
                    </li>

                    {/* Notifications Dropdown */}
                    <li className="relative m-right-0" ref={notifRef}>
                      <button
                        onClick={() => {
                          setNotificationsOpen((prev) => !prev);
                          setCartOpen(false);
                          setDropdownOpen(false);
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
                        <div className="absolute right-0 top-10 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
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
                                  <p className="text-sm font-medium">
                                    {item.content}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(item.id);
                                  }}
                                  className="hover:opacity-80"
                                >
                                  <img
                                    src="https://www.svgrepo.com/show/497079/eye-slash.svg"
                                    alt="Mark as read"
                                    className="w-5 h-5"
                                  />
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>

                    {/* Cart Dropdown (✅ integrated) */}
                    <li className="relative" ref={cartRef}>
                      <button
                        onClick={async () => {
                          setCartOpen(!cartOpen);
                          setNotificationsOpen(false);
                          setDropdownOpen(false);

                          if (!cartOpen) {
                            await fetchCart(); // ✅ fresh cart
                          }
                        }}
                        className="relative flex items-center justify-center rounded-full p-2 hover:bg-gray-100 transition"
                      >
                        <ShoppingCart className="h-6 w-6" />

                        {cartItems.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full shadow">
                            {cartItems.length}
                          </span>
                        )}
                      </button>

                      {cartOpen && (
                        <div className="absolute top-10 right-0 mt-3 w-[26rem] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                          {/* Header */}
                          <div className="px-5 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-base text-gray-900">
                                  Cart
                                </p>
                                <p className="text-xs text-gray-500">
                                  {cartItems.length} item
                                  {cartItems.length > 1 ? "s" : ""} in your cart
                                </p>
                              </div>

                              <div className="text-right">
                                <p className="text-[11px] text-gray-500">
                                  Total
                                </p>
                                <p className="font-extrabold text-gray-900">
                                  {formatUSD(cartTotal)}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Body */}
                          {cartLoading ? (
                            <div className="px-6 py-10 text-center text-gray-500">
                              Loading cart...
                            </div>
                          ) : cartItems.length === 0 ? (
                            <div className="px-6 py-10 text-center">
                              <p className="text-sm font-semibold">
                                Your cart is empty
                              </p>
                            </div>
                          ) : (
                            <ul className="max-h-[22rem] overflow-y-auto">
                              {cartItems.map((item) => {
                                const biz = bizMap[item.business_id];
                                const amount =
                                  typeof item.amount === "string"
                                    ? parseFloat(item.amount)
                                    : item.amount;

                                return (
                                  <li
                                    key={item.id}
                                    className="px-5 py-4 border-b"
                                  >
                                    <div className="flex gap-4">
                                      <img
                                        src={
                                          biz?.logo_url ||
                                          "/assets/images/b-img.png"
                                        }
                                        className="h-14 w-14 rounded-xl object-cover"
                                      />

                                      <div className="flex-1">
                                        <p className="font-bold text-sm">
                                          {biz?.name || "Business"}
                                        </p>

                                        <p className="text-sm font-semibold mt-1 capitalize">
                                          Status: {item.status}
                                        </p>

                                        <p className="font-extrabold mt-2">
                                          {formatUSD(Number(amount || 0))}
                                        </p>
                                      </div>

                                      <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-xl"
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
                                  onClick={() =>
                                    (window.location.href = "/checkout")
                                  }
                                  className="w-full rounded-xl bg-[#0519ce] text-white py-2.5 text-sm font-bold hover:opacity-90 shadow"
                                >
                                  Checkout
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  </ul>

                  {/* Auth Buttons / Logged-in Dropdown */}
                  <div className="flex items-center space-x-3">
                    {!isLoggedIn ? (
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setOpenSignupModal(true)}
                          className="group relative flex items-center gap-2 rounded-full cursor-pointer border-2 bg-gradient-to-r from-[#0519ce] to-[#0414a8] py-2.5 px-6 text-white font-semibold transition-all duration-300 "
                        >
                          Sign Up
                        </button>

                        <button
                          onClick={() => setOpenLoginModal(true)}
                          className="group relative flex items-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-[#0519ce] to-[#0414a8] py-2.5 px-7 text-white font-semibold transition-all duration-300 "
                        >
                          Log In
                        </button>
                      </div>
                    ) : (
                      <div className="relative user-dropdown" ref={userRef}>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => {
                            setDropdownOpen((prev) => !prev);
                            setCartOpen(false);
                            setNotificationsOpen(false);
                          }}
                        >
                          <img
                            src={
                              user?.profile_picture_url ||
                              "/assets/images/profile.png"
                            }
                            alt="User"
                            className="cursor-pointer h-10 w-10 mr-1"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "/assets/images/profile.png";
                            }}
                          />
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5"
                          >
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </div>

                        {dropdownOpen && (
                          <div className="absolute right-0 mt-2 w-40 p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                            <ul className="text-sm text-gray-700">
                              <li>
                                <button
                                  onClick={() =>
                                    (window.location.href = "/dashboard")
                                  }
                                  className="flex w-full text-left px-4 py-2 hover:text-[#0519ce] hover:bg-[#f0f1ff]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                  </svg>{" "}
                                  Dashboard
                                </button>
                              </li>
                              <hr className="my-2  border-gray-200" />
                              <li>
                                <button
                                  onClick={handleLogout}
                                  className="flex w-full text-left px-4 py-2 hover:text-red-600 hover:bg-[#ffebeb]"
                                >
                                   <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                  </svg>{" "}
                                  Logout
                                </button>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      {openLoginModal && (
        <Login
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
        />
      )}
      {openSignupModal && (
        <Signup
          setOpenSignupModal={setOpenSignupModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}
      {OpenForgotPasswordModal && (
        <ForgotPassword
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}

      {openSuccessModal && (
        <Successmodal
          setOpenSuccessModal={setOpenSuccessModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
        />
      )}

      {OpenFeedbackModal && (
        <Feedback setOpenFeedbackModal={setOpenFeedbackModal} />
      )}

      {OpenAddBusinessModal && (
        <AddBusinessModal
          setOpenAddBusinessModal={setOpenAddBusinessModal}
          onBusinessCreated={handleBusinessCreated}
        />
      )}
    </div>
  );
}

"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";
import Feedback from "./Feedback";
import AddBusinessModal from "./AddBusinessModal";
import { User as UserIcon, ShoppingCart, Trash2 } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  paid_contributor: boolean;
  email: string;
  profile_picture_url: string;
}
import { useUser } from "@/app/component/UserContext";

type CartItem = {
  id: string;
  business_id: string;
  amount: string | number;
  status: string;
};

type BusinessMini = {
  id: string;
  name: string;
  logo_url?: string | null;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;


export default function Header() {
  // Use context for user state
  const { user, setUser, refreshUser } = useUser();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [OpenFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [OpenAddBusinessModal, setOpenAddBusinessModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(false);
  const [bizMap, setBizMap] = useState<Record<string, BusinessMini>>({});
  const cartRef = useRef<HTMLLIElement | null>(null);
  const notifRef = useRef<HTMLLIElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);


  const getUserFromSession = (): User | null => {
    const userData = sessionStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  };

  const handleBusinessCreated = () => {
    setOpenAddBusinessModal(false);
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
      if (
        dropdownOpen &&
        userRef.current &&
        !userRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [cartOpen, notificationsOpen, dropdownOpen]);
  const [Loading, setLoading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());

  // Update imageKey when user profile picture changes
  useEffect(() => {
  if (user?.profile_picture_url) setImageKey(Date.now());
}, [user?.profile_picture_url]);

  
  // Run only after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check login status and sync with user context
  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem("access_token");
    const isUserLoggedIn = !!token && !!user;
    setIsLoggedIn(isUserLoggedIn);
  }, [isMounted, user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
      if (!target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setUser(null); // Clear user from context
    window.location.href = "/";
  };

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

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const loggedIn = !!token && token !== "null" && token !== "undefined";

  // ✅ fetch business mini list
  const fetchBusinessesMini = async () => {
    try {
      const res = await fetch(`${API_BASE}business/list1`);
      if (!res.ok) return;

      const json = await res.json();
      const arr = Array.isArray(json) ? json : json?.data ?? [];

      const map: Record<string, BusinessMini> = {};
      arr.forEach((b: any) => {
        map[b.id] = {
          id: b.id,
          name: b.name,
          logo_url: b.logo_url,
        };
      });

      setBizMap(map);
    } catch (e) {
      console.error("business fetch error", e);
    }
  };

  // ✅ fetch cart
  const fetchCart = async () => {
  if (!loggedIn) return;

  try {
    setCartLoading(true);

    const res = await fetch(`${API_BASE}business-claim-cart/my-cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Cart load failed");

    const data = await res.json();

    const items = Array.isArray(data) ? data : data?.data ?? [];
    const pendingOnly = items.filter(
      (x: any) => (x.status || "").toLowerCase() === "pending"
    );

    setCartItems(pendingOnly);
  } catch (e) {
    console.error(e);
  } finally {
    setCartLoading(false);
  }
};


  // ✅ remove item
  const removeFromCart = async (id: string) => {
    try {
      await fetch(`${API_BASE}business-claim-cart/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setCartItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchBusinessesMini();
    }
  }, [loggedIn]);

  const cartTotal = cartItems.reduce((sum, item) => {
    const v =
      typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
    return sum + (Number.isFinite(v) ? v : 0);
  }, 0);
  const formatUSD = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  // Get profile image URL with cache busting
  const getProfileImageUrl = () => {
    if (!user?.profile_picture_url) {
      return "/assets/images/profile.png";
    }
    // Add timestamp for cache busting
    const url = user.profile_picture_url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${imageKey}`;
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    // Refresh user data from context
    refreshUser();
  };

  if (Loading) {
    return (
      <div className="flex fixed justify-center items-center z-[10000] w-full inset-0 bg-white">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Loading"
        />
      </div>
    );
  }

  return (
    <div>
      <header className="absolute z-50 mt-4 lg:mt-5 w-full lg:rounded-full sm:mt-10">
        <div className="m-auto bg-white px-1 w-5/6 custom-container lg:mx-auto rounded-full lg:px-0 lg:py-4 md:px-12 md:bg-transparent">
          <div className="flex w-full items-center justify-between rounded-full bg-white px-5 md:px-4 py-2">
            <div className="z-20">
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="Home"
              >
                <img
                  src="/assets/images/logo.png"
                  alt="logo-Ablevu"
                  className="w-32"
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
                  <ul className="space-y-8 px-6 pt-32 text-gray-700 md:pe-6 lg:flex lg:space-x-4 lg:space-y-0 lg:pt-0 font-['Roboto'] font-bold">
                    <li>
                      <Link
                        href="/"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2"
                      >
                        <span className="text-black-800 relative">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/business"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">
                          Businesses
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contributor"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">
                          Contributor
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/access-friendly-city"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">
                          Access Friendly Cities
                        </span>
                      </Link>
                    </li>
                    {isLoggedIn && (
                      <>
                        <li
                          onClick={() => setOpenFeedbackModal(true)}
                          className="before:bg-black-100 mr-4 group cursor-pointer relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                        >
                          <span className="group-hover:text-black-800 relative">
                            Share Feedback
                          </span>
                        </li>

                        <li
                          onClick={() => setOpenAddBusinessModal(true)}
                          className="before:bg-black-100 group cursor-pointer relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                        >
                          <span className="group-hover:text-black-800 relative">
                            Add Business
                          </span>
                        </li>
                        {/* Notifications Dropdown */}
                        <li className="relative ml-3" ref={notifRef}>
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
                            <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
                              {" "}
                              {/* Increased width */}
                              <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                {notifications.length === 0 && (
                                  <li className="px-4 py-6 text-gray-500 text-sm text-center">
                                    <div className="flex flex-col items-center justify-center">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-gray-400 mb-2"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM8 16a2 2 0 104 0H8z" />
                                      </svg>
                                      <p>No new notifications</p>
                                    </div>
                                  </li>
                                )}

                                {notifications.map((item) => (
                                  <li
                                    key={item.id}
                                    className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() =>
                                      handleNotificationClick(item)
                                    }
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
                        </li>

                        {/* Cart Dropdown */}
                        <li className="relative ml-3" ref={cartRef}>
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
                            <div className="absolute right-0 mt-3 w-[26rem] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden">
                              {/* Header */}
                              <div className="px-5 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-bold text-base text-gray-900">
                                      Cart
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {cartItems.length} item
                                      {cartItems.length > 1 ? "s" : ""} in your
                                      cart
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
                                            onClick={() =>
                                              removeFromCart(item.id)
                                            }
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
                      </>
                    )}
                  </ul>

                  <div className="flex items-center space-x-3">
                    {!isLoggedIn ? (
                      <>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setOpenSignupModal(true)}
                            className="group relative flex items-center gap-2 rounded-full cursor-pointer border-2 bg-gradient-to-r from-[#0519ce] to-[#0414a8] py-2.5 px-6 text-white font-semibold transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 transition-transform group-hover:rotate-12"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Sign Up
                          </button>

                          <button
                            onClick={() => setOpenLoginModal(true)}
                            className="group relative flex items-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-[#0519ce] to-[#0414a8] hover:bg-gradient-to-r hover:from-[#0519ce] hover:to-[#0414a8] py-2.5 px-7 text-white font-semibold transition-all duration-300"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                            Log In
                          </button>
                        </div>
                      </>
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
                            key={imageKey}
                            src={getProfileImageUrl()}
                            alt={user?.first_name || "User"}
                            className="cursor-pointer h-10 w-10 mr-1 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              console.log("Header: Image load error, using fallback");
                              target.src = "/assets/images/profile.png";
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
                                  onClick={() => {
                                    setDropdownOpen(false);
                                    window.location.href = "/dashboard";
                                  }}
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
                              <hr className="my-2 border-gray-200" />
                              <li>
                                <button
                                  onClick={handleLogout}
                                  className="flex w-full text-left px-4 py-2 transition-opacity ease-in-out hover:text-red-600 hover:bg-[#ffebeb]"
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
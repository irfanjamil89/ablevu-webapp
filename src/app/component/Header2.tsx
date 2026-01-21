"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";
import Feedback from "./Feedback";
import AddBusinessModal from "./AddBusinessModal";
// import { User as UserIcon, ShoppingCart, Trash2 } from "lucide-react";
import { ShoppingCart, Trash2, Bell, ChevronDown, Menu, X, User, LayoutDashboard, LogOut, UserPlus, LogIn } from 'lucide-react';

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

export default function Headertest() {
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
    const cartRef = useRef<HTMLDivElement | null>(null);
    const notifRef = useRef<HTMLDivElement | null>(null);
    const userRef = useRef<HTMLDivElement | null>(null);
    const isNormalUser = user?.user_role === "User";
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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
        const interval = setInterval(() => fetchNotifications(), 30000);
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
        const separator = url.includes("?") ? "&" : "?";
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
            <header className="relative z-50 w-full lg:rounded-full">
                <div className="m-auto bg-white px-1 w-5/6 custom-container lg:mx-auto rounded-full lg:px-0 lg:py-4 md:px-12 md:bg-transparent">
                    <div className="flex w-full items-center justify-between rounded-full bg-white px-5 md:px-4 py-2">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <a href="/" className="flex items-center">
                                <img
                                    src="/assets/images/logo.png"
                                    alt="Ablevu"
                                    className="h-12 md:h-20 w-auto"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="40"%3E%3Ctext x="10" y="25" font-size="20" fill="%230519ce" font-weight="bold"%3EAblevu%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </a>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            <a href="/" className="px-4 py-2 text-sm font-semibold text-gray-900 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50">
                                Home
                            </a>
                            <a href="/business" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50">
                                Businesses
                            </a>
                            <a href="/contributor" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50">
                                Contributor
                            </a>
                            <a href="/access-friendly-city" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50">
                                Access Friendly Cities
                            </a>
                            {isLoggedIn && (
                                <>
                                    <button
                                        onClick={() => setOpenFeedbackModal(true)}
                                        className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50"
                                    >
                                        Share Feedback
                                    </button>
                                    {user?.user_role !== "User" && (
                                        <button
                                            onClick={() => setOpenAddBusinessModal(true)}
                                            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-[#0519ce] transition-colors rounded-lg hover:bg-blue-50"
                                        >
                                            Add Business
                                        </button>
                                    )}
                                </>
                            )}
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-2 md:space-x-3">
                            {isLoggedIn && (
                                <>
                                    {/* Notifications */}
                                    <div className="relative" ref={notifRef}>
                                        <button
                                            onClick={() => {
                                                setNotificationsOpen(!notificationsOpen);
                                                setCartOpen(false);
                                                setDropdownOpen(false);
                                                if (!notificationsOpen) fetchNotifications();
                                            }}
                                            className="relative p-2 text-gray-600 hover:text-[#0519ce] hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Bell className="h-5 w-5 md:h-6 md:w-6" />
                                            {notifications.length > 0 && (
                                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>

                                        {notificationsOpen && (
                                            <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                                                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                                                    <h3 className="font-bold text-gray-900">Notifications</h3>
                                                    <p className="text-xs text-gray-500 mt-0.5">{notifications.length} unread</p>
                                                </div>
                                                <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <li className="px-4 py-12 text-center text-gray-500 text-sm">
                                                            No new notifications
                                                        </li>
                                                    ) : (
                                                        notifications.map((item) => (
                                                            <li
                                                                key={item.id}
                                                                className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                                                                onClick={() => handleNotificationClick(item)}
                                                            >
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm text-gray-900">{item.content}</p>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        markAsRead(item.id);
                                                                    }}
                                                                    className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition-colors"
                                                                    title="Mark as read"
                                                                >
                                                                    <X className="h-4 w-4 text-gray-500" />
                                                                </button>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cart */}
                                    {!isNormalUser && (
                                        <div className="relative" ref={cartRef}>
                                            <button
                                                onClick={async () => {
                                                    setCartOpen(!cartOpen);
                                                    setNotificationsOpen(false);
                                                    setDropdownOpen(false);
                                                    if (!cartOpen) await fetchCart();
                                                }}
                                                className="relative p-2 text-gray-600 hover:text-[#0519ce] hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
                                                {cartItems.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {cartItems.length}
                                                    </span>
                                                )}
                                            </button>

                                            {cartOpen && (
                                                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                                                    <div className="px-5 py-4 border-b bg-gradient-to-r from-blue-50 to-white">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <h3 className="font-bold text-gray-900">Cart</h3>
                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                    {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                                                                </p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xs text-gray-500">Total</p>
                                                                <p className="font-bold text-lg text-gray-900">{formatUSD(cartTotal)}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {cartLoading ? (
                                                        <div className="px-6 py-12 text-center text-gray-500">
                                                            Loading cart...
                                                        </div>
                                                    ) : cartItems.length === 0 ? (
                                                        <div className="px-6 py-12 text-center">
                                                            <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                                            <p className="text-sm font-semibold text-gray-900">Your cart is empty</p>
                                                            <p className="text-xs text-gray-500 mt-1">Add items to get started</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                                                                {cartItems.map((item) => {
                                                                    const biz = bizMap[item.business_id];
                                                                    const amount = typeof item.amount === "string" ? parseFloat(item.amount) : item.amount;
                                                                    return (
                                                                        <li key={item.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                                                                            <div className="flex gap-3">
                                                                                <img
                                                                                    src={biz?.logo_url || "/assets/images/b-img.png"}
                                                                                    className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
                                                                                    onError={(e) => {
                                                                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56"%3E%3Crect width="56" height="56" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                                                                    }}
                                                                                />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-semibold text-sm text-gray-900 truncate">{biz?.name || "Business"}</p>
                                                                                    <p className="text-xs text-gray-500 mt-1 capitalize">Status: {item.status}</p>
                                                                                    <p className="font-bold text-sm mt-1 text-gray-900">{formatUSD(Number(amount || 0))}</p>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => removeFromCart(item.id)}
                                                                                    className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                                >
                                                                                    <Trash2 className="w-4 h-4" />
                                                                                </button>
                                                                            </div>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                            <div className="p-4 border-t bg-gray-50">
                                                                <button
                                                                    onClick={() => window.location.href = "/checkout"}
                                                                    className="w-full bg-[#0519ce] hover:bg-[#0519ce] text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                                                                >
                                                                    Proceed to Checkout
                                                                </button>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* User Profile Dropdown */}
                                    <div className="relative hidden lg:block" ref={userRef}>
                                        <button
                                            onClick={() => {
                                                setDropdownOpen(!dropdownOpen);
                                                setCartOpen(false);
                                                setNotificationsOpen(false);
                                            }}
                                            className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <img
                                                src={getProfileImageUrl()}
                                                alt={user?.first_name || "User"}
                                                className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/assets/images/profile.png';
                                                }}
                                            />
                                            <ChevronDown className="h-4 w-4 text-gray-600" />
                                        </button>

                                        {dropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                                                <button
                                                    onClick={() => {
                                                        setDropdownOpen(false);
                                                        window.location.href = "/dashboard";
                                                    }}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] transition-colors"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    Dashboard
                                                </button>
                                                <hr className="my-1 border-gray-200" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Auth Buttons (Desktop) */}
                            {!isLoggedIn && (
                                <div className=" hidden lg:flex items-center space-x-3">
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
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:text-[#0519ce] hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sliding Menu */}
                <>
                    {/* Overlay */}
                    <div
                        className={`fixed inset-0 bg-[#00000059] transition-opacity duration-300 lg:hidden z-[60] ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                            }`}
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sliding Sidebar */}
                    <div
                        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden z-[70] overflow-y-auto ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                            }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex items-center gap-3">
                                <img
                                    src="/assets/images/logo.png"
                                    alt="Ablevu"
                                    className="h-10 w-auto"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="32"%3E%3Ctext x="5" y="20" font-size="16" fill="%230519ce" font-weight="bold"%3EAblevu%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-600" />
                            </button>
                        </div>

                        {/* User Profile Section (if logged in) */}
                        {isLoggedIn && user && (
                            <div className="p-6 bg-gradient-to-r from-[#0519ce] to-[#0519ce] text-white">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={getProfileImageUrl()}
                                        alt={user.first_name}
                                        className="h-16 w-16 rounded-full object-cover ring-4 ring-white/30"
                                        onError={(e) => {
                                            e.currentTarget.src = '/assets/images/profile.png';
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{user.first_name} {user.last_name}</h3>
                                        <p className="text-sm text-blue-100 truncate">{user.email}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-xs rounded-full">
                                            {user.user_role}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Links */}
                        <nav className="p-4 space-y-1">
                            <a
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="/business"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                            >
                                Businesses
                            </a>
                            <a
                                href="/contributor"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                            >
                                Contributor
                            </a>
                            <a
                                href="/access-friendly-city"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                            >
                                Access Friendly Cities
                            </a>

                            {isLoggedIn && (
                                <>
                                    <button
                                        onClick={() => {
                                            setOpenFeedbackModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                                    >
                                        Share Feedback
                                    </button>
                                    {user?.user_role !== "User" && (
                                        <button
                                            onClick={() => {
                                                setOpenAddBusinessModal(true);
                                                setMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-[#0519ce] rounded-lg transition-colors"
                                        >
                                            Add Business
                                        </button>
                                    )}
                                </>
                            )}
                        </nav>

                        {/* Bottom Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                            {isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            window.location.href = "/dashboard";
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-2 text-sm font-semibold text-white bg-[#0519ce] hover:bg-[#0519ce] rounded-lg transition-colors"
                                    >
                                        <LayoutDashboard className="h-5 w-5" />
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg border-2 border-red-600 transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setOpenSignupModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-2 bg-gradient-to-r from-[#0519ce] to-[#0519ce] text-white font-semibold rounded-lg shadow-sm"
                                    >
                                        <UserPlus className="h-5 w-5" />
                                        Sign Up
                                    </button>
                                    <button
                                        onClick={() => {
                                            setOpenLoginModal(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white text-[#0519ce] font-semibold rounded-lg border-2 border-[#0519ce]"
                                    >
                                        <LogIn className="h-5 w-5" />
                                        Log In
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            </header>

            {/* Modals remain the same */}
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

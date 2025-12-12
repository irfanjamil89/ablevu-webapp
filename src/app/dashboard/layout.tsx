"use client";
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Header from '../component/Header2';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  paid_contributor: boolean;
  email: string;
  profile_picture_url?: string;
}

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat invalid tokens as expired
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setLoading(true);
    localStorage.removeItem("access_token");
    sessionStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Token from localStorage:', token);

    if (!token) {
      setError('Please log in to continue.');
      setLoading(false);
      router.push('/');
      return;
    }

    // Check if token is expired before making the API call
    if (isTokenExpired(token)) {
      console.log('Token expired, logging out...');
      handleLogout();
      return;
    }

    // Fetch user data using the token for authentication
    fetch('https://staging-api.qtpack.co.uk/users/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        // Check if response indicates token expiration (401 Unauthorized)
        if (response.status === 401) {
          console.log('Token invalid or expired (401), logging out...');
          handleLogout();
          return null;
        }
        return response.json();
      })
      .then(data => {
        if (!data) return; // Skip if we got a 401

        setUser(data);
        saveUserToSession(data);

        if (data.user_role === "Business") {
          router.push('/dashboard/business-overview');
          setLoading(false);
          return;
        } else if (data.user_role === "Contributor") {
          router.push('/dashboard/contributor-overview');
          setLoading(false);
          return;
        } else if (data.user_role === "User") {
          router.push('/dashboard/saved');
          setLoading(false);
          return;
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch user data.');
        setLoading(false);
      });

    // Set up periodic token check (every minute)
    const tokenCheckInterval = setInterval(() => {
      const currentToken = localStorage.getItem('access_token');
      if (!currentToken || isTokenExpired(currentToken)) {
        console.log('Token expired during session, logging out...');
        clearInterval(tokenCheckInterval);
        handleLogout();
      }
    }, 60000); // Check every 60 seconds

    // Cleanup interval on unmount
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const saveUserToSession = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
      </div>
    );
  }


  return (
    <div>
      {user?.user_role == "Admin" ? (
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 lg:px-6 py-1">
            <div className="flex items-center gap-[85px]">
              {/* Logo */}
              <Link href="/" className="w-[180px]">
                <img
                  src="/assets/images/logo.png"
                  alt="AbleVu Logo"
                  className="w-[180px]"
                />
              </Link>

              {/* Welcome Message */}


              <div className="flex items-center gap-5 text-gray-700">
                <span className="text-2xl">👋</span>
                <span className="font-medium text-xl">
                  {
                    error ? (
                      <>Failed to fetch user details</>
                    ) : (
                      <>
                        Welcome Back! <span>{user.first_name} {user.last_name} ({user.user_role})</span>
                      </>
                    )
                  }

                </span>
              </div>
            </div>

            {/* Right side: Logout button */}
            <div className="flex items-center">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition"
                onClick={handleLogout}>
                {/* Logout Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 11-4 0v-1m4-10V5a2 2 0 10-4 0v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Header />
      )}

      <div className="flex">
        <div className=" w-[350px] pt-5  bg-white border-r border-gray-200 flex flex-col justify-between">
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

                  <img
                    src={user.profile_picture_url || "/assets/images/profile.png" }
                    alt={user.first_name}
                    className=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/assets/images/profile.png";
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

        {children}

      </div>
    </div>
  );
}
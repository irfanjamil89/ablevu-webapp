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
  email: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {



  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('Token from localStorage:', token); // Log the token value

    if (!token) {
      console.error('No token found, please log in.');
      setError('Please log in to continue.');
      setLoading(false);
      return;
    }

    // Fetch user data using the token for authentication
    fetch('https://staging-api.qtpack.co.uk/users/1', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        // console.log('API response:', data);

        setUser(data);
        saveUserToSession(data);
        setLoading(false); // Set loading to false after fetch is done
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch user data.');
        setLoading(false);
      });
  }, []);


  const saveUserToSession = (user: User) => {
    sessionStorage.setItem('user', JSON.stringify(user));
  };

  

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };


  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
    </div>;
  }




  return (
    <div>
      {user?.user_role == "Admin" ? (
        <div className="w-full border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between px-4 lg:px-6 py-1">
            <div className="flex items-center gap-[85px]">
              {/* Logo */}
              <a href="/dashboard" className="w-[180px]">
                <img
                  src="/assets/images/logo.png"
                  alt="AbleVu Logo"
                  className="w-[180px]"
                />
              </a>

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
        <div className="h-screen w-[350px] pt-5 bg-white border-r border-gray-200 flex flex-col justify-between">
          {/* Top Navigation */}
          <div className="p-4">
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

                  <Link href="/dashboard/business-type"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-type")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}

                  >

                    <svg
                      version="1.1"
                      id="icons_1_"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      x="0"
                      y="0"
                      viewBox="0 0 128 128"
                      xmlSpace="preserve">
                      <style>
                        {`.st0 { fill: #0a0a0a; } .st1 { display: none; } .st2 { display: inline; }`}
                      </style>
                      <g id="row2_1_">
                        <g id="_x36__3_">
                          <path
                            className="st0"
                            d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                            id="transparent"
                          />
                        </g>
                      </g>
                    </svg>

                    Business Type

                  </Link>

                  <Link href="/dashboard/accessibility-feature-type"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/accessibility-feature-type")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- Thumbs Up Icon --> */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 32 32"><path
                        d="M27 11h-8.52L19 9.8A6.42 6.42 0 0 0 13 1a1 1 0 0 0-.93.63L8.32 11H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h18.17a3 3 0 0 0 2.12-.88l3.83-3.83a3 3 0 0 0 .88-2.12V14a3 3 0 0 0-3-3zM4 28V14a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1zm24-3.83a1 1 0 0 1-.29.71l-3.83 3.83a1.05 1.05 0 0 1-.71.29H10V12.19l3.66-9.14a4.31 4.31 0 0 1 3 1.89 4.38 4.38 0 0 1 .44 4.12l-1 2.57A1 1 0 0 0 17 13h10a1 1 0 0 1 1 1z"
                        data-name="thumb up android app aplication phone" /></svg>
                    Features type

                  </Link>

                  <Link href="/dashboard/accessibility-features"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/accessibility-features")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
                    </svg>

                    Accessibility Features

                  </Link>


                  <Link href="/dashboard/business-overview"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-overview")

                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      version="1.1"
                      id="icons_1_"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      x="0"
                      y="0"
                      viewBox="0 0 128 128"
                      xmlSpace="preserve">
                      <style>
                        {`.st0 { fill: #0a0a0a; } .st1 { display: none; } .st2 { display: inline; }`}
                      </style>
                      <g id="row2_1_">
                        <g id="_x36__3_">
                          <path
                            className="st0"
                            d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                            id="transparent"
                          />
                        </g>
                      </g>
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
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 32 32"><path
                        d="M27 11h-8.52L19 9.8A6.42 6.42 0 0 0 13 1a1 1 0 0 0-.93.63L8.32 11H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h18.17a3 3 0 0 0 2.12-.88l3.83-3.83a3 3 0 0 0 .88-2.12V14a3 3 0 0 0-3-3zM4 28V14a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1zm24-3.83a1 1 0 0 1-.29.71l-3.83 3.83a1.05 1.05 0 0 1-.71.29H10V12.19l3.66-9.14a4.31 4.31 0 0 1 3 1.89 4.38 4.38 0 0 1 .44 4.12l-1 2.57A1 1 0 0 0 17 13h10a1 1 0 0 1 1 1z"
                        data-name="thumb up android app aplication phone" /></svg>
                    Accessible Cities

                  </Link>


                  <Link href="/dashboard/partners"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/partners")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`} >
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      viewBox="0 0 32 32"><g
                        data-name="credit card"><path
                          d="M27.05 7H23a1 1 0 0 0 0 2h4.05a1 1 0 0 1 .95 1v13.1a1 1 0 0 1-.95.95H5a1 1 0 0 1-1-.95V22a1 1 0 0 0-2 0v1.05A3 3 0 0 0 5 26h22.1a3 3 0 0 0 2.9-2.95V10a3 3 0 0 0-2.95-3z" /><path
                          d="M3 19a1 1 0 0 0 1-1v-5h21a1 1 0 0 0 0-2H4v-1a1 1 0 0 1 1-1h14a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v8a1 1 0 0 0 1 1zM7 20a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z" /></g></svg>
                    Partners

                  </Link>





                  {/* <!-- Coupon Codes --> */}
                  <Link href="/dashboard/couponcodes"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/couponcodes")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>
                    {/* <!-- User Icon --> */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
                    </svg>

                    Feedback

                  </Link>



                  <Link href="/dashboard/users"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/users")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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

                    <svg
                      version="1.1"
                      id="icons_1_"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      x="0"
                      y="0"
                      viewBox="0 0 128 128"
                      xmlSpace="preserve">
                      <style>
                        {`.st0 { fill: #0a0a0a; } .st1 { display: none; } .st2 { display: inline; }`}
                      </style>
                      <g id="row2_1_">
                        <g id="_x36__3_">
                          <path
                            className="st0"
                            d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                            id="transparent"
                          />
                        </g>
                      </g>
                    </svg>

                    Overview

                  </Link>


                  <Link href="/dashboard/subscriptions"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/subscriptions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
                    </svg>
                    Profile
                  </Link>

                </>
              ) : user?.user_role == "Contributor" ? (
                <>

                  <Link href="/dashboard/business-overview"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-overview")

                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      version="1.1"
                      id="icons_1_"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      x="0"
                      y="0"
                      viewBox="0 0 128 128"
                      xmlSpace="preserve">
                      <style>
                        {`.st0 { fill: #0a0a0a; } .st1 { display: none; } .st2 { display: inline; }`}
                      </style>
                      <g id="row2_1_">
                        <g id="_x36__3_">
                          <path
                            className="st0"
                            d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                            id="transparent"
                          />
                        </g>
                      </g>
                    </svg>

                    Overview

                  </Link>

                  <Link href="/dashboard/subscriptions"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/subscriptions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
                    </svg>
                    Profile
                  </Link>

                </>
              ) : user?.user_role === "User" ? (
                <>

                  <Link href="/dashboard/business-overview"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/business-overview")

                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      version="1.1"
                      id="icons_1_"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      x="0"
                      y="0"
                      viewBox="0 0 128 128"
                      xmlSpace="preserve">
                      <style>
                        {`.st0 { fill: #0a0a0a; } .st1 { display: none; } .st2 { display: inline; }`}
                      </style>
                      <g id="row2_1_">
                        <g id="_x36__3_">
                          <path
                            className="st0"
                            d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                            id="transparent"
                          />
                        </g>
                      </g>
                    </svg>

                    Overview

                  </Link>
                  
                  <Link href="/dashboard/subscriptions"

                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive("/dashboard/subscriptions")
                      ? "bg-blue-700 text-white font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}>

                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
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
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 8a7 7 0 0114 0H5z"
                      />
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
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804z"
                  />
                </svg>

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

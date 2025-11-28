"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Ensure client-side render
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);

  // Run only after client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check login status
  useEffect(() => {
    if (!isMounted) return;

    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, [isMounted]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
    window.location.href = "/"; // Redirect after logout
  };


  return (
    <div>
      <header className="absolute z-50 mt-10 w-full lg:rounded-full sm:mt-10">
        <div className="m-auto bg-white px-1 w-5/6 lg:mx-auto rounded-full lg:px-6 lg:py-4 md:px-12 md:bg-transparent">
          <div className="flex w-full items-center justify-between rounded-full bg-white px-5 md:px-4 py-2">
            <div className="z-20">
              <Link href="/" className="flex items-center gap-2" aria-label="Home">
                <img src="/assets/images/logo.png" alt="logo-Ablevu" className="w-32" />
              </Link>
            </div>

            <div className="flex items-center justify-center">
              <input type="checkbox" name="hamburger" id="hamburger" className="peer hidden" />
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
                      <Link href="/" className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2">
                        <span className="text-black-800 relative">Home</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/business"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">Businesses</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contributor"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">Contributor</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/access-friendly-city"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">Access-friendly Cities</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">Add Business</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/search"
                        className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                      >
                        <span className="group-hover:text-black-800 relative">Search</span>
                      </Link>
                    </li>
                  </ul>

                  {/* Auth Buttons / Logged-in Dropdown */}
                  <div className="flex items-center space-x-3">
                    {!isLoggedIn ? (
                      <>
                        <div className="flex items-center space-x-3">
                          {/* Sign Up Button */}
                          <button
                            onClick={() => setOpenSignupModal(true)}
                            className="group relative flex items-center gap-2 rounded-full cursor-pointer border-2 bg-gradient-to-r from-[#0519ce] to-[#0414a8] py-2.5 px-6 text-white font-semibold transition-all duration-300 "
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

                          {/* Log In Button */}
                          <button
                            onClick={() => setOpenLoginModal(true)}
                            className="group relative flex items-center gap-2 rounded-full cursor-pointer bg-gradient-to-r from-[#0519ce] to-[#0414a8] hover:bg-gradient-to-r hover:from-[#0519ce] hover:to-[#0414a8] py-2.5 px-7 text-white font-semibold transition-all duration-300 "
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
                      <div className="relative user-dropdown">
                        <div className="flex items-center cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
                          <img src="/assets/images/profile.png" alt="User Icon"
                            className="cursor-pointer h-10 w-10 mr-1"

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
                              <li >
                                <button
                                  onClick={() => (window.location.href = "/dashboard")}
                                  className="flex w-full text-left px-4 py-2 hover:text-[#0519ce] hover:bg-[#f0f1ff]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                                  </svg> Dashboard
                                </button>
                              </li>
                              <hr className="my-2  border-gray-200" />
                              <li>
                                <button
                                  onClick={handleLogout}
                                  className="flex w-full text-left px-4 py-2 transition-opacity ease-in-out  hover:text-red-600 hover:bg-[#ffebeb]"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 mr-2"
                                  >
                                    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
                                  </svg> Logout
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



    </div>

  );
}

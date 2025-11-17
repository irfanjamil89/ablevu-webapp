"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Ensure client-side render
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [OpenSuccessModal, setOpenSuccessModal] = useState(false);
  const [message, setMessage] = useState("");

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
    <header className="absolute z-50 mt-20 w-full lg:rounded-full sm:mt-10">
      <div className="bg-white px-6 w-5/6 lg:mx-auto lg:rounded-full lg:px-6 lg:py-4 md:px-12 md:bg-transparent">
        <div className="flex w-full items-center justify-between rounded-full bg-white md:px-10 lg:px-0 py-2">
          <div className="z-20 ps-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Home">
              <img src="/assets/images/logo.png" alt="logo-Ablevu" className="w-32" />
            </Link>
          </div>

          <div className="flex items-center border-l justify-center lg:border-l-0 pe-4">
            <input
              type="checkbox"
              name="hamburger"
              id="hamburger"
              className="peer"
              hidden
            />
            <label
              htmlFor="hamburger"
              className="peer-checked:hamburger z-20 -mr-6 block cursor-pointer p-6 lg:hidden"
            >
              <div
                aria-hidden="true"
                className="m-auto h-0.5 w-6 rounded bg-sky-900 transition duration-300"
              ></div>
              <div
                aria-hidden="true"
                className="m-auto mt-2 h-0.5 w-6 rounded bg-sky-900 transition duration-300"
              ></div>
            </label>

            <div className="fixed inset-0 w-[100%] translate-x-[-100%] border-r bg-white shadow-xl transition duration-300 peer-checked:translate-x-0 lg:static lg:w-auto lg:translate-x-0 lg:border-r-0 lg:shadow-none">
              <div className="flex h-full flex-col justify-center lg:flex-row lg:items-center w-full">
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
                        Access-friendly Cities
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                    >
                      <span className="group-hover:text-black-800 relative">
                        Add Business
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="before:bg-black-100 group relative before:absolute before:inset-x-0 before:bottom-0 before:h-2 before:origin-right before:scale-x-0 before:transition before:duration-200 hover:before:origin-left hover:before:scale-x-100"
                    >
                      <span className="group-hover:text-black-800 relative">
                        Search
                      </span>
                    </Link>
                  </li>
                </ul>

                {/* Auth Buttons / Logged-in Dropdown */}
                <div className="flex items-center space-x-3">
                  {!isLoggedIn ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setOpenSignupModal(true)}
                          className="rounded-full cursor-pointer border border-[rgba(5,25,206,1)] py-3 px-5 text-[rgba(5,25,206,1)] transition hover:bg-[rgba(5,25,206,1)] hover:text-white"
                        >
                          Sign Up
                        </button>
                        <button
                          onClick={() => setOpenLoginModal(true)}
                          className="rounded-full cursor-pointer bg-[rgba(5,25,206,1)] py-3 px-6 text-white transition hover:bg-[#0414a8]"
                        >
                          Log In
                        </button>
                      </div>

                     
                    </>
                  ) : (
                    <div className="relative user-dropdown">
                      <FaUserCircle
                        className="text-[38px] text-[rgba(5,25,206,1)] cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                      />
                      {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <ul className="text-sm text-gray-700">
                            <li>
                              <button
                                onClick={() => (window.location.href = "/dashboard")}
                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              >
                                Dashboard
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                              >
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

    </div>
    
  );
}

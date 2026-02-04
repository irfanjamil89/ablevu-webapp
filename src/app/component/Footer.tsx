"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Footer() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await axios.post(`${API_BASE_URL}subscribe/create`, {
        email: email,
        active: true,
      });

      setSuccessMsg("Subscribed successfully!");
      setEmail("");

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message || "Failed to subscribe. Try again."
      );

      setTimeout(() => setErrorMsg(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0A1733] px-6 py-10 text-white text-center sm:pt-[50px] sm:text-center md:px-20 md:pt-[150px] md:text-start lg:pt-[150px] lg:text-start">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 justify-content-center md:justify-between md:flex-row md:flex-wrap md:gap-4">
        {/* Logo and Social Icons */}
        <div className="w-full md:w-[48%] lg:w-[30%]">
          <div className="mb-4 flex justify-center md:justify-start">
            <img
              src="/assets/images/ablevu-white-logo.png"
              alt="AbleVu Logo"
              className="mr-2 h-20 object-contain"
            />
          </div>
          <div className="mt-5 flex space-x-4 justify-center lg:justify-start">
            {/* <Link href="#" className="hover:text-blue-400" aria-label="LinkedIn">
              <i className="fab fa-linkedin fa-lg"></i>
            </Link>
            <Link href="#" className="hover:text-blue-400" aria-label="Facebook">
              <i className="fab fa-facebook fa-lg"></i>
            </Link>
            <Link href="#" className="hover:text-blue-400" aria-label="X Twitter">
              <i className="fab fa-x-twitter fa-lg"></i>
            </Link> */}
            <p>AbleVu is committed to making our website accessible to as many people as possible. We want <Link href="/" className="underline text-[#95CC68]">AbleVu.com</Link> to be usable for visitors with a wide range of access needs, including people who use screen readers, keyboard navigation, captions, zoom, voice input, or other assistive technologies.</p>
          </div>
        </div>

        {/* Information */}
        <div className="w-full md:w-[48%] lg:w-[18%]">
          <h3 className="mb-4 mt-5 font-['Roboto'] text-lg font-semibold">
            Information
          </h3>
          <ul className="space-y-2 font-['Helvetica'] text-sm">
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <a href="mailto:support@ablevu.com">Support</a>

            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:underline">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-[48%] lg:w-[18%]">
          <h3 className="mb-4 mt-5 font-['Roboto'] text-lg font-semibold">
            Quick Links
          </h3>
          <ul className="space-y-2 font-['Helvetica'] text-sm">
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/business" className="hover:underline">
                Businesses
              </Link>
            </li>
            <li>
              <Link href="/contributor" className="hover:underline">
                Contributor
              </Link>
            </li>
            <li>
              <Link href="/access-friendly-city" className="hover:underline">
                Access-Friendly Cities
              </Link>
            </li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="w-full md:w-[48%] lg:w-[20%] bg-[rgb(34,44,68)] p-4 rounded-xl h-fit">
          <h3 className="mb-5 font-['Roboto'] text-lg font-semibold">
            Subscribe
          </h3>

          <form className="mb-4 flex items-center" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-l bg-white px-4 py-2 text-black focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-r bg-blue-500 px-4 py-2 hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </form>

          {successMsg && (
            <p className="text-green-400 text-sm mb-2">{successMsg}</p>
          )}

          {errorMsg && (
            <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
          )}

          <p className="font-['Helvetica'] text-xs text-gray-400">
            Hello, we are AbleVu! Join our community and stay updated.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center font-['Roboto'] text-sm text-gray-400">
        &copy; 2026 AbleVu. All rights reserved.
      </div>
    </footer>
  );
}

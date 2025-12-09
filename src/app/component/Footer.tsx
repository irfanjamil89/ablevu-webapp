"use client";

import React, { useState } from "react";
import axios from "axios";

export default function Footer() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await axios.post(`${API_BASE_URL}/subscribe/create`, {
        email: email,
        active: true,
      });

      setSuccessMsg("Subscribed successfully!");
      setEmail("");

      // hide message after 3 seconds
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (error) {
      setErrorMsg(
        error?.response?.data?.message || "Failed to subscribe. Try again."
      );

      setTimeout(() => setErrorMsg(""), 3000);
    }

    setLoading(false);
  };

  return (
    <footer className="bg-[#0A1733] px-6 py-10 text-white text-center sm:pt-[50px] sm:text-center md:px-20 md:pt-[150px] md:text-start lg:pt-[150px] lg:text-start">
      <div className="grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:mx-auto">

        {/* Logo and Social Icons */}
        <div>
          <div className="mb-4 flex items-center justify-center lg:justify-start">
            <img
              src="/assets/images/ablevu-white-logo.png"
              alt="AbleVu Logo"
              className="mr-2 h-20 object-contain"
            />
          </div>
          <div className="mt-4 flex space-x-4 justify-center lg:justify-start">
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-linkedin fa-lg"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a href="#" className="hover:text-blue-400">
              <i className="fab fa-x-twitter fa-lg"></i>
            </a>
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Information</h3>
          <ul className="space-y-2 font-['Helvetica'] text-sm">
            <li><a href="#" className="hover:underline">FAQ</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Support</a></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 font-['Helvetica'] text-sm">
            <li><a href="#" className="hover:underline">Businesses</a></li>
            <li><a href="#" className="hover:underline">Contributor</a></li>
            <li><a href="#" className="hover:underline">Access-friendly Cities</a></li>
          </ul>
        </div>

        {/* Subscribe */}
        <div className="bg-[rgb(34,44,68)] p-4 text-start rounded-xl">
          <h3 className="mb-4 font-['Roboto'] text-lg font-semibold">Subscribe</h3>

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
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Success Message */}
          {successMsg && (
            <p className="text-green-400 text-sm mb-2">{successMsg}</p>
          )}

          {/* Error Message */}
          {errorMsg && (
            <p className="text-red-400 text-sm mb-2">{errorMsg}</p>
          )}

          <p className="font-['Helvetica'] text-xs text-gray-400">
            Hello, we are AbleVu! Join our community and stay updated.
          </p>
        </div>
      </div>

      <div className="mt-10 border-t border-gray-700 pt-6 text-center font-['Roboto'] text-sm text-gray-400">
        &copy; 2025 AbleVu. All rights reserved.
      </div>
    </footer>
  );
}

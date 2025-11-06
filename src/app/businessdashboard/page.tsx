import React from 'react'

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Dashboard | AbleVu",
  description:
    "Manage your AbleVu business profile — update accessibility details, respond to customer reviews, and monitor engagement insights all in one place.",
  keywords: [
    "AbleVu dashboard",
    "business profile management",
    "accessibility settings",
    "inclusive business management",
    "respond to reviews",
    "customer engagement",
  ],
};

export default function page() {
  return (
    <div>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside className="fixed h-screen w-64 pt-5 pb-[100px] bg-white border-r border-gray-200 flex flex-col justify-between">
        {/* Top Navigation */}
        <div className="p-4">
          <ul className="space-y-2 font-medium">
            {/* Overview */}
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-blue-700 text-white font-semibold"
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
              </a>
            </li>

            {/* Subscriptions */}
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 32 32"
                >
                  <g data-name="credit card">
                    <path d="M27.05 7H23a1 1 0 0 0 0 2h4.05a1 1 0 0 1 .95 1v13.1a1 1 0 0 1-.95.95H5a1 1 0 0 1-1-.95V22a1 1 0 0 0-2 0v1.05A3 3 0 0 0 5 26h22.1a3 3 0 0 0 2.9-2.95V10a3 3 0 0 0-2.95-3z" />
                    <path d="M3 19a1 1 0 0 0 1-1v-5h21a1 1 0 0 0 0-2H4v-1a1 1 0 0 1 1-1h14a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v8a1 1 0 0 0 1 1zM7 20a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2z" />
                  </g>
                </svg>
                Subscriptions
              </a>
            </li>

            {/* Questions */}
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 128 128"
                >
                  <path
                    fill="#0a0a0a"
                    d="M64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7c12.1 0 23.4 3.7 32.7 10.1 13.7 9.4 23.1 24.5 24.7 41.8 0 .5.1 9.8 0 10.7-2.7 29.2-27.4 52-57.4 52zm-3.2-89.1c-14.5 0-19.1 13.3-19.2 25.5h9.6c-.2-8.8.7-15.9 9.6-15.9 6.4 0 9.6 2.7 9.6 9.6 0 4.4-3.4 6.6-6.4 9.6-6.2 6-5.7 10.4-6 18.7h8.4c.3-7.5.2-7.3 6.4-13.9 4.2-4.1 7.1-8.2 7.1-14.5.1-10.1-5.3-19.1-19.1-19.1zm3.3 54.1c-3.6 0-6.4 2.9-6.4 6.4 0 3.5 2.9 6.4 6.4 6.4 3.6 0 6.4-2.9 6.4-6.4 0-3.6-2.9-6.4-6.4-6.4z"
                  />
                </svg>
                Questions
              </a>
            </li>

            {/* Reviews */}
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 32 32"
                >
                  <path d="M27 11h-8.52L19 9.8A6.42 6.42 0 0 0 13 1a1 1 0 0 0-.93.63L8.32 11H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h18.17a3 3 0 0 0 2.12-.88l3.83-3.83a3 3 0 0 0 .88-2.12V14a3 3 0 0 0-3-3zM4 28V14a1 1 0 0 1 1-1h3v16H5a1 1 0 0 1-1-1zm24-3.83a1 1 0 0 1-.29.71l-3.83 3.83a1.05 1.05 0 0 1-.71.29H10V12.19l3.66-9.14a4.31 4.31 0 0 1 3 1.89 4.38 4.38 0 0 1 .44 4.12l-1 2.57A1 1 0 0 0 17 13h10a1 1 0 0 1 1 1z" />
                </svg>
                Reviews
              </a>
            </li>

            {/* Profile */}
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
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
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
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
            <div>
              <p className="text-sm font-semibold text-gray-900">nipij52341</p>
              <p className="text-xs text-gray-500">
                nipij523...@dropeso.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
<div className="pt-5 sm:ml-64 h-screen overflow-y-auto">
  <div className="flex items-center justify-between border-b border-gray-200 bg-white">
    <div className="w-full min-h-screen bg-white px-8 py-5">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">
        My Business Profiles (14)
      </h1>

      {/* Cards will go here */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Example Card */}
        <div className="bg-white rounded-xl shadow hover:shadow-md transition p-5 border border-gray-100">
          <div
            className="h-40 bg-center bg-cover rounded-md mb-4"
            style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}
          ></div>
          <h3 className="text-lg font-semibold text-gray-800">
            Detroit Metro Airport
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Detroit, MI 48242, USA
          </p>
          <button className="mt-3 text-sm text-blue-600 hover:underline">
            View Details
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

    </div>
  )
}

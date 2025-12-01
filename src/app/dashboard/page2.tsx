"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  user_role: string;
  email: string;
}

export default function Page() {

  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();


  const getUserFromSession = (): User | null => {

    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  };

  useEffect(() => {
    const userData = getUserFromSession();
    setUser(userData);
  }, [router]);







  return (

    <div className="w-full h-screen overflow-y-auto">
      {user?.user_role === "Admin" ? (
        <div
          className="flex items-center justify-between border-b border-gray-200 bg-white">
          <div className="w-full min-h-screen bg-white">
            {/* <!-- Header Row --> */}

            <div className="w-full min-h-screen bg-white px-6 py-5">
              <div className="cards flex flex-wrap lg:flex-nowrap sm:flex-wrap gap-4 items-center pb-10 pt-4">

                {/* card-1 */}
                <a href="#" className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] items-center sm:items-start p-3 px-4 bg-[#E9F6FB] rounded-lg shadow-md  dark:border-gray-700">

                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">13</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Accessible Cities</p>
                </a>

                {/* card-2 */}
                <a href="#" className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] items-center sm:items-start p-3 px-4 bg-[#fcf4e0] rounded-lg shadow-md  dark:border-gray-700">

                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">20</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Paid Contributors</p>
                </a>

                {/* card-3 */}
                <a href="#" className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] items-center sm:items-start p-3 px-4 bg-[#ffe2df] rounded-lg shadow-md  dark:border-gray-700">

                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">25</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Volunteer Contributors</p>
                </a>

                {/* card-4 */}
                <a href="#" className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] items-center sm:items-start p-3 px-4 bg-[#daf1e6] rounded-lg shadow-md  dark:border-gray-700">

                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">383</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Business Profiles</p>
                </a>

                {/* card-5 */}
                <a href="#" className="block max-w-sm w-[300px] md:w-[300px] sm:w-[250px] items-center sm:items-start p-3 px-4 bg-[#fde8e2] rounded-lg shadow-md  dark:border-gray-700">

                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">7</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Total Partners</p>
                </a>

              </div>



              {/* <!-- Header --> */}
              <div className="flex items-center justify-between mb-8">
                {/* <!-- Title --> */}

                <h1
                  className="text-2xl font-semibold text-gray-900">Recently Created Businesses (14)</h1>

                {/* <!-- Controls --> */}

                <div className="flex items-center gap-3">



                  {/* <!-- Sort By --> */}

                  <button
                    className="flex items-center gap-1 border border-gray-300 text-gray-700 text-sm px-3 py-1.5 rounded-md hover:bg-gray-50">
                    Sort By
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4" fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* <!-- Search --> */}
                  <div
                    className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 w-72">
                    <svg xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                    <input type="text"
                      placeholder="Search by Business Name, City, Category"
                      className="w-full border-none focus:ring-0 focus:border-0 active:border-0 focus-visible:outline-0 text-sm text-gray-700 placeholder-gray-400 ml-2" />
                  </div>
                </div>
              </div>

              {/* <!-- Empty State Content --> */}
              <section className="flex-1">

                {/* <!-- Business Cards --> */}
                <section
                  className="space-y-10 lg:space-y-4 md:space-y-4">
                  {/* <!-- Card --> */}

                  <div
                    className="border border-gray-200 rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

                    {/* <!-- left-side --> */}
                    <div
                      className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                      style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}>

                      {/* <!-- Approved Badge --> */}
                      <span
                        className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#FFF4E0] text-[#A65C00] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        Approved
                      </span>
                    </div>

                    {/* <!-- rigth-side --> */}
                    <div
                      className="flex-1 bg-white p-4 ps-6 space-y-4">
                      <div
                        className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                        <h3
                          className="font-semibold text-gray-800 text-xl">
                          Detroit Metro Airport
                        </h3>

                        <div
                          className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                          {/* <!-- Saved Button --> */}
                          <label
                            className="inline-flex items-center gap-1 cursor-pointer">
                            <input type="checkbox"
                              className="peer hidden" />
                            <div
                              className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="black"
                                fill="white"
                                className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                              </svg>
                              <span>0 Saved</span>
                            </div>
                          </label>

                          {/* <!-- Views Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              <circle cx="12"
                                cy="12" r="3" />
                            </svg>
                            18.0 Views
                          </button>

                          {/* <!-- Recommendations Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                            </svg>
                            1.0 Recommendations
                          </button>

                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex">
                          <span
                            className="font-medium text-gray-500 pe-2">Categories</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap space-x-2">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="text-xs text-gray-500 mt-2">
                        <div
                          className="flex flex-wrap md:gap-0 gap-2">
                          <span
                            className="font-medium text-gray-500 pe-2">Accessible
                            Features</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">available</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/clock.webp"
                          className="w-3 h-3" /> <span
                            className="text-sm">Operating
                          hours not
                          specified</span>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/location.png"
                          className="w-3 h-3" /> <span
                            className="text-sm">Detroit, MI
                          48242,
                          USA</span>
                      </div>
                    </div>
                  </div>

                  {/* <!-- card-2 --> */}
                  <div
                    className="border border-gray-200 rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

                    {/* <!-- left-side --> */}
                    <div
                      className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                      style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}>

                      {/* <!-- Approved Badge --> */}
                      <span
                        className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#ECFDF3] text-[#039855] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        Approved
                      </span>
                    </div>

                    {/* <!-- rigth-side --> */}
                    <div
                      className="flex-1 bg-white p-4 ps-6 space-y-4">
                      <div
                        className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                        <h3
                          className="font-semibold text-gray-800 text-xl">
                          Detroit Metro Airport
                        </h3>

                        <div
                          className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                          {/* <!-- Saved Button --> */}
                          <label
                            className="inline-flex items-center gap-1 cursor-pointer">
                            <input type="checkbox"
                              className="peer hidden" />
                            <div
                              className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="black"
                                fill="white"
                                className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                              </svg>
                              <span>0 Saved</span>
                            </div>
                          </label>

                          {/* <!-- Views Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              <circle cx="12"
                                cy="12" r="3" />
                            </svg>
                            18.0 Views
                          </button>

                          {/* <!-- Recommendations Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                            </svg>
                            1.0 Recommendations
                          </button>

                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex">
                          <span
                            className="font-medium text-gray-500 pe-2">Categories</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap space-x-2">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                          </ul>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <div className="flex flex-wrap md:gap-0 gap-2">
                          <span
                            className="font-medium text-gray-500 pe-2">Accessible
                            Features</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">available</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/clock.webp"
                          className="w-3 h-3" /> <span
                            className="text-sm">Operating
                          hours not
                          specified</span>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/location.png"
                          className="w-3 h-3" /> <span
                            className="text-sm">Detroit, MI
                          48242,
                          USA</span>
                      </div>
                    </div>
                  </div>

                  {/* <!-- card-3 --> */}
                  <div
                    className="border border-gray-200 rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

                    {/* <!-- left-side --> */}
                    <div
                      className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                      style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}>

                      {/* <!-- Approved Badge --> */}
                      <span
                        className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#ECFDF3] text-[#039855] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                        Approved
                      </span>
                    </div>

                    {/* <!-- right-side --> */}
                    <div
                      className="flex-1 bg-white p-4 ps-6 space-y-4">
                      <div
                        className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                        <h3
                          className="font-semibold text-gray-800 text-xl">
                          Detroit Metro Airport
                        </h3>

                        <div
                          className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                          {/* <!-- Saved Button --> */}
                          <label
                            className="inline-flex items-center gap-1 cursor-pointer">
                            <input type="checkbox"
                              className="peer hidden" />
                            <div
                              className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="black"
                                fill="white"
                                className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                              </svg>
                              <span>0 Saved</span>
                            </div>
                          </label>

                          {/* <!-- Views Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              <circle cx="12"
                                cy="12" r="3" />
                            </svg>
                            18.0 Views
                          </button>

                          {/* <!-- Recommendations Button --> */}
                          <button
                            className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="white"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="black"
                              className="w-4 h-4">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                            </svg>
                            1.0 Recommendations
                          </button>

                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="flex">
                          <span
                            className="font-medium text-gray-500 pe-2">Categories</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap space-x-2">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="text-xs text-gray-500 mt-2">
                        <div
                          className="flex flex-wrap md:gap-0 gap-2">
                          <span
                            className="font-medium text-gray-500 pe-2">Accessible
                            Features</span>
                          <ul
                            className="flex flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">available</li>
                            <li
                              className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/clock.webp"
                          className="w-3 h-3" /> <span
                            className="text-sm">Operating
                          hours not
                          specified</span>
                      </div>
                      <div
                        className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <img
                          src="assets/images/location.png"
                          className="w-3 h-3" /> <span
                            className="text-sm">Detroit, MI
                          48242,
                          USA</span>
                      </div>
                    </div>
                  </div>
                </section>
              </section>
            </div>

          </div>

        </div>
      ) : (
        <>
          <p></p>
        </>
      )}
    </div>

  );

}

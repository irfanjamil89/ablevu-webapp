import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessible Business Search | AbleVu",
  description:
    "Find accessible businesses, restaurants, hotels, and public places near you. Filter results by wheelchair access, restrooms, and other inclusive features.",
  keywords: [
    "accessible businesses",
    "wheelchair friendly",
    "accessible restaurants",
    "disability access",
    "inclusive travel",
    "AbleVu search",
  ],
  
};



export default function page() {

  
  return (

    <div>
   

    <div className="bg-[#F7f7f7] py-4">
      <main
        className="bg-white px-3 lg:rounded-full lg:px-6 lg:py-4 md:px-2 md:bg-transparent mx-auto p-4 flex flex-col lg:flex-row gap-6 mt-4">
        <aside className="w-full xxl:w-1/6 xl:w-1/5 lg:w-1/4 h-fit space-y-6">
          <div
            className="bg-[#F0F1FF]  rounded-2xl p-5 space-y-6 font-['Helvetica']">
            <div>
              <h2 className="font-semibold text-lg mb-2">Filter Results (343)</h2>
            </div>

            <div>
              <h3
                className="font-semibold text-gray-700 mb-3 text-md tracking-wide">
                Category
              </h3>
              <div className="flex flex-wrap gap-2 font-['Helvetica']">
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Amusement
                  Park</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Airport</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Attraction</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Community
                  Resource</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Church</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Education</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Family
                  Entertainment</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Financial
                  Institution</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Hotels/Lodging</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Library</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Medical/Dental</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Museum</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Park/Beach</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Restaurant</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Retail</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Stadium</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Zoo/Aquarium</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Services</span>
                <span
                  className=" bg-white text-sm px-3 py-1 rounded-full cursor-pointer hover:bg-blue-50">Other</span>
              </div>
            </div>

            <div>
              <h3
                className="font-semibold text-gray-700 mb-3 text-md tracking-wide">
                Accessible Features
              </h3>
              <ul
                className="space-y-2 text-sm font-['Helvetica'] overflow-y-auto max-h-40 pr-2">
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Entrance</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Parking</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Restroom</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Wheelchair
                    Seating</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Entrance</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Parking</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Accessible
                    Restroom</label></li>
                <li><label className="flex items-center gap-2"><input
                      type="checkbox" className="accent-blue-700" /> Wheelchair
                    Seating</label></li>
              </ul>
            </div>
          </div>

          <div className="bg-white  rounded-2xl p-5 font-['Helvetica']">
            
            <h3 className="font-bold text-gray-800 text-md mb-2">
              Looking for a specific business?
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              If you're looking for a specific business and cannot find it on
              AbleVu yet, let us know and we will get it
              added.
            </p>
            <button
              className="w-1/3 bg-blue-700 text-white text-sm py-2 rounded-full hover:bg-blue-800 transition">
              Contact Us
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-[24px] font-['Helvetica']">Business
              List</h2>
            <button
              className="flex items-center justify-between gap-[8px]  -gray text-sm bg-white px-3 py-2 rounded-full text-black">
              <img src="assets/images/location.png" className="w-3 h-3" /> Search with
              Map
            </button>
          </div>

          <section className="space-y-10 lg:space-y-4 md:space-y-4">
            <div
              className=" rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

              <div
                className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}
                >

                <span
                  className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#FFF4E0] text-[#A65C00] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                  Approved
                </span>
              </div>

              <div className="flex-1 bg-white p-4 ps-6 space-y-4">
                <div
                  className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                  <h3 className="font-semibold text-xl">
                    Detroit Metro Airport
                  </h3>

                  <div
                    className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                    <label
                      className="inline-flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" className="peer hidden" />
                      <div
                        className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24" stroke-width="2" stroke="black"
                          fill="white"
                          className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                        </svg>
                        <span>0 Saved</span>
                      </div>
                    </label>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      18.0 Views
                    </button>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                      </svg>
                      1.0 Recommendations
                    </button>

                  </div>
                </div>
                <p className="text-sm">
                  <div className="flex">
                    <span className="font-medium pe-2">Categories</span>
                    <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                    </ul>
                  </div>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <div className="flex flex-wrap md:gap-0 gap-2">
                    <span className="font-medium pe-2">Accessible Features</span>
                    <ul
                      className="flex  flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">available</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                    </ul>
                  </div>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/clock.webp" className="w-3 h-3" /> <span
                    className="text-sm">Operating hours not
                    specified</span>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/location.png" className="w-3 h-3" /> <span
                    className="text-sm">Detroit, MI 48242,
                    USA</span>
                </p>
              </div>
            </div>

             <div
              className=" rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

           <div
                className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
                style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}
                >

                <span
                  className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#ECFDF3] text-[#039855] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                  Approved
                </span>
              </div>

              <div className="flex-1 bg-white p-4 ps-6 space-y-4">
                <div
                  className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                  <h3 className="font-semibold text-xl">
                    Detroit Metro Airport
                  </h3>

                  <div
                    className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                    <label
                      className="inline-flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" className="peer hidden" />
                      <div
                        className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24" stroke-width="2" stroke="black"
                          fill="white"
                          className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                        </svg>
                        <span>0 Saved</span>
                      </div>
                    </label>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      18.0 Views
                    </button>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                      </svg>
                      1.0 Recommendations
                    </button>

                  </div>
                </div>
                <p className="text-sm">
                  <div className="flex">
                    <span className="font-medium pe-2">Categories</span>
                    <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                    </ul>
                  </div>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <div className="flex flex-wrap md:gap-0 gap-2">
                    <span className="font-medium pe-2">Accessible Features</span>
                    <ul
                      className="flex  flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">available</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                    </ul>
                  </div>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/clock.webp" className="w-3 h-3" /> <span
                    className="text-sm">Operating hours not
                    specified</span>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/location.png" className="w-3 h-3" /> <span
                    className="text-sm">Detroit, MI 48242,
                    USA</span>
                </p>
              </div>
            </div>

            <div
              className=" rounded-xl flex md:items-center flex-col md:flex-row font-['Helvetica'] bg-white md:bg-[#E5E5E5]">

             <div
            className="relative flex items-center w-full h-[300px] xxl:w-[15%] xl:w-[18%] lg:w-[18%] md:w-[25%] md:h-24 shadow-sm bg-contain md:bg-cover bg-center bg-no-repeat opacity-95"
            style={{ backgroundImage: "url('/assets/images/search-1.jpg')" }}
            >

                <span
                  className="absolute md:-top-6 top-5 md:right-2 right-14 bg-[#ECFDF3] text-[#039855] text-sm font-semibold px-2 py-0.5 rounded-md shadow-sm">
                  Approved
                </span>
              </div>

              <div className="flex-1 bg-white p-4 ps-6 space-y-4">
                <div
                  className="flex md:items-center md:gap-0 gap-5 items-start md:flex-row flex-col justify-between mb-1">
                  <h3 className="font-semibold text-xl">
                    Detroit Metro Airport
                  </h3>

                  <div
                    className="flex flex-wrap md:flex-nowrap gap-2 ['Helvetica']">
                    <label
                      className="inline-flex items-center gap-1 cursor-pointer">
                      <input type="checkbox" className="peer hidden" />
                      <div
                        className="bg-[#F0F1FF] text-[#1B19CE] text-xs px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24" stroke-width="2" stroke="black"
                          fill="white"
                          className="w-3.5 h-4 peer-checked:fill-black peer-checked:stroke-black transition-colors">
                          <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                        </svg>
                        <span>0 Saved</span>
                      </div>
                    </label>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      18.0 Views
                    </button>

                    <button
                      className="flex items-center gap-1 bg-[#F0F1FF] text-[#1B19CE] text-xs font-semibold px-3 py-1 rounded-full hover:bg-[#e0e2ff] transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="white"
                        viewBox="0 0 24 24" stroke-width="2"
                        stroke="black" className="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round"
                          d="M14 9V5a3 3 0 00-3-3l-4 9v11h9.28a2 2 0 001.986-1.667l1.2-7A2 2 0 0017.486 11H14zM7 22H4a2 2 0 01-2-2v-9a2 2 0 012-2h3v13z" />
                      </svg>
                      1.0 Recommendations
                    </button>

                  </div>
                </div>
                <p className="text-sm">
                  <div className="flex">
                    <span className="font-medium pe-2">Categories</span>
                    <ul className="flex flex-wrap md:flex-nowrap space-x-2">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Airport</li>
                    </ul>
                  </div>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  <div className="flex flex-wrap md:gap-0 gap-2">
                    <span className="font-medium pe-2">Accessible Features</span>
                    <ul
                      className="flex  flex-wrap md:flex-nowrap md:gap-0 gap-5 md:space-x-2 space-x-0">
                      <li className="bg-[#F7F7F7] rounded-full px-2">Entrance</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">available</li>
                      <li className="bg-[#F7F7F7] rounded-full px-2">elevators</li>
                    </ul>
                  </div>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/clock.webp" className="w-3 h-3" /> <span
                    className="text-sm">Operating hours not
                    specified</span>
                </p>
                <p
                  className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <img src="assets/images/location.png" className="w-3 h-3" /> <span
                    className="text-sm">Detroit, MI 48242,
                    USA</span>
                </p>
              </div>
            </div>

            <div
              className="flex justify-start items-center mt-6 gap-2 select-none font-['Helvetica']">
              <button
                className="px-3 py-1 rounded-full  -gray-300 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
                ‹
              </button>

              <button
                className="px-3 py-1 rounded-full bg-blue-700 text-white text-sm font-medium">
                1
              </button>
              <button
                className="px-3 py-1 rounded-full  -gray-300 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
                2
              </button>
              <button
                className="px-3 py-1 rounded-full  -gray-300 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
                3
              </button>
              <span className="px-2 text-gray-400">...</span>
              <button
                className="px-3 py-1 rounded-full  -gray-300 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
                10
              </button>

              <button
                className="px-3 py-1 rounded-full  -gray-300 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition">
                ›
              </button>
            </div>

          </section>
        </section>
      </main>
    </div>
    </div>
  )
}

import React from 'react'

export default function Allitems() {
    return (
        <div className="w-full">

            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full bg-white">
                    {/* <!-- Header Row --> */}

                    <div className="w-full min-h-screen bg-white px-6 py-1">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 items-center justify-end mb-8">
                            {/* <!-- Title --> */}

                            <div className="flex flex-wrap gap-y-4 items-center gap-3">

                                {/* <!-- SORT BY --> */}

                                <div className="relative inline-block text-left">
                                    {/* <!-- Hidden Toggle --> */}
                                    <input type="checkbox" id="sort-by-toggle" className="hidden peer" />

                                    {/* <!-- Trigger --> */}
                                    <label
                                        htmlFor="sort-by-toggle"
                                        className="flex items-center justify-between border border-gray-300 text-gray-700 text-sm px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer"
                                    >
                                        Sort By
                                        <svg
                                            className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2" d="m1 1 4 4 4-4" />
                                        </svg>
                                    </label>

                                    {/* <!-- Click outside overlay --> */}
                                    <label htmlFor="sort-by-toggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

                                    {/* <!-- Dropdown --> */}
                                    <div
                                        className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[200px]"
                                    >
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Name (A–Z)</a></li>
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Name (Z–A)</a></li>
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Created Date (Low–High)</a></li>
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Created Date (High–Low)</a></li>
                                        </ul>
                                    </div>

                                </div>

                                <a href='#'
                                    className="px-6 py-3 text-sm font-bold border border-gray-300 text-gray-700 rounded-full cursor-pointer flex gap-2 items-center">
                                    <span><img src="/assets/images/location.png" className='w-4 h-4' /></span>Interact with Map
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

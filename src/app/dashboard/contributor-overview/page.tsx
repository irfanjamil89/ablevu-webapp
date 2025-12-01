import React from 'react'

export default function Page() {
    return (
        <div className="w-full h-screen">

            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">
                    {/* <!-- Header Row --> */}

                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
                            {/* <!-- Title --> */}

                            <h1
                                className="text-2xl font-semibold text-gray-900"> My Contributions</h1>



                            {/* <!-- Controls --> */}

                            <div className="flex flex-wrap gap-y-4 items-center gap-3 ">

                                {/* pop-up button start */}

                                <input type="checkbox" id="contribution-overview-toggle" className="hidden peer" />

                                {/* <!-- OPEN BUTTON --> */}
                                <label htmlFor="contribution-overview-toggle"
                                    className="px-6 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
                                    Add New Business
                                </label>

                                {/* <!-- OVERLAY --> */}
                                <div
                                    className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50 ">

                                    {/* <!-- MODAL CARD --> */}
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[480px] p-6 relative h-[650px] overflow-hidden overflow-y-auto">

                                        {/* <!-- CLOSE BUTTON --> */}
                                        <label htmlFor="contribution-overview-toggle"
                                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                                            ×
                                        </label>

                                        {/* <!-- HEADER --> */}
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-2 space-y-5">Add New Business</h2>
                                        <p className="text-gray-600 text-sm mb-4">
                                            This business will remain locked until is has been claimed by the business. Please submit to admin for approval.
                                        </p>

                                        {/* <!-- FORM --> */}
                                        <form className="space-y-4">

                                            {/* <!-- Business Name --> */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name <span className="text-red-500">*</span></label>
                                                <input type="text" placeholder="Sample Business Name"
                                                    className="w-full border placeholder:text-gray-600 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none" />
                                            </div>

                                            {/* <!-- Business Address --> */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800 mb-1">Business Address <span className="text-red-500">*</span></label>
                                                <input type="text" placeholder="123 Main Street, Anytown, CA 91234"
                                                    className="w-full border placeholder:text-gray-600 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none" />
                                            </div>

                                            {/* <!-- Upload Business Logo --> */}
                                            <div>
                                                <label className="block text-md font-medium text-gray-800 mb-2">Upload Business Logo/Photo</label>
                                                <div className="relative">
                                                    {/* Hidden file input */}
                                                    <input
                                                        type="file"
                                                        accept=".svg,.png,.jpg,.gif"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />

                                                    {/* Upload Area */}
                                                    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                                                        <img src="/assets/images/upload-icon.avif" alt="upload-icon" className='w-10 h-10' />
                                                        <p className="text-[#0519CE] font-semibold text-sm">Click to upload <span className='text-gray-500 text-xs'>or drag and drop</span></p>
                                                        <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <!-- Business Description --> */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800 mb-1">Business Description <span className="text-red-500">*</span></label>
                                                <textarea
                                                    rows={5}
                                                    cols={40}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"></textarea>
                                            </div>

                                            {/* <!-- Business Category --> */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-800 mb-1">Business Categories <span className="text-red-500">*</span></label>
                                                <select
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none">
                                                    <option>Select Category</option>
                                                    <option>Amusement Park</option>
                                                    <option>Airport</option>
                                                    <option>Attraction</option>
                                                    <option>Community Resource</option>
                                                </select>
                                            </div>

                                            {/* <!-- BUTTONS --> */}
                                            <div className="flex justify-center gap-3 pt-2">
                                                <label htmlFor="contribution-overview-toggle"
                                                    className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                                    Cancel
                                                </label>
                                                <button type="submit"
                                                    className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                                    Create Business
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* pop-up button END */}

                            </div>
                        </div>
                        <section className="bg-[#F0F1FF] py-3 px-4 flex items-center rounded-lg justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-blue-600 text-xl w-5 h-5"><img src="/assets/images/error.svg" /></span>
                                <p className="text-gray-800 text-base">
                                    Right now, you are a <span className="font-bold text-black">volunteer contributor</span>. Do you want to become a Paid Contributor?
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-y-4 items-center gap-3">

                                {/* pop-up button start */}

                                <input type="checkbox" id="learn-more-toggle" className="hidden peer" />

                                {/* <!-- OPEN BUTTON --> */}
                                <label htmlFor="learn-more-toggle"
                                    className="px-6 py-3 text-[#0519CE] font-bold underline text-sm cursor-pointer">
                                    Learn More
                                </label>

                                {/* <!-- OVERLAY --> */}
                                <div
                                    className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

                                    {/* <!-- MODAL CARD --> */}
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[450px] p-6 relative">

                                        {/* <!-- CLOSE BUTTON --> */}
                                        <label htmlFor="learn-more-toggle"
                                            className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                                            ×
                                        </label>

                                        {/* <!-- HEADER --> */}
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-2 space-y-5">Paid Contributor</h2>
                                        <p className="text-gray-600 text-md mb-4">
                                            As a paid contributor, you have the opportunity to earn when businesses approve the profiles you create for them.
                                        </p>

                                        {/* <!-- FORM --> */}
                                        <form className="space-y-4">

                                            <ul className="space-y-4">
                                                <li className="flex items-start pr-5">
                                                        <img src="/assets/images/tick-circle.svg" alt="tick-circle" className='w-5 h-5'/>
                                                    <p className="ml-3 text-gray-800">
                                                        Once a business approves a profile you’ve submitted or claim it, they will pay you a creation fee of $100 for that profile.
                                                    </p>
                                                </li>

                                                <li className="flex items-start pr-5">
                                                    <img src="/assets/images/tick-circle.svg" alt="tick-circle" className='w-5 h-5'/>
                                                    <p className="ml-3 text-gray-800">
                                                       AbleVu will keep the platform fee on every transaction of business profile.
                                                    </p>
                                                </li>
                                            </ul>



                                            {/* <!-- BUTTONS --> */}
                                            <div className="flex justify-center gap-3 pt-2">
                                                <button type="submit"
                                                    className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                                    Complete Account Details
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* pop-up button END */}

                            </div>
                        </section>

                        {/* <!-- SORT BY --> */}

                        <section className="flex mt-4 justify-end">
                            {/* <!-- Hidden Toggle --> */}
                            <input type="checkbox" id="sort-by-toggle" className="hidden peer" />

                            {/* <!-- Trigger --> */}
                            <label
                                htmlFor="sort-by-toggle"
                                className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-3 rounded-md hover:bg-gray-50 cursor-pointer"
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
                                className="absolute z-20 mt-8 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[200px]"
                            >
                                <ul className="py-2 text-sm text-gray-700">
                                    <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Name (A–Z)</a></li>
                                    <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Name (Z–A)</a></li>
                                    <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Created Date (Low–High)</a></li>
                                    <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Created Date (High–Low)</a></li>
                                </ul>
                            </div>
                        </section>

                    </div>


                </div>

            </div>
        </div>
    )
}

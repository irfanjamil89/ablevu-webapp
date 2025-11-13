import React from 'react'

export default function Users() {
    return (
        <div className="w-full h-screen overflow-hidden">
            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">

                    {/* <!-- Header Row --> */}
                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 items-center justify-between mb-8">
                            {/* <!-- Title --> */}

                            <h1
                                className="text-2xl font-semibold text-gray-900"> All Users (480)</h1>

                            {/* <!-- Controls --> */}

                            <div className="flex flex-wrap gap-y-4 items-center gap-3">

                                {/* clear all */}
                                <div className="relative inline-block text-left">
                                    <div className="text-md text-gray-500 cursor-pointer">Clear All</div>
                                </div>


                                {/* <!-- BUSINESS STATUS --> */}

                                <div className="relative inline-block text-left">
                                    {/* <!-- Hidden Toggle --> */}
                                    <input type="checkbox" id="business-status-toggle" className="hidden peer" />

                                    {/* <!-- Trigger --> */}
                                    <label
                                        htmlFor="business-status-toggle"
                                        className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-2.5 rounded-lg hover:border-[#0519CE] cursor-pointer w-auto md:w-[250px] transition-all duration-200"

                                    >
                                        User Role
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
                                    <label htmlFor="business-status-toggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

                                    {/* <!-- Dropdown --> */}
                                    <div
                                        className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md w-[250px]"
                                    >
                                        <ul className="py-2 text-sm text-gray-700">
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Contributor</a></li>
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Business</a></li>
                                            <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">User</a></li>
                                        </ul>
                                    </div>
                                </div>



                                {/* <!-- Search --> */}
                                <div
                                    className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 w-auto lg:w-[280px] md:w-[250px]">
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
                                    <input
                                        type="text"
                                        placeholder="Search by Name, Email"
                                        className="w-full border-none focus:outline-none focus:ring-0 font-medium text-sm text-gray-700 placeholder-gray-700 ml-2"
                                    />

                                </div>

                            </div>
                        </div>

                        {/* <!-- Empty State Content --> */}
                        <section className="flex-1">

                            {/* <!-- table START --> */}
                            {/* Hidden “none” radio for reset */}
                            <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

                            <div className="h-auto overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm text-left text-gray-700">
                                    <thead className="bg-[#EFF0F1] text-gray-500 text-sm font-bold">
                                        <tr>
                                            <th scope="col" className="w-auto lg:w-[800px] py-3 pr-3 pl-3">Name/Email</th>
                                            <th scope="col" className="px-6 py-3">Joining Date</th>
                                            <th scope="col" className="w-auto lg:w-[200px] px-6 py-3">User Role</th>
                                            <th scope="col" className="px-6 py-3">Profiles Created</th>
                                            <th scope="col" className="px-3 py-3 text-right"></th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {/* Reusable Row Component Pattern */}
                                        {[
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                            { name: "Michael Burnham", email: "info@amishfarmandhouse.com", joiningDate: "12 Nov 2025", role: "Business", profilesCreated: 0 },
                                        ].map(({ name, email, joiningDate, role, profilesCreated }, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 py-5 pr-4 pl-3">
                                                    <span className="block font-semibold">{name}</span>
                                                    <span className="text-sm text-gray-600">{email}</span>
                                                </td>
                                                <td className="px-6 py-5">{joiningDate}</td>
                                                <td className="px-6 py-5">{role}</td>
                                                <td className="px-6 py-5 font-medium">{profilesCreated}</td>

                                                {/* Dropdown Cell */}
                                                <td className="relative px-6 py-5 text-right">
                                                    {/* Radio Input */}
                                                    <input
                                                        type="radio"
                                                        name="menuGroup"
                                                        id={`menuToggle${index}`}
                                                        className="hidden peer"
                                                    />

                                                    {/* Trigger Icon */}
                                                    <label
                                                        htmlFor={`menuToggle${index}`}
                                                        className="cursor-pointer text-gray-500 text-2xl select-none"
                                                    >
                                                        ⋮
                                                    </label>

                                                    {/* Invisible overlay to close when clicked outside */}
                                                    <label
                                                        htmlFor="none"
                                                        className="hidden peer-checked:block fixed inset-0 z-40"
                                                    ></label>

                                                    {/* Dropdown Menu */}
                                                    <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                                                        <button className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm">
                                                            ✏️ Edit
                                                        </button>
                                                        <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg">
                                                            🗑️ Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                        </section>
                    </div>

                </div>

            </div>
        </div>
    )
}

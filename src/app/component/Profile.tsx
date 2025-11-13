import React from 'react'

export default function Profile() {
    return (
        <div className="w-full p-6 space-y-10">
            {/* <!-- About Me Section --> */}

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
            <div className="flex bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
                <div className="flex flex-col justify-baseline items-center mb-6 w-auto md:w-[170px]">
                    <img src="/assets/images/Meegan.avif" alt="Profile Picture" className="rounded-full w-30 h-30 mr-4" />
                    <div>
                        <button className="text-[#0519CE] underline underline-[#0519CE] font-bold cursor-pointer text-md">Edit Photo</button>
                    </div>
                </div>
                <form action="#" className='w-full'>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">

                        {/* <!-- First Name --> */}
                        <div className="flex flex-col">
                            <label htmlFor="first-name" className="text-md font-medium text-gray-600">First name</label>
                            <input
                                type="text"
                                id="first-name"
                                name="first-name"
                                defaultValue="Meegan" // Use defaultValue for non-editable fields
                                className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none"
                            />
                        </div>

                        {/* <!-- Last Name --> */}
                        <div className="flex flex-col">
                            <label htmlFor="last-name" className="text-md font-medium text-gray-600">Last name</label>
                            <input type="text" id="last-name" name="last-name" defaultValue="Winters" className="border border-gray-200 rounded-lg p-3 mt-1 text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="text-md font-medium text-gray-600">Email</label>
                        <input type="email" id="email" name="email" defaultValue="meegan@ablevu.com" className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="text-md font-medium text-gray-600">Phone number</label>
                        <div className="flex items-center">
                            <input type="text" id="phone" name="phone" defaultValue="" placeholder='+1 201-555-0123' className="border border-gray-200 rounded-lg p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none placeholder:text-gray-400" />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button type="button" className="text-[#0519CE] text-sm font-bold border border-[#0519CE] cursor-pointer rounded-full py-3 px-6 hover:bg-gray-100">Cancel</button>
                        <button type="submit" className="bg-[#0519CE] text-white text-sm font-bold cursor-pointer rounded-full py-3 px-5 hover:bg-blue-700">Save Changes</button>
                    </div>
                </form>
            </div>

            {/* <!-- Change Password Section --> */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-md">
                <form action="#">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        {/* Current Password */}
                        <div className="mb-4">
                            <label htmlFor="current-password" className="text-md font-medium text-gray-600">Current Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    id="current-password"
                                    name="current-password"
                                    className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 pr-12 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none"
                                />
                                <span className="absolute right-3 top-5 cursor-pointer ">
                                    <img src="/assets/images/eye-svgrepo-com.svg" alt="eye-svgrepo-com.svg" className='w-5 h-5' />
                                </span>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="mb-4">
                            <label htmlFor="new-password" className="text-md font-medium text-gray-600">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                name="new-password"
                                className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label htmlFor="confirm-password" className="text-md font-medium text-gray-600">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirm-password"
                                className="border border-gray-300 rounded-md p-3 mt-1 w-full text-gray-700 hover:border-[#0519CE] focus:outline-1 outline-[#0519CE] focus:hover:border-none"
                            />
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <button type="submit" className="bg-[#0519CE] text-white text-sm font-bold cursor-pointer rounded-full py-3 px-8 hover:bg-blue-700">Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

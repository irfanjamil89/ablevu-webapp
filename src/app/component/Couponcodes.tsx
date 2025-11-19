import React from 'react'

export default function Couponcodes() {
    return (
        <div className="w-full h-screen overflow-hidden">
            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">

                    {/* <!-- Header Row --> */}
                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
                            {/* <!-- Title --> */}

                            <h1 className="text-2xl font-semibold text-gray-900">All Coupon Codes (14)</h1>

                            <div className="flex items-center gap-3">


                                {/* <!-- Add New Business --> */}
                                {/* pop-up button start */}

                                <input type="checkbox" id="Generate-Code-toggle" className="hidden peer" />

                                {/* <!-- OPEN BUTTON --> */}
                                <label htmlFor="Generate-Code-toggle"
                                    className="px-5 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
                                    Generate Code
                                </label>

                                {/* <!-- OVERLAY --> */}
                                <div
                                    className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

                                    {/* <!-- MODAL CARD --> */}
                                    <div
                                        className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[450px] p-7 relative">

                                        {/* <!-- CLOSE BUTTON --> */}
                                        <label htmlFor="Generate-Code-toggle"
                                            className="absolute top-7 right-8 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                                            ×
                                        </label>

                                        {/* <!-- HEADER --> */}
                                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Coupon Code</h2>

                                        {/* <!-- FORM --> */}
                                        <form className="space-y-4">

                                            {/* <!-- Business Name --> */}
                                            <div>
                                                <label className="block text-md font-medium text-gray-700 mb-2">Name <span className="text-red-500">*</span></label>
                                                <input type="text" placeholder="Enter"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:hover:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none" />
                                            </div>

                                            {/* <!-- Business Address --> */}
                                            <div>
                                                <label className="block text-md font-medium text-gray-700 mb-1">Code <span className="text-red-500">*</span></label>
                                                <input type="text" placeholder="Enter"
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:hover:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none" />
                                            </div>

                                            <div className="flex flex-2 gap-2">
                                                {/* <!-- Discount Percentage Input --> */}
                                                <div className="flex flex-col justify-between">
                                                    <label className="block text-md font-medium text-gray-700 mb-2">
                                                        Discount Percentage <span className="text-red-500">*</span>
                                                    </label>
                                                    <input type="number" placeholder="25.5"
                                                        className="placeholder:text-gray-500 placeholder:ms-2 mt-1 p-2 w-[194px] border border-gray-300 rounded-lg focus:outline-none focus:hover:border-0 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>

                                                {/* <!-- Validity in Months Input --> */}
                                                <div className="flex flex-col justify-between">
                                                    <label htmlFor="validity" className="w-full text-md font-medium text-gray-700 mb-1">
                                                        Validity in Months <span className="text-red-500">*</span>
                                                    </label>
                                                     <input type="number" placeholder="3"
                                                        className="placeholder:text-gray-500 placeholder:ms-2 mt-1 p-2 w-[194px] border border-gray-300 rounded-lg focus:outline-none focus:hover:border-0 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>
                                            </div>


                                            {/* <!-- BUTTONS --> */}
                                            <div className="flex justify-center gap-3 pt-2">
                                                <label htmlFor="Generate-Code-toggle"
                                                    className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                                    Cancel
                                                </label>
                                                <button type="submit"
                                                    className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                                    Generate Code
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                                {/* pop-up button END */}

                            </div>
                        </div>

                        {/* <!-- table --> */}
                        <div className="w-full bg-white">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-100 text-gray-600">
                                        {/* <tr>
          <th className="px-4 py-2">City</th>
          <th className="px-4 py-2">Businesses</th>
          <th className="px-4 py-2 text-center">Featured?</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr> */}
                                    </thead>
                                    <tbody className='space-y-3'>

                                        {/* <!-- Row 1 --> */}
                                        <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                                            <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                                                FIRSTONE
                                            </td>
                                            <td className="px-2 py-2">
                                                1T4sONd5</td>
                                            <td className="px-4 py-2 w-[150px]"></td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex items-center gap-1 ">
                                                    Discount: <span className='font-semibold'>100.0%</span>
                                                </div>

                                            </td>


                                            <td className="px-4 py-2 flex gap-3">
                                                {/* <!-- Delete Button --> */}
                                                <button>
                                                    <img src="assets/images/delete-svgrepo-com.svg" alt="Delete" className="w-8 h-8 cursor-pointer" />
                                                </button>
                                            </td>

                                        </tr>

                                        {/* <!-- Row 2 --> */}
                                        <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                                            <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                                                FIRSTONE
                                            </td>
                                            <td className="px-2 py-2">
                                                1T4sONd5</td>
                                            <td className="px-4 py-2 w-[150px]"></td>
                                            <td className="px-4 py-2 text-center">
                                                <div className="flex items-center gap-1 ">
                                                    Discount: <span className='font-semibold'>100.0%</span>
                                                </div>

                                            </td>


                                            <td className="px-4 py-2 flex gap-3">
                                                {/* <!-- Delete Button --> */}
                                                <button>
                                                    <img src="assets/images/delete-svgrepo-com.svg" alt="Delete" className="w-8 h-8 cursor-pointer" />
                                                </button>
                                            </td>

                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

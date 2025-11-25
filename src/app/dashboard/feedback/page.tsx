import React from 'react'

export default function Page() {
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

                            <h1 className="text-2xl font-semibold text-gray-900">Feedback</h1>
                        </div>

                        {/* <!-- table --> */}
                        <div className="w-full bg-white">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    
                                    <tbody className='space-y-3'>
                                        {/* <!-- Row 1 --> */}
                                        <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                                            <td className="px-4 py-2 flex items-center gap-2 font-medium">Any other feedback
                                            </td>
                                            <td className="px-4 py-2 text-md leading-tight w-[350px]">
                                                <div className="space-y-2">
                                                    <p>Change the virtual tour icon (maybe a walking man)</p>
                                                    <p>Consider modifying the words in the popup</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                                                <div className='flex gap-3 items-center'>
                                                    <img src="/assets/images/Profile.avif" alt="Lansing" className="w-12 h-12 rounded-full" />
                                                    <div className='flex flex-col text-sm'>
                                                        <span>Meegan Winters</span>
                                                        <span className='text-gray-600 font-medium'>wintersmm@gmail.com</span>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="px-4 py-2 flex gap-3">
                                                Apr 8, 2025
                                            </td>

                                        </tr>

                                        {/* <!-- Row 2 --> */}
                                        <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                                            <td className="px-4 py-2 flex items-center gap-2 font-medium">Any other feedback
                                            </td>
                                            <td className="px-4 py-2 text-md leading-tight w-[350px]">
                                                <div className='space-y-2'>
                                                    <p>Add country code to phone numbers</p>
                                                    <p>Modify address to accomodate non-US addresses</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                                                <div className='flex gap-3 items-center'>
                                                    <img src="/assets/images/Meegan.avif" alt="Lansing" className="w-12 h-12 rounded-full" />
                                                    <div className='flex flex-col text-sm'>
                                                        <span>Meegan Winters</span>
                                                        <span className='text-gray-600 font-medium'>meegan@ablevu.com</span>
                                                    </div>
                                                </div>
                                            </td>


                                            <td className="px-4 py-2 flex gap-3">
                                                Apr 8, 2025
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

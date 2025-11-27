import React from 'react'

export default function page() {
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
                                className="text-2xl font-semibold text-gray-900"> All Questions</h1>

                        </div>

                        <section className="w-full mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

                            {/* <!-- Top Row --> */}
                            <div className="flex items-center justify-between mb-4">

                                {/* <!-- Left: Anonymous + time --> */}
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                        <img src="/assets/images/Profile.avif" 
                                        className="w-6 h-6" alt="profile" />
                                    </div>

                                    <div className="text-gray-700 font-semibold">Anonymous</div>
                                    <div className="text-gray-400 text-sm">6 months ago</div>
                                </div>

                                {/* <!-- Right: Location --> */}
                                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">
                                    <img src="/assets/images/q-logo-1.webp"
                                        className="w-6 h-3" alt="location" />
                                    William H. Haithco Recreation Area
                                </div>

                            </div>

                            {/* <!-- Question --> */}
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">
                                Do you have accessible restrooms?
                            </h2>

                            {/* <!-- Textarea --> */}
                            <textarea
                                placeholder="Write your answer here"
                                className="w-full border placeholder:text-gray-600 border-gray-300 rounded-xl p-4 text-sm hover:border-[#0519CE] focus:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none mb-4"
                            ></textarea>

                            {/* <!-- Post Button --> */}
                            <div className="flex justify-end">
                                <button className="px-10 py-3 bg-[#0519CE] hover:bg-[#0519CE] text-white font-semibold rounded-full text-sm">
                                    Post
                                </button>
                            </div>

                        </section>
                    </div>
                </div>

            </div>
        </div>
    )
}

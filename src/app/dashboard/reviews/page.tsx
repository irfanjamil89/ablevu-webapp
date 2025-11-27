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
                                className="text-2xl font-semibold text-gray-900"> All Reviews</h1>

                        </div>

                        
                    </div>
                </div>

            </div>
        </div>
    )
}

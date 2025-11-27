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
                                className="text-2xl font-semibold text-gray-900"> Manage Subscriptions</h1>

                        </div>

                        {/* <!-- Empty State Content --> */}
                        <section>
                            <div className="w-[400px] h-[230px] rounded-2xl bg-[url('/assets/images/subscription-card.avif')] 
    bg-cover bg-center shadow-lg relative overflow-hidden p-5">

                                {/* Curved overlay shape */}
                                <div className="absolute inset-0">
                                    <div className="absolute w-[300px] h-[300px] bg-[#101b45] opacity-40 rounded-full top-10 -left-20 blur-2xl"></div>
                                </div>

                                {/* <!-- Chip --> */}
                                <div className="relative">
                                    <div className="w-10 h-8 bg-[url('/assets/images/Chip.svg')] 
    bg-cover bg-center rounded-sm"></div>
                                </div>

                                {/* <!-- Change Card --> */}
                                <div className="absolute right-5 top-5 text-white font-bold underline text-md cursor-pointer">
                                    Change Card
                                </div>








                                {/* <!-- Card Number Masked --> */}
                                <div className="absolute bottom-5 left-5 text-white font-bold tracking-normal text-2xl">
                                    **** **** ****
                                </div>

                            </div>
                            <h2
                                className="text-lg font-semibold text-gray-900 mt-10"> Billing History</h2>

                        </section>

                        <section>
                            <div className="flex flex-wrap gap-y-4 items-center justify-center mb-8">
                                {/* <!-- Title --> */}

                                <h2
                                    className="text-md font-semibold text-gray-900 tracking-tight mt-5"> No subscriptions yet!</h2>

                            </div>

                        </section>

                        {/* <!-- table Subscriptions --> */}
                        {/* <section className="flex-1">

                            <div className="h-fit rounded-lg shadow-sm border border-gray-200">
                                <table className="min-w-full text-sm text-left text-gray-500">
                                    <thead className="border border-gray-200 text-gray-500 text-sm">
                                        <tr>
                                            <th scope="col" className="w-auto py-3 pr-3 pl-3">Business Name</th>
                                            <th scope="col" className="px-6 py-3">Plan Type</th>
                                            <th scope="col" className="px-6 py-3">Start Date</th>
                                            <th scope="col" className="px-6 py-3">End Date</th>
                                            <th scope="col" className="px-3 py-3 text-start">Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-200">
                                        {[
                                            {
                                                name: "Flint Farmers' Market",
                                                plan: "Yearly",
                                                start: "May 21, 2025",
                                                end: "May 21, 2026",
                                                amount: "$299",
                                            },
                                        ].map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="px-6 pr-4 pl-3">{item.name}</td>
                                                <td className="px-6 py-4">{item.plan}</td>
                                                <td className="px-6 py-4">{item.start}</td>
                                                <td className="px-6 py-4 font-medium">{item.end}</td>
                                                <td className="px-6 py-4">{item.amount}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                        </section> */}


                    </div>

                </div>

            </div>
        </div>
    )
}

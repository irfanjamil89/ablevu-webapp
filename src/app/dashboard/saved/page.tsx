import React from "react";

export default function Page() {
    return (
        <div className="pt-5 w-full bg-white border-r border-gray-200">
            {/* <!-- Top Navigation --> */}
            <div className="py-3 px-4 w-full">
                <ul className="font-medium flex border-b border-gray-200">
                    {/* <!-- All Items --> */}
                    <li className="w-[180px]">
                        <a href="/allitems"
                            className="flex items-center justify-center font-semibold text-md gap-3 px-4 py-2 focus:text-[#0205D3] rounded-lg relative">
                            <span className="text-center">All Items</span>
                            {/* <!-- Active Indicator --> */}
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0205D3]"></div>
                        </a>
                    </li>

                    {/* <!-- My Collections --> */}
                    <li className="w-[180px]">
                        <a href="/mycollections"
                            className="flex items-center justify-center font-semibold text-md gap-3 px-4 py-2 focus:text-[#0205D3] text-gray-700 rounded-lg relative">
                            <span>My Collections</span>
                            {/* <!-- Active Indicator (Hidden) --> */}
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#0205D3]"></div>
                        </a>
                    </li>
                </ul>
            </div>
        </div>

    );
}

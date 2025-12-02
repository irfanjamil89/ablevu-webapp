import React from 'react'

export default function Mycollections() {
    return (
        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center mr-3 justify-end mb-8">

            <div className="flex items-center">

                <input type="checkbox" id="my-collection-toggle" className="hidden peer" />

                {/* <!-- OPEN BUTTON --> */}
                <label htmlFor="my-collection-toggle"
                    className="px-4 py-2 text-sm font-bold text-gray-600 border border-gray-300 rounded-full cursor-pointer ">
                    <span className='pr-1'>+</span> Create New Collection
                </label>

                {/* <!-- OVERLAY --> */}
                <div
                    className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

                    {/* <!-- MODAL CARD --> */}
                    <div
                        className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">

                        {/* <!-- CLOSE BUTTON --> */}
                        <label htmlFor="my-collection-toggle"
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                            ×
                        </label>

                        {/* <!-- HEADER --> */}
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Create New Collection</h2>

                        {/* <!-- FORM --> */}
                        <form className="space-y-5">

                            {/* <!-- Title --> */}
                            <div>
                                <label className="block text-md font-medium text-gray-700 mb-1">Collection name</label>
                                <input type="text" placeholder="Enter"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                            </div>
                            {/* <!-- BUTTONS --> */}
                            <div className="flex justify-center gap-3 pt-2">
                                <label htmlFor="my-collection-toggle"
                                    className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                    Cancel
                                </label>
                                <button type="submit"
                                    className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white cursor-pointer rounded-full hover:bg-blue-700">
                                    Create
                                </button>
                            </div>


                        </form>
                        
                    </div>
                    
                </div>

                {/* pop-up button END */}

            </div>

            
        </div>

    )
}

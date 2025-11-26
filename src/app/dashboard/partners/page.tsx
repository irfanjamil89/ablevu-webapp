"use client";
import { useEffect, useState } from "react";

interface Partner {
    id: string;
    name: string;
    image_url: string;
}

export default function usePartners() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);


    useEffect(() => {
        async function loadPartners() {
            try {
                const res = await fetch("https://staging-api.qtpack.co.uk/partner/list");
                const json = await res.json();
                setPartners(json.items || []);
            } catch (error) {
                console.error("API Error:", error);
            } finally {
                setLoading(false);
            }
        }

        loadPartners();
        console.log(partners);
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
        </div>; // Show loading message while the data is being fetched
    }

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

                            <h1 className="text-2xl font-semibold text-gray-900">All Partners (7)</h1>

                            <div className="flex items-center gap-3">


                                <button onClick={() => setOpenFormModal(true)}
                                    className="px-5 py-2.5 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
                                    Add New Partner
                                </button>


                            </div>
                        </div>
                        <div className="flex justify-start xxl:justify-between flex-wrap gap-2.5 ">

                            {partners.map((partner) => (
                                <div
                                    key={partner.id} // Add unique key here
                                    className="flex border border-gray-200 rounded-xl p-6 shadow-sm w-full md:w-[48%] xl:w-[32.6%] lg:w-[32%] relative"
                                >
                                    
                                    <button onClick={ ()=> setOpenEditModal(true)} className="absolute right-4 top-4 text-sm text-gray-800 underline cursor-pointer font-bold">
                                        Edit
                                    </button>

                                    <div className="flex flex-col items-start">
                                        <img
                                            src={partner.image_url || "/assets/images/HDS_RGB-2048x610.png.svg"}
                                            alt="Logo"
                                            className="h-12 object-contain mb-6"
                                        />
                                        <p className="text-gray-800 font-medium">{partner.name}</p>
                                    </div>
                                </div>
                            ))}



                        </div>
                    </div>

                </div>
            </div>


            {openEditModal && (
                <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

                    <div
                        className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

                        {/* <!-- CLOSE BUTTON --> */}
                        
                        <button onClick={ ()=> setOpenEditModal(false)}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                            ×
                        </button>

                        {/* <!-- HEADER --> */}
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Partner</h2>

                        {/* <!-- FORM --> */}
                        <form className="space-y-6">

                            {/* <!-- Upload Business Logo --> */}
                            <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
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
                                    <img src="/assets/images/HDS_RGB-2048x610.png.svg" alt="upload-icon" className='mt-3' />
                                </div>
                            </div>


                            {/* <!-- Partner Name --> */}
                            <div>
                                <label className="block text-md font-medium text-gray-800 mb-1">Partner Name</label>
                                <input type="text" placeholder="Hidden Disabilities"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200" />
                            </div>

                            {/* <!-- Website Link --> */}
                            <div className="mb-4 relative">
                                {/* Label */}
                                <label className="block text-md font-medium text-gray-800 mb-1">
                                    Website Link
                                </label>

                                {/* Hidden Toggle Checkbox */}
                                <input type="checkbox" id="dropdownToggle" className="hidden peer" />

                                {/* Trigger Button */}
                                <label
                                    htmlFor="dropdownToggle"
                                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
                                >
                                    <span className="truncate">https://hdsunflower.com/</span>
                                </label>

                            </div>


                            <div className="mt-4">


                            </div>


                            {/* <!-- BUTTONS --> */}
                            <div className="flex justify-center gap-3 pt-2">
                                <label htmlFor="Edit-pop-up-toggle"
                                    className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                    Cancel
                                </label>
                                <button type="submit"
                                    className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                    Create City
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {openFormModal && (

                <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

                    <div
                        className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

                        {/* <!-- CLOSE BUTTON --> */}
                        <button onClick={ ()=> setOpenFormModal(false)}
                            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                            ×
                        </button>

                        {/* <!-- HEADER --> */}
                        <h2 className="text-lg font-bold text-gray-700 mb-4">Add Partner</h2>

                        {/* <!-- FORM --> */}
                        <form className="space-y-6">

                            {/* <!-- Upload Business Logo --> */}
                            <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
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


                            {/* <!-- Partner Name --> */}
                            <div>
                                <label className="block text-md font-medium text-gray-800 mb-1">Partner Name</label>
                                <input type="text" placeholder="AbleVu"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200" />
                            </div>

                            {/* <!-- Website Link --> */}
                            <div className="mb-4 relative">
                                {/* Label */}
                                <label className="block text-md font-medium text-gray-800 mb-1">
                                    Website Link
                                </label>

                                {/* Hidden Toggle Checkbox */}
                                <input type="checkbox" id="dropdownToggle" className="hidden peer" />

                                {/* Trigger Button */}
                                <label
                                    htmlFor="dropdownToggle"
                                    className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
                                >
                                    <span className="truncate">https://website.com</span>
                                </label>

                            </div>


                            <div className="mt-4">


                            </div>


                            {/* <!-- BUTTONS --> */}
                            <div className="flex justify-center gap-3 pt-2">
                                <label htmlFor="Partner-toggle"
                                    className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                    Cancel
                                </label>
                                <button type="submit"
                                    className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                    Create City
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )
            }
        </div>

    )
}

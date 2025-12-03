"use client";
import PartnerEditModal from "@/app/component/PartnerEditModal";
import PartnerForm from "@/app/component/PartnerForm";
import { useEffect, useState } from "react";
import axios from "axios";


interface Partner {
    id: string;
    name: string;
    image_url: string;
    web_url: string;
}

export default function Page() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openFormModal, setOpenFormModal] = useState(false);
    const [OpenDeleteModal, setOpenDeleteModal] = useState(false);
    const [OpenSuccessModal, setOpenSuccessModal] = useState(false);

    const [selectedPartnerId, setSelectedPartnerId] = useState("");
    const [selectedPartnerName, setSelectedPartnerName] = useState("");
    const [selectedPartnerWebsite, setSelectedPartnerWebsite] = useState("");

    const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);



    async function loadPartners() {
        try {
            const res = await fetch("https://staging-api.qtpack.co.uk/partner/list?page=1&limit=1000");
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


    if (loading) {
        return <div className="flex justify-center w-full items-center h-[400px]">
            <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
        </div>;
    }

    return (

        <div className="w-full h-screen ">
            <div
                className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">

                    {/* <!-- Header Row --> */}
                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* <!-- Header --> */}
                        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
                            {/* <!-- Title --> */}

                            <h1 className="text-2xl font-semibold text-gray-900">All Partners ({partners.length})</h1>

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
                                    <div className="absolute right-4 top-4 flex items-center gap-3">

                                        <button
                                            onClick={() => {
                                                setSelectedPartnerId(partner.id);
                                                setSelectedPartnerName(partner.name);
                                                setSelectedPartnerWebsite(partner.web_url);
                                                setOpenEditModal(true);
                                            }}
                                            className="text-sm text-gray-800 underline cursor-pointer font-bold hover:text-blue-600">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPartnerToDelete(partner.id);
                                                setOpenDeleteModal(true);
                                            }}
                                            className="text-red-600 hover:text-red-700 cursor-pointer"
                                            title="Delete Partner"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

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
                <PartnerEditModal
                    setOpenEditModal={setOpenEditModal}
                    partnerId={selectedPartnerId}
                    partnerName={selectedPartnerName}
                    partnerWebsite={selectedPartnerWebsite}
                />
            )}
            {openFormModal && (

                <PartnerForm setOpenFormModal={setOpenFormModal} />
            )
            }

            {/* Delete Confirmation Modal */}
            {OpenDeleteModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="bg-red-600 rounded-full p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>

                        {/* Modal content */}
                        <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this partner?</p>

                        {/* Buttons */}
                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
                                onClick={() => {
                                    setOpenDeleteModal(false);
                                    setPartnerToDelete(null);
                                }}
                                disabled={loadingDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-5 py-2 w-full text-center text-sm font-bold bg-red-600 text-white rounded-full cursor-pointer hover:bg-red-700 disabled:opacity-50"
                                onClick={async () => {
                                    if (!partnerToDelete) return;
                                    setLoadingDelete(true);
                                    try {
                                        await axios.delete(
                                            `https://staging-api.qtpack.co.uk/partner/delete/${partnerToDelete}`,
                                            {
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                                                },
                                            }
                                        );
                                        setOpenDeleteModal(false);
                                        setPartnerToDelete(null);
                                        loadPartners();
                                        setOpenSuccessModal(true); // show success modal
                                    } catch (error) {
                                        console.error("Delete error:", error);
                                        alert("Failed to delete partner.");
                                    } finally {
                                        setLoadingDelete(false);
                                    }
                                }}
                                disabled={loadingDelete}
                            >
                                {loadingDelete ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {OpenSuccessModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
                        <div className="flex justify-center mb-4">
                            <div className="bg-[#0519CE] rounded-full p-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold mb-2">Deleted Successfully!</h2>
                        <p className="mb-4">The partner has been removed.</p>
                        <button
                            className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                            onClick={() => setOpenSuccessModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </div>

    )
}

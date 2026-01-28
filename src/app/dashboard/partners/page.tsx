"use client";
import PartnerEditModal from "@/app/component/PartnerEditModal";
import PartnerForm from "@/app/component/PartnerForm";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Image from "next/image"; // ✅ Use Next.js Image component

interface Partner {
    id: string;
    name: string;
    image_url: string;
    web_url: string;
}

// ✅ Loading Skeleton Component
const PartnerSkeleton = () => (
    <div className="flex border border-gray-200 rounded-xl p-6 shadow-sm w-full md:w-[48%] xl:w-[32.6%] lg:w-[32%] animate-pulse">
        <div className="flex flex-col items-start w-full">
            <div className="h-12 w-32 bg-gray-300 rounded mb-6"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
    </div>
);

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
    const [selectedPartnerImage, setselectedPartnerImage] = useState("");

    const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);
    const [loadingDelete, setLoadingDelete] = useState(false);

    // ✅ Optimized: Reduced limit from 1000 to 50 (you only have 7)
    const loadPartners = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}partner/list?page=1&limit=50`,
                {
                    // ✅ Add cache control
                    next: { revalidate: 60 }, // Cache for 60 seconds
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch partners");
            }

            const json = await res.json();
            setPartners(json.items || []);
        } catch (error) {
            console.error("API Error:", error);
            setPartners([]); // ✅ Set empty array on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadPartners();
    }, [loadPartners]);

    // ✅ Optimized delete handler
    const handleDeletePartner = async () => {
        if (!partnerToDelete) return;

        setLoadingDelete(true);
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem("access_token") : null;

            if (!token) {
                alert("Authentication required. Please log in.");
                setLoadingDelete(false);
                return;
            }

            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}partner/delete/${partnerToDelete}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // ✅ Optimistically update UI instead of refetching
            setPartners(prev => prev.filter(p => p.id !== partnerToDelete));
            
            setOpenDeleteModal(false);
            setPartnerToDelete(null);
            setOpenSuccessModal(true);

        } catch (error: any) {
            console.error("Delete error:", error);
            const errorMessage = error.response?.data?.message || "Failed to delete partner.";
            alert(errorMessage);
            
            // ✅ Reload only if delete failed
            await loadPartners();
        } finally {
            setLoadingDelete(false);
        }
    };

    return (
        <div className="w-full h-screen">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">
                    <div className="w-full min-h-screen bg-white px-6 py-5">

                        {/* Header */}
                        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Partners ({partners.length})
                            </h1>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setOpenFormModal(true)}
                                    className="px-5 py-2.5 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition"
                                >
                                    Add New Partner
                                </button>
                            </div>
                        </div>

                        {/* ✅ Loading State with Skeletons */}
                        {loading ? (
                            <div className="flex justify-start xxl:justify-between flex-wrap gap-2.5">
                                <PartnerSkeleton />
                                <PartnerSkeleton />
                                <PartnerSkeleton />
                            </div>
                        ) : (
                            /* Partners Grid */
                            <div className="flex justify-start xxl:justify-between flex-wrap gap-2.5">
                                {partners.length === 0 ? (
                                    <div className="w-full text-center py-10">
                                        <p className="text-gray-500">No partners found. Add your first partner!</p>
                                    </div>
                                ) : (
                                    partners.map((partner) => (
                                        <div
                                            key={partner.id}
                                            className="flex border border-gray-200 rounded-xl p-6 shadow-sm w-full md:w-[48%] xl:w-[32.6%] lg:w-[32%] relative"
                                        >
                                            <div className="absolute right-4 top-4 flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPartnerId(partner.id);
                                                        setSelectedPartnerName(partner.name);
                                                        setSelectedPartnerWebsite(partner.web_url);
                                                        setselectedPartnerImage(partner.image_url);
                                                        setOpenEditModal(true);
                                                    }}
                                                    className="text-sm text-gray-800 underline cursor-pointer font-bold hover:text-blue-600"
                                                >
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
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex flex-col items-start">
                                                {/* ✅ Optimized image with lazy loading */}
                                                <img
                                                    src={partner.image_url}
                                                    alt={`${partner.name} logo`}
                                                    className="h-12 object-contain mb-6"
                                                    loading="lazy" // ✅ Native lazy loading
                                                    onError={(e) => {
                                                        e.currentTarget.src = "/assets/images/HDS_RGB-2048x610.png";
                                                    }}
                                                />
                                                <p className="text-gray-800 font-medium">{partner.name}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {openEditModal && (
                <PartnerEditModal
                    setOpenEditModal={setOpenEditModal}
                    partnerId={selectedPartnerId}
                    partnerName={selectedPartnerName}
                    partnerWebsite={selectedPartnerWebsite}
                    PartnerImage={selectedPartnerImage}
                />
            )}

            {/* Add Partner Form Modal */}
            {openFormModal && (
                <PartnerForm 
                    setOpenFormModal={setOpenFormModal} 
                    onPartnerCreated={loadPartners}
                />
            )}

            {/* Delete Confirmation Modal */}
            {OpenDeleteModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
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

                        <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this partner?</p>

                        <div className="flex justify-center gap-3 pt-2">
                            <button
                                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50"
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
                                onClick={handleDeletePartner}
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
    );
}
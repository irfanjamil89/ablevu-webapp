"use client";

import React, { useState, useEffect } from 'react'

// Interface definitions
interface Coupon {
    id: string;
    code: string;
    name: string;
    validitymonths: number;
    discount: string;
    active: boolean;
}

interface CouponFormData {
    name: string;
    code: string;
    discount: string;
    validitymonths: string;
}

interface CouponListResponse {
    data: Coupon[];
    total: number;
    page: number;
    limit: number;
    totalPage: number;
}

interface ApiErrorResponse {
    success?: boolean;
    message: string;
    error?: string;
}

export default function Page() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");
    const [formData, setFormData] = useState<CouponFormData>({
        name: '',
        code: '',
        discount: '',
        validitymonths: ''
    });
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);
    const [selectedCouponid, setselectedCouponid] = useState("");


    // Fetch coupons on component mount
    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async (): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/list`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: CouponListResponse = await response.json();

            if (data.data && Array.isArray(data.data)) {
                setCoupons(data.data);
            } else {
                setCoupons([]);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
            setError('Failed to fetch coupons. Please try again.');
            setCoupons([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };



    const handleSubmit = async (): Promise<void> => {

        try {
            setSubmitting(true);

            const requestBody = {
                code: formData.code.trim(),
                name: formData.name.trim(),
                validitymonths: formData.validitymonths,
                discount: formData.discount,
                active: true
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify(requestBody)
            });

            if (response.status === 201 || response.status === 200) {
                setSuccess("Coupon created successfully!");
                setFormData({ name: '', code: '', discount: '', validitymonths: '' });
                // setIsModalOpen(false);
                await fetchCoupons();
            } else {
                const result: ApiErrorResponse = await response.json();
                const errorMsg = result.message || 'Failed to create coupon';
                setError(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error creating coupon:', error);
            setError('Failed to create coupon. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (couponId: string): Promise<void> => {
        
        

        console.log(couponId);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/delete/${couponId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            });

            if (response.status === 201 || response.status === 200) {
                setOpenDeleteModal(false);
                setOpenSuccessModal(true);
                await fetchCoupons();
            } else {
                const result: ApiErrorResponse = await response.json();
                const errorMsg = result.message || 'Failed to delete coupon';
                setError(`Error: ${errorMsg}`);
            }
        } catch (error) {
            console.error('Error deleting coupon:', error);
            setError('Failed to delete coupon. Please check your connection and try again.');
        }
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
        setFormData({ name: '', code: '', discount: '', validitymonths: '' });
    };

    if (loading) {
        return <div className="flex justify-center w-full items-center h-[400px]">
            <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
        </div>;
    }

    return (
        <div className="w-full h-screen overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 bg-white">
                <div className="w-full min-h-screen bg-white">
                    <div className="w-full min-h-screen bg-white px-6 py-5">
                        {/* Header */}
                        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                All Coupon Codes ({coupons.length})
                            </h1>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="px-5 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition"
                                    disabled={submitting}>
                                    Generate Code
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Modal */}
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[450px] p-7 relative">
                                    <button
                                        onClick={closeModal}
                                        className="absolute top-7 right-8 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                                        disabled={submitting}>
                                        ×
                                    </button>

                                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Coupon Code</h2>

                                    {error && (
                                        <div className="mb-4 text-red-700">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="mb-4  rounded-lg text-green-700">
                                            {success}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-md font-medium text-gray-700 mb-2">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="Enter coupon name"
                                                disabled={submitting}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:hover:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-md font-medium text-gray-700 mb-1">
                                                Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="code"
                                                value={formData.code}
                                                onChange={handleInputChange}
                                                placeholder="Enter coupon code"
                                                disabled={submitting}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:hover:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        <div className="flex flex-2 gap-2">
                                            <div className="flex flex-col justify-between">
                                                <label className="block text-md font-medium text-gray-700 mb-2">
                                                    Discount Percentage <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="discount"
                                                    value={formData.discount}
                                                    onChange={handleInputChange}
                                                    placeholder="25.5"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    disabled={submitting}
                                                    className="placeholder:text-gray-500 placeholder:ms-2 mt-1 p-2 w-[194px] border border-gray-300 rounded-lg focus:outline-none focus:hover:border-0 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                            </div>

                                            <div className="flex flex-col justify-between">
                                                <label className="w-full text-md font-medium text-gray-700 mb-1">
                                                    Validity in Months <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="validitymonths"
                                                    value={formData.validitymonths}
                                                    onChange={handleInputChange}
                                                    placeholder="3"
                                                    min="1"
                                                    step="1"
                                                    disabled={submitting}
                                                    className="placeholder:text-gray-500 placeholder:ms-2 mt-1 p-2 w-[194px] border border-gray-300 rounded-lg focus:outline-none focus:hover:border-0 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-3 pt-2">
                                            <button
                                                onClick={closeModal}
                                                disabled={submitting}
                                                className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                                className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                                {submitting ? 'Creating...' : 'Generate Code'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Table */}
                        <div className="w-full bg-white">
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0519CE]"></div>
                                        <p className="mt-2">Loading coupons...</p>
                                    </div>
                                ) : coupons.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <p className="text-lg">No coupons found</p>
                                        <p className="text-sm mt-2">Click &quot;Generate Code&quot; to create your first coupon</p>
                                    </div>
                                ) : (
                                    <table className="min-w-full table-auto">
                                        <tbody className="space-y-3">
                                            {coupons.map((coupon: Coupon) => (
                                                <tr key={coupon.id} className="border rounded-lg border-gray-200 justify-between flex flex-row items-center mb-3">
                                                    <td className="px-4 py-3 flex items-center gap-2 font-semibold min-w-[200px]">
                                                        {coupon.name}
                                                    </td>
                                                    <td className="px-2 py-3 font-mono text-sm bg-gray-50 rounded">
                                                        {coupon.code}
                                                    </td>
                                                    <td className="px-4 py-3 w-[150px] text-gray-600">
                                                        {coupon.validitymonths} {Number(coupon.validitymonths) === 1 ? 'month' : 'months'}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="flex items-center gap-1">
                                                            Discount: <span className="font-semibold text-green-600">{coupon.discount}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 flex gap-3">
                                                        <button
                                                            onClick={() => {setOpenDeleteModal(true), setselectedCouponid(coupon.id)}}
                                                            className="hover:scale-110 transition-transform"
                                                            title="Delete coupon">
                                                            <img src="/assets/images/delete-svgrepo-com.svg" alt="Delete" className="w-8 h-8 cursor-pointer" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {openDeleteModal && (
                <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8">
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
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-lg font-bold mb-2 text-gray-800">Delete Coupon Code?</h2>
                        <p className="mb-4 text-gray-600">This action cannot be undone.</p>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setOpenDeleteModal(false)}
                                className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={ ()=> handleDelete(selectedCouponid)}
                                className="px-5 py-2 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {openSuccessModal && (
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
                        <p className="mb-4">The Coupon Code has been removed.</p>
                        <button
                            className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
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
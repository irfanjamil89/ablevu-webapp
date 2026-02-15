"use client";

import React, { useState, useEffect } from "react";

<style jsx global>{`
  .animate-fadeIn {
    animation: fadeIn 0.2s ease-in-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>;

// Interface definitions
interface Coupon {
  id: string;
  code: string;
  name: string;
  discount_type?: "percentage" | "fixed";
  discount: string;
  expires_at?: string | null;
  usage_limit?: number | null;
  used_count?: number;
  active: boolean;
}

interface CouponFormData {
  name: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount: string;
  expires_at: string; // yyyy-mm-dd
  usage_limit: string; // number as string
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
    name: "",
    code: "",
    discount_type: "percentage",
    discount: "",
    expires_at: "",
    usage_limit: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [selectedCouponid, setselectedCouponid] = useState("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);

  useEffect(() => {
    fetchCoupons();
  }, [page]);

  const fetchCoupons = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/list?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CouponListResponse = await response.json();

      setCoupons(data.data || []);
      setTotalPage(data.totalPage || 1);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setError("Failed to fetch coupons. Please try again.");
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess("");

      const requestBody: any = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        discount_type: formData.discount_type,
        discount: formData.discount,
        active: true,
      };

      if (formData.expires_at) {
        requestBody.expires_at = new Date(formData.expires_at).toISOString();
      }

      if (formData.usage_limit !== "") {
        requestBody.usage_limit = Number(formData.usage_limit);
      }

      // ✅ FIXED DISCOUNT -> always USD
      if (formData.discount_type === "fixed") {
        requestBody.currency = "usd";
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess("Coupon created successfully!");
        setFormData({
          name: "",
          code: "",
          discount_type: "percentage",
          discount: "",
          expires_at: "",
          usage_limit: "",
        });
        await fetchCoupons();
      } else {
        const result: ApiErrorResponse = await response.json();
        const errorMsg = result.message || "Failed to create coupon";
        setError(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      setError(
        "Failed to create coupon. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (couponId: string): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}coupons/delete/${couponId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setOpenDeleteModal(false);
        setOpenSuccessModal(true);
        await fetchCoupons();
      } else {
        const result: ApiErrorResponse = await response.json();
        const errorMsg = result.message || "Failed to delete coupon";
        setError(`Error: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setError(
        "Failed to delete coupon. Please check your connection and try again."
      );
    }
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setError(null);
    setSuccess("");
    setFormData({
      name: "",
      code: "",
      discount_type: "percentage",
      discount: "",
      expires_at: "",
      usage_limit: "",
    });
  };

  const discountLabel =
    formData.discount_type === "percentage"
      ? "Discount Percentage"
      : "Discount Amount";

  if (loading && coupons.length === 0) {
    return (
      <div className="flex justify-center w-full items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full px-6 py-5">
        {/* Header */}
        <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Coupon Codes ({coupons.length})
          </h1>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition"
              disabled={submitting}
            >
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
            <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-8 relative animate-fadeIn">
              <button
                onClick={closeModal}
                className="absolute top-7 right-8 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
                disabled={submitting}
              >
                ×
              </button>

              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Add Coupon Code
              </h2>

              {error && <div className="mb-4 text-red-700">{error}</div>}
              {success && (
                <div className="mb-4 rounded-lg text-green-700">{success}</div>
              )}

              <div className="space-y-4">
                {/* Name */}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Code */}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="discount_type"
                    value={formData.discount_type}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                {/* Discount + Usage Limit */}
                <div className="flex flex-2 gap-2">
                  <div className="flex flex-col justify-between w-full">
                    <label className="block text-md font-medium text-gray-700 mb-2">
                      {discountLabel} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder={
                        formData.discount_type === "percentage" ? "25" : "20"
                      }
                      min="0"
                      max={
                        formData.discount_type === "percentage"
                          ? "100"
                          : undefined
                      }
                      step="0.1"
                      disabled={submitting}
                      className="placeholder:text-gray-500 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex flex-col justify-between w-full">
                    <label className="w-full text-md font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      name="usage_limit"
                      value={formData.usage_limit}
                      onChange={handleInputChange}
                      placeholder="50"
                      min="0"
                      step="1"
                      disabled={submitting}
                      className="placeholder:text-gray-500 mt-1 p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Expires At */}
                <div>
                  <label className="block text-md font-medium text-gray-700 mb-2">
                    Expires At
                  </label>
                  <input
                    type="date"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    disabled={submitting}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank for no expiration.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={closeModal}
                    disabled={submitting}
                    className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Creating..." : "Generate Code"}
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
                <p className="text-sm mt-2">
                  Click &quot;Generate Code&quot; to create your first coupon
                </p>
              </div>
            ) : (
              <table className="min-w-full table-auto">
                <tbody className="space-y-3">
                  {coupons.map((coupon: Coupon) => (
                    <div
                      key={coupon.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-4 mb-4 hover:shadow-md transition"
                    >
                      <div className="grid grid-cols-7 items-center gap-4 text-sm">
                        {/* Name */}
                        <div className="font-semibold text-gray-800">
                          {coupon.name}
                        </div>

                        {/* Code */}
                        <div className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-center">
                          {coupon.code}
                        </div>

                        {/* Type */}
                        <div className="text-gray-600 capitalize">
                          {coupon.discount_type || "percentage"}
                        </div>

                        {/* Discount */}
                        <div>
                          <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold
          ${
            coupon.discount_type === "fixed"
              ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700"
          }`}
                          >
                            {Number(coupon.discount).toFixed(2)}
                            {coupon.discount_type === "fixed" ? " USD" : "%"}
                          </span>
                        </div>

                        {/* Expiry */}
                        <div className="text-gray-600">
                          {coupon.expires_at
                            ? new Date(coupon.expires_at).toLocaleDateString()
                            : "No expiry"}
                        </div>

                        {/* Usage */}
                        <div className="text-gray-600">
                          {coupon.usage_limit ?? "—"} / {coupon.used_count ?? 0}
                        </div>

                        {/* Status + Delete */}
                        <div className="flex items-center justify-end gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
          ${
            coupon.active
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
                          >
                            {coupon.active ? "Active" : "Inactive"}
                          </span>

                          <button
                            onClick={() => {
                              setOpenDeleteModal(true);
                              setselectedCouponid(coupon.id);
                            }}
                            className="text-red-500 hover:scale-110 transition"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-6 px-2 pb-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-6 py-3 text-sm font-medium bg-white text-gray-400 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPage }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => setPage(pageNum)}
              className={`min-w-[48px] h-[48px] text-sm font-medium rounded-lg transition ${
                page === pageNum
                  ? "bg-[#0519CE] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={page === totalPage}
            className="px-6 py-3 text-sm font-medium bg-white text-gray-700 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete modal */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Delete Coupon Code?
            </h2>
            <p className="mb-4 text-gray-600">This action cannot be undone.</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setOpenDeleteModal(false)}
                className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(selectedCouponid)}
                className="px-5 py-2 w-full bg-red-600 text-white rounded-full hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success modal */}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
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
  );
}
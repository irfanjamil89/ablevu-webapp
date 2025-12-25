"use client";

import React, { useEffect, useState } from "react";

export type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
};

interface WriteReviewsPopupProps {
  businessId: string;
  setOpenWriteReviewsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  // 🔹 ab sirf callback, koi param nahi
  onUpdated?: () => void;
}

// ---------- API TYPES ----------
type ReviewType = {
  id: string;
  title: string;
  image_url?: string | null;
  active: boolean;
};

// ---------- COMPONENT ----------
const WriteReviewsPopup: React.FC<WriteReviewsPopupProps> = ({
  businessId,
  setOpenWriteReviewsPopup,
  onUpdated,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [reviewTypes, setReviewTypes] = useState<ReviewType[]>([]);
  const [selectedReviewTypeId, setSelectedReviewTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Fetch Review Types ----------
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        if (!API_BASE_URL) {
          setError("API base URL is not configured.");
          return;
        }

        setLoadingTypes(true);
        setError(null);

        const res = await fetch(
          `${API_BASE_URL}/review-type/list?limit=100&page=1`
        );

        if (!res.ok) throw new Error("Failed to load review types");

        const data = await res.json();
        

        setReviewTypes(data.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load review types");
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [API_BASE_URL]);

  // ---------- Handle File Upload ----------
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (uploaded) {
      setFile(uploaded);
      setFilePreview(URL.createObjectURL(uploaded));
    }
  };

  // ---------- Submit Review ----------
  const handleSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();

    if (!selectedReviewTypeId || !description.trim()) {
      setError("Review type and description are required.");
      return;
    }

    if (!API_BASE_URL) {
      setError("API base URL is not configured.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      setError("You must be logged in to submit a review.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        business_id: businessId,
        review_type_id: selectedReviewTypeId,
        description: description.trim(),
        active: true,
      };

      const res = await fetch(`${API_BASE_URL}/business-reviews/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = "Failed to submit review";
        try {
          const errBody = await res.json();
          if (errBody?.message) {
            errMsg = Array.isArray(errBody.message)
              ? errBody.message.join(", ")
              : errBody.message;
          }
        } catch {
          // ignore JSON parse error, keep default errMsg
        }
        throw new Error(errMsg);
      }

      const responseData = await res.json();
      

      // 🔹 Ab sirf parent ko bol rahe hain: "refresh kar lo"
      onUpdated?.();

      // Reset form (optional)
      setSelectedReviewTypeId("");
      setDescription("");
      setFile(null);
      setFilePreview(null);

      setOpenWriteReviewsPopup(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to submit review");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">
        {/* CLOSE BUTTON */}
        <label
          onClick={() => setOpenWriteReviewsPopup(false)}
          className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </label>

        <h2 className="text-md font-semibold text-gray-900 mb-1">
          Write Review
        </h2>
        <p className="text-gray-700 text-md mb-4">
          Your feedback helps improve accessibility.
        </p>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">
            {error}
          </p>
        )}

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Review Type */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              What went well?
            </label>

            <select
              value={selectedReviewTypeId}
              onChange={(e) => setSelectedReviewTypeId(e.target.value)}
              disabled={loadingTypes}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"
            >
              <option value="">
                {loadingTypes ? "Loading..." : "Select Review Type"}
              </option>

              {reviewTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              What do you like about this business?
            </label>
            <textarea
              rows={5}
              placeholder="Enter comments..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"
            />
          </div>

          {/* Upload Picture */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Upload Picture
            </label>

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onFileChange}
              />

              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <>
                    <img
                      src="/assets/images/upload-icon.avif"
                      className="w-10 h-10"
                    />
                    <p className="text-[#0519CE] font-semibold text-sm">
                      Click to upload{" "}
                      <span className="text-gray-500 text-xs">
                        or drag & drop
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 pt-2">
            <label
              onClick={() => setOpenWriteReviewsPopup(false)}
              className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </label>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Submitting..." : "Submit to business"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewsPopup;

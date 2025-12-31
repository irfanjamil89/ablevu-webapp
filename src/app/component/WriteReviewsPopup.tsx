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
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);


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
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (selectedImages.length >= 3) {
      setError("You can upload a maximum of 3 images");
      return;
    }

    const validTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
    ];

    const remainingSlots = 3 - selectedImages.length;
    const allowedFiles = files.slice(0, remainingSlots);

    for (const file of allowedFiles) {
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (SVG, PNG, JPG, or GIF)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Each image size should be less than 5MB");
        return;
      }
    }

    setError("");

    const newPreviews: string[] = [];

    allowedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);

        if (newPreviews.length === allowedFiles.length) {
          setSelectedImages((prev) => [...prev, ...allowedFiles]);
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };


  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
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
      const result = await res.json();
      if (res.ok) {
        const createdReviewId = result.id;
        if (selectedImages.length > 0 && createdReviewId) {
          Promise.all(selectedImages.map(img => convertToBase64(img)))
            .then((base64Images) => {
              fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64-multiple`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    images: base64Images,
                    folder: "business-reviews",
                    fileName: createdReviewId,
                  }),
                }
              ).catch((err) => {
                console.error("Image upload failed", err);
              });
            })
            .catch((err) => {
              console.error("Network error comes", err);
            });
        }
      }
      // 🔹 Ab sirf parent ko bol rahe hain: "refresh kar lo"
      onUpdated?.();
      // Reset form (optional)
      setSelectedReviewTypeId("");
      setDescription("");
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
              Upload Pictures
            </label>

            {/* Upload Box */}
            <div className="relative mb-3">
              <input
                type="file"
                accept=".svg,.png,.jpg,.gif"
                multiple
                disabled={selectedImages.length >= 3}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageSelect}
              />
              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
                <p className="text-[#0519CE] font-semibold text-sm">
                  Click to upload <span className="text-gray-500 text-xs">or drag and drop</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
              </div>
            </div>
          </div>
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img
                    src={preview}
                    className="w-full h-full object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
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

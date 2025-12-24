"use client";
import React, { useState } from "react";
import axios from "axios";

interface PartnerFormProps {
  setOpenFormModal: React.Dispatch<React.SetStateAction<boolean>>;
  onPartnerCreated?: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({ setOpenFormModal, onPartnerCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    web_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Handle image selection and preview
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (SVG, PNG, JPG, or GIF)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
      setError("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  // Convert image to base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload image with partner ID
  const uploadImage = async (partnerId: string, imageFile: File) => {
    try {
      const base64Data = await convertToBase64(imageFile);

      const imagePayload = {
        data: base64Data,
        folder: "partner",
        fileName: partnerId,
      };

      const imageResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`,
        imagePayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      return imageResponse.data.url || imageResponse.data.imageUrl || imageResponse.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to upload image");
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Step 1: Create partner
      const partnerPayload = {
        name: form.name,
        web_url: form.web_url,
      };

      const partnerResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}partner/create/`,
        partnerPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (partnerResponse.status !== 201 && partnerResponse.status !== 200) {
        throw new Error(partnerResponse.data?.message || "Failed to create partner");
      }

      const partnerId = partnerResponse.data.id || partnerResponse.data.partner_id;

      if (!partnerId) {
        throw new Error("Partner ID not received from server");
      }

      // Step 2: Upload image if selected (using the partnerId)
      if (selectedImage) {
        await uploadImage(partnerId, selectedImage);
      }

      setSuccess("Partner added successfully!");

      if (onPartnerCreated) {
        onPartnerCreated();

      }
      setOpenFormModal(false);

      // Reset form
      setForm({
        name: "",
        web_url: "",
      });
      setSelectedImage(null);
      setImagePreview("");

      // Close modal after 2 seconds
      
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpenFormModal(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* HEADER */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">Add Partner</h2>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Business Logo */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Upload Logo
            </label>
            <div className="relative">
              {!imagePreview ? (
                <>
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.gif"
                    onChange={handleImageSelect}
                    disabled={loading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                    <img
                      src="/assets/images/upload-icon.avif"
                      alt="upload-icon"
                      className="w-10 h-10"
                    />
                    <p className="text-[#0519CE] font-semibold text-sm">
                      Click to upload{" "}
                      <span className="text-gray-500 text-xs">or drag and drop</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      SVG, PNG, JPG or GIF (max. 800×400px)
                    </p>
                  </div>
                </>
              ) : (
                <div className="relative border border-gray-200 rounded-lg p-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {selectedImage?.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Partner Name */}
          <div>
            <label className="block text-md font-medium text-gray-800 mb-1">
              Partner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="AbleVu"
              id="name"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              required
              maxLength={250}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Website URL */}
          <div>
            <label className="block text-md font-medium text-gray-800 mb-1">
              Website URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              placeholder="https://website.com"
              id="web_url"
              value={form.web_url}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-red-700 flex-1">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <svg
                className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-green-700 flex-1">{success}</p>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenFormModal(false)}
              disabled={loading}
              className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </>
              ) : (
                "Create Partner"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;
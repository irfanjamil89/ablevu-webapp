"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import GoogleAddressInput from "@/app/component/GoogleAddressInput";
import Cropper from "react-easy-crop";
import { jwtDecode } from "jwt-decode";

// ---------- Types ----------

type NewBusinessForm = {
  name: string;
  fullAddress: string;
  description: string;
  place_id?: string;
  latitude?: number;
  longitude?: number;
  city: string;
  state: string;
  country: string;
  zipcode: string;
};

type BusinessType = {
  id: string;
  name: string;
};

type PlanKey = "monthly" | "yearly";

type UserTypeKey = "Admin" | "Contributor" | "Business";

// ✅ REMOVED: getUserTypeFromToken — was dead code, role is fetched via API

// ---------- Address helper ----------
function extractAddressParts(result: { address_components?: any[] }) {
  const components = result.address_components || [];

  const find = (type: string) =>
    components.find((c: any) => c.types.includes(type))?.long_name || "";

  const city =
    find("locality") ||
    find("postal_town") ||
    find("sublocality") ||
    find("administrative_area_level_2");

  const state = find("administrative_area_level_1");
  const country = find("country");
  const zipcode = find("postal_code");

  return { city, state, country, zipcode };
}

// ---------- File to base64 ----------
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ✅ FIX: Use actual file mime type instead of hardcoded image/jpeg
const toDataUri = (rawBase64: string, mimeType = "image/jpeg") => {
  if (rawBase64.startsWith("data:image")) return rawBase64;
  return `data:${mimeType};base64,${rawBase64}`;
};

// ✅ Moved outside component — pure utils, no need to recreate on every render
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
  fileName: string
): Promise<File> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("No 2d context");

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], fileName || "cropped.jpg", {
            type: "image/jpeg",
          });
          resolve(file);
        }
      },
      "image/jpeg",
      0.9
    );
  });
};// ---------- Component ----------
interface AddBusinessProps {
  setOpenAddBusinessModal: React.Dispatch<React.SetStateAction<boolean>>;
  onBusinessCreated: () => void;
  showSuccessPopup?: boolean;
}

export default function AddBusinessModal({
  setOpenAddBusinessModal,
  onBusinessCreated,
  showSuccessPopup = false,
}: AddBusinessProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [businessTypesError, setBusinessTypesError] = useState(false); // ✅ surface fetch failure
  const [newBusiness, setNewBusiness] = useState<NewBusinessForm>({
    name: "",
    fullAddress: "",
    description: "",
    place_id: undefined,
    latitude: undefined,
    longitude: undefined,
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  // ✅ Cache base64 after crop so checkout doesn't recompute it
  const preComputedBase64Ref = useRef<string | null>(null);
  const preComputedMimeRef = useRef<string>("image/jpeg");

  const isBypassRole = (role?: string | null) =>
    role === "Admin" || role === "Contributor";

  function getUserIdFromToken(token: string): string | null {
    try {
      const payload: any = jwtDecode(token);
      return payload?.id || payload?.user_id || payload?.sub || null;
    } catch {
      return null;
    }
  }

  // ✅ Toggle category
  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const removeCategory = (id: string) => {
    setSelectedCategoryIds((prev) => prev.filter((c) => c !== id));
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(e.target as Node)
      ) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Fetch user role
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("access_token"); // ✅ no typeof window guard needed in client component
      if (!token) return;

      const userId = getUserIdFromToken(token);
      if (!userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}users/me/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json().catch(() => ({}));
        setUserRole(res.ok ? data?.user_role || null : null);
      } catch {
        setUserRole(null);
      }
    })();
  }, []);

  // ✅ Fetch business types — surface error to user
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    fetch(base + "business-type/list?page=1&limit=1000")
      .then((res) => res.json())
      .then((data) => setBusinessTypes(data.data || []))
      .catch((err) => {
        console.error("Error fetching business types:", err);
        setBusinessTypesError(true);
      });
  }, []);

  // ✅ Pure async — does NOT manage isCreating (caller owns that)
  const createBusinessDirect = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("You must be logged in.");

    const dto = {
      name: newBusiness.name.trim(),
      business_type: selectedCategoryIds,
      description: newBusiness.description || "",
      address: newBusiness.fullAddress,
      place_id: newBusiness.place_id,
      latitude: newBusiness.latitude,
      longitude: newBusiness.longitude,
      city: newBusiness.city || "",
      state: newBusiness.state || "",
      country: newBusiness.country || "",
      zipcode: newBusiness.zipcode || "",
      active: true,
      business_status: "draft",
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}business/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Business create failed");

    const businessId = data?.id;
    if (!businessId) throw new Error("Business created but id missing in response");

    if (selectedImage) {
      // ✅ Use pre-computed base64 if available, otherwise compute now
      const rawBase64 =
        preComputedBase64Ref.current ?? (await fileToBase64(selectedImage));
      const mimeType = preComputedMimeRef.current;

      const imageUploadPayload = {
        data: toDataUri(rawBase64, mimeType),
        folder: "business",
        fileName: businessId,
      };

      const imageRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}images/upload-base64`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(imageUploadPayload),
        }
      );

      if (!imageRes.ok) {
        const imageError = await imageRes.json().catch(() => ({}));
        throw new Error(imageError?.message || "Failed to upload image");
      }
    }

    return selectedImage
      ? "Business and logo uploaded successfully!"
      : "Business created successfully!";
  };

  const getPriceIdByPlan = (plan: PlanKey) => {
    if (plan === "monthly")
      return process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "";
    if (plan === "yearly")
      return process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "";
    return "";
  };

  // ✅ Pure async — does NOT manage isCreating (caller owns that)
  const startSubscriptionCheckout = async (plan: PlanKey) => {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("You must be logged in.");

    const priceId = getPriceIdByPlan(plan);
    if (!priceId) throw new Error("Stripe price id missing.");

    const businessDraftPayload = {
      name: newBusiness.name.trim(),
      business_type: selectedCategoryIds,
      description: newBusiness.description || "",
      address: newBusiness.fullAddress,
      place_id: newBusiness.place_id,
      latitude: newBusiness.latitude,
      longitude: newBusiness.longitude,
      city: newBusiness.city || "",
      state: newBusiness.state || "",
      country: newBusiness.country || "",
      zipcode: newBusiness.zipcode || "",
      active: false,
      business_status: "draft",
      subscription_plan: plan,
    };

    // ✅ Use pre-computed base64 — no FileReader delay at checkout time
    const businessImageBase64 = preComputedBase64Ref.current ?? null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}subscriptions/checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          package: plan,
          businessDraftPayload,
          businessImageBase64,
        }),
      }
    );

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Subscription checkout failed");
    if (!data?.url) throw new Error("Stripe URL missing");

    window.location.href = data.url;
  };

  // ✅ FIX: Single isCreating owner — no double-set race condition
  const handleOpenPlanAfterValidation = async () => {
    setCreateError(null);
    setSuccessMessage(null);

    if (!newBusiness.name.trim())
      return setCreateError("Business name is required.");

    if (selectedCategoryIds.length === 0)
      return setCreateError("Please select at least one business category.");

    if (!newBusiness.fullAddress.trim())
      return setCreateError("Please select address using Google search.");

    // ✅ FIX: description is marked required (*) — now validated
    if (!newBusiness.description.trim())
      return setCreateError("Business description is required.");

    if (!userRole)
      return setCreateError("Loading user info, please try again...");

    setIsCreating(true); // ✅ set once here, never inside sub-functions

    try {
      if (isBypassRole(userRole)) {
        const msg = await createBusinessDirect();
        setSuccessMessage(msg);

        setNewBusiness({
          name: "",
          fullAddress: "",
          description: "",
          place_id: undefined,
          latitude: undefined,
          longitude: undefined,
          city: "",
          state: "",
          country: "",
          zipcode: "",
        });
        setSelectedCategoryIds([]);
        setSelectedImage(null);
        setImagePreview(null);
        preComputedBase64Ref.current = null;

        if (showSuccessPopup) {
          onBusinessCreated?.();
          setTimeout(() => setOpenAddBusinessModal(false), 100);
        } else {
          setOpenAddBusinessModal(false);
          onBusinessCreated?.();
        }
      } else {
        setSelectedPlan(null);
        setOpenPlanModal(true);
      }
    } catch (err: any) {
      setCreateError(err?.message || "Something went wrong");
    } finally {
      setIsCreating(false); // ✅ always cleaned up in one place
    }
  };

  // ✅ FIX: isCreating fully owned here for plan confirm path
  const handleConfirmPlan = async (plan: PlanKey) => {
    setCreateError(null);
    setIsCreating(true);
    try {
      await startSubscriptionCheckout(plan);
      // note: on success, page redirects — finally still runs but component unmounts
    } catch (err: any) {
      setCreateError(err?.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ FIX: don't close modal while cropper is active
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isCreating && !showCropper) {
      setOpenAddBusinessModal(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setCreateError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setCreateError("Image size should be less than 5MB");
      return;
    }

    setSelectedImage(file);
    setCreateError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageSrc(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  // ✅ Pre-compute base64 right after crop — so checkout pays zero FileReader cost
  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        selectedImage?.name || "cropped.jpg"
      );
      setSelectedImage(croppedFile);

      // ✅ Eagerly compute base64 while user is still on the form/plan modal
      const raw = await fileToBase64(croppedFile);
      preComputedBase64Ref.current = raw;
      preComputedMimeRef.current = croppedFile.type || "image/jpeg";

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(croppedFile);

      setShowCropper(false);
      setImageSrc(null);
    } catch {
      setCreateError("Failed to crop image");
    }
  };return (
    <>
      {/* Modal Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl z-[9999] relative">
          {/* Close Button */}
          <button
            onClick={() => !isCreating && !showCropper && setOpenAddBusinessModal(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition z-10"
            type="button"
            disabled={isCreating}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              Add New Business
            </h2>

            <p className="text-gray-600 text-sm mb-4">
              This business will remain locked until it has been claimed by the
              business. Please submit to admin for approval.
            </p>

            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {createError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Sample Business Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newBusiness.name}
                  onChange={(e) =>
                    setNewBusiness((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* Business Address */}
              <div className="relative z-[10000]">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address <span className="text-red-500">*</span>
                </label>
                <GoogleAddressInput
                  value={newBusiness.fullAddress}
                  onChangeText={(text) =>
                    setNewBusiness((prev) => ({ ...prev, fullAddress: text }))
                  }
                  onSelect={(result) => {
                    const { city, state, country, zipcode } =
                      extractAddressParts(result);
                    setNewBusiness((prev) => ({
                      ...prev,
                      fullAddress: result.formatted_address,
                      place_id: result.place_id,
                      latitude: result.lat,
                      longitude: result.lng,
                      city,
                      state,
                      country,
                      zipcode,
                    }));
                  }}
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Business Logo/Photo
                </label>

                {!showCropper ? (
                  <div className="relative">
                    <input
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,.gif"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleImageChange}
                      disabled={isCreating}
                    />
                    <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition">
                      {imagePreview ? (
                        <div className="w-full">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-40 mx-auto rounded mb-2 object-contain"
                          />
                          <p className="text-green-600 font-semibold text-sm">
                            {selectedImage?.name}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <>
                          <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <p className="text-blue-600 font-semibold text-sm">
                            Click to upload{" "}
                            <span className="text-gray-500 text-xs font-normal">
                              or drag and drop
                            </span>
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            SVG, PNG, JPG or GIF (max. 800×400px)
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative h-80 bg-gray-100 rounded-lg mb-4">
                      <Cropper
                        image={imageSrc || ""}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="rect"
                        showGrid={true}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zoom
                      </label>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.1}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setShowCropper(false);
                          setImageSrc(null);
                          setSelectedImage(null);
                          setImagePreview(null);
                          preComputedBase64Ref.current = null;
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCropConfirm}
                        className="px-5 py-2 w-full text-center text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                      >
                        Crop & Use
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Write a short description..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={newBusiness.description}
                  onChange={(e) =>
                    setNewBusiness((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Multi-select Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Categories <span className="text-red-500">*</span>
                </label>

                {selectedCategoryIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategoryIds.map((id) => {
                      const bt = businessTypes.find((b) => b.id === id);
                      if (!bt) return null;
                      return (
                        <span
                          key={id}
                          className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full"
                        >
                          {bt.name.trim()}
                          <button
                            type="button"
                            onClick={() => removeCategory(id)}
                            className="ml-1 text-blue-500 hover:text-red-500 transition font-bold text-sm"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-left flex justify-between items-center focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <span className="text-gray-500">
                      {selectedCategoryIds.length === 0
                        ? "Select categories..."
                        : `${selectedCategoryIds.length} categor${selectedCategoryIds.length === 1 ? "y" : "ies"} selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                        categoryDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute z-[10001] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                      {/* ✅ Surface fetch failure to user */}
                      {businessTypesError ? (
                        <p className="text-sm text-red-500 px-3 py-2">
                          Failed to load categories. Please refresh.
                        </p>
                      ) : businessTypes.length === 0 ? (
                        <p className="text-sm text-gray-400 px-3 py-2">
                          Loading categories...
                        </p>
                      ) : (
                        businessTypes.map((bt) => {
                          const isChecked = selectedCategoryIds.includes(bt.id);
                          return (
                            <label
                              key={bt.id}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-blue-50 transition ${
                                isChecked ? "bg-blue-50" : ""
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleCategory(bt.id)}
                                className="w-4 h-4 accent-blue-600 cursor-pointer"
                              />
                              <span className="text-sm text-gray-700">
                                {bt.name.trim()}
                              </span>
                            </label>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={handleOpenPlanAfterValidation}
                  disabled={
                    isCreating ||
                    !newBusiness.name.trim() ||
                    !newBusiness.description.trim() || // ✅ now also blocks on empty description
                    selectedCategoryIds.length === 0 ||
                    !newBusiness.fullAddress.trim()
                  }
                  className="w-full px-5 py-3 text-center text-sm font-bold bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isCreating ? "Creating..." : "Create Business"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Plan Modal */}
      {openPlanModal && !isBypassRole(userRole) && (
        <div className="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 relative">
            <button
              type="button"
              disabled={isCreating}
              onClick={() => !isCreating && setOpenPlanModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Choose a Subscription Plan
            </h3>

            {createError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {createError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly */}
              <div
                className={`rounded-[36px] border shadow-lg relative cursor-pointer transition flex flex-col ${
                  selectedPlan === "monthly"
                    ? "ring-4 ring-blue-400"
                    : "hover:shadow-xl"
                }`}
                onClick={() => setSelectedPlan("monthly")}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow whitespace-nowrap">
                  Monthly
                </div>

                <div className="p-8 pt-20 flex-1">
                  <div className="text-center text-5xl font-extrabold text-gray-900 mb-8">
                    $29
                  </div>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Upload 30+ photos & videos.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Integrate your 360° virtual tour.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-blue-500 text-xl">✓</span>
                      Answer customer questions
                    </li>
                  </ul>
                </div>

                <div className="p-6 mt-auto">
                  <button
                    type="button"
                    className="w-full rounded-full bg-white text-[#06A7E8] border-2 border-[#06A7E8] font-bold py-4 text-lg hover:bg-[#06A7E8] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmPlan("monthly");
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? "Processing..." : "Choose Plan"}
                  </button>
                </div>
              </div>

              {/* Yearly */}
              <div
                className={`rounded-[36px] shadow-lg relative cursor-pointer transition flex flex-col ${
                  selectedPlan === "yearly"
                    ? "ring-4 ring-blue-400"
                    : "hover:shadow-xl"
                }`}
                onClick={() => setSelectedPlan("yearly")}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow whitespace-nowrap">
                  Yearly
                </div>

                <div className="bg-[#06A7E8] text-white p-8 pt-20 flex-1 rounded-[36px]">
                  <div className="text-center text-5xl font-extrabold mb-8">
                    $299
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Upload 30+ photos & videos.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Integrate your 360° virtual tour.
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Answer customer questions
                    </li>
                    <li className="flex gap-3 items-start">
                      <span className="text-white text-xl">✓</span>
                      Most cost-effective
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-white mt-auto rounded-b-[36px]">
                  <button
                    type="button"
                    className="w-full rounded-full bg-white text-[#06A7E8] border-2 border-[#06A7E8] font-bold py-4 text-lg hover:bg-[#06A7E8] hover:text-white transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfirmPlan("yearly");
                    }}
                    disabled={isCreating}
                  >
                    {isCreating ? "Processing..." : "Choose Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full screen loader */}
      {isCreating && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3">
            <img
              src="/assets/images/favicon.png"
              className="w-12 h-12 animate-spin"
              alt="Loading"
            />
            <p className="text-gray-700 font-semibold">Processing...</p>
          </div>
        </div>
      )}
    </>
  );
}
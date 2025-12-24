"use client";
import React, { useState, useEffect } from "react";
import GoogleAddressInput from "@/app/component/GoogleAddressInput";

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

// ✅ Plan type
type PlanKey = "monthly" | "yearly";

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

// ---------- Helper to convert file to base64 ----------
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

// ---------- Component ----------
interface AddBusinessProps {
  setOpenAddBusinessModal: React.Dispatch<React.SetStateAction<boolean>>;
  onBusinessCreated: () => void;
}

export default function AddBusinessModal({
  setOpenAddBusinessModal,
  onBusinessCreated,
}: AddBusinessProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
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

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ NEW: plan modal states
  const [openPlanModal, setOpenPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanKey | null>(null);

  const getPriceIdByPlan = (plan: PlanKey) => {
  if (plan === "monthly") {
    return process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "";
  }
  if (plan === "yearly") {
    return process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || "";
  }
  return "";
};

const startSubscriptionCheckout = async (
  plan: PlanKey,
  businessId: string
) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  if (!token) {
    setCreateError("You must be logged in.");
    return;
  }

  const priceId = getPriceIdByPlan(plan);

  if (!priceId) {
    setCreateError("Stripe price id missing.");
    return;
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}subscriptions/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        business_id: businessId,
        package: plan,
        price_id: priceId,
      }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    setCreateError(data?.message || "Subscription checkout failed");
    return;
  }

  if (data?.url) {
    // ✅ STRIPE REDIRECT
    window.location.href = data.url;
  }
};


  // ---------- Fetch business types on mount ----------
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;

    fetch(base + "/business-type/list?page=1&limit=1000")
      .then((response) => response.json())
      .then((data) => {
        console.log("Business type list API:", data);
        setBusinessTypes(data.data || []);
      })
      .catch((error) => {
        console.error("Error fetching business types:", error);
      });
  }, []);

  // ---------- Handle image selection ----------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Step-1: validate then open plan modal (NO create here)
  const handleOpenPlanAfterValidation = () => {
    setCreateError(null);
    setSuccessMessage(null);

    if (!newBusiness.name.trim()) {
      setCreateError("Business name is required.");
      return;
    }
    if (!selectedCategoryId) {
      setCreateError("Please select a business category.");
      return;
    }
    if (!newBusiness.fullAddress.trim()) {
      setCreateError("Please select address using Google search.");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      setCreateError("You must be logged in before creating a business.");
      return;
    }

    // ✅ all good => open plan popup
    setSelectedPlan(null);
    setOpenPlanModal(true);
  };

  // ---------- Create business handler (NOW depends on plan) ----------
  const handleCreateBusiness = async (plan: PlanKey): Promise<string | null> => {
    setCreateError(null);
    setSuccessMessage(null);

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (!token) {
      setCreateError("You must be logged in before creating a business.");
      return null;
    }

    const payload = {
      name: newBusiness.name.trim(),
      business_type: [selectedCategoryId],
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

      // ✅ add selected plan
      subscription_plan: plan, // "monthly" | "yearly"
    };

    try {
      setIsCreating(true);

      // Step 1: Create business
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_BASE_URL + "/business/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Create business – status:", res.status);

      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        console.error("Create business error:", errorBody);
        throw new Error(errorBody.message || "Failed to create business");
      }

      const responseData = await res.json();
      console.log("Business created successfully:", responseData);

      const businessId = responseData.id;

      // Step 2: Upload image if selected
      if (selectedImage && businessId) {
        try {
          const base64Image = await fileToBase64(selectedImage);

          const imageUploadPayload = {
            data: base64Image,
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

          console.log("Image upload – status:", imageRes.status);

          if (!imageRes.ok) {
            const imageError = await imageRes.json().catch(() => ({}));
            console.error("Image upload error:", imageError);
            throw new Error(imageError.message || "Failed to upload image");
          }

          const imageResponse = await imageRes.json();
          console.log("Image uploaded successfully:", imageResponse);
        } catch (imageErr: any) {
          throw new Error(
            `Business created but image upload failed: ${imageErr.message}`
          );
        }
      }
       return businessId;
      

    } catch (err: any) {
      setCreateError(err.message || "Something went wrong");
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isCreating) {
      setOpenAddBusinessModal(false);
    }
  };

  // ✅ Plan modal confirm
  const handleConfirmPlan = async () => {
  if (!selectedPlan) {
    setCreateError("Please choose a subscription plan first.");
    return;
  }

  // 1️⃣ Create business draft
  const businessId = await handleCreateBusiness(selectedPlan);
  if (!businessId) return;

  // 2️⃣ Start Stripe subscription checkout
  await startSubscriptionCheckout(selectedPlan, businessId);
};


  return (
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
            onClick={() => !isCreating && setOpenAddBusinessModal(false)}
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

              {/* Logo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Business Logo/Photo
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept=".svg,.png,.jpg,.jpeg,.gif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
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
                        <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
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
                    setNewBusiness((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>

              {/* Category select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Categories <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {businessTypes.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.name.trim()}
                    </option>
                  ))}
                </select>
              </div>

              {/* ✅ Submit Button (NOW opens plan popup) */}
              {/* <div className="pt-2">
                <button
                  onClick={handleOpenPlanAfterValidation}
                  disabled={isCreating}
                  className="w-full px-5 py-3 text-center text-sm font-bold bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {isCreating ? "Creating..." : "Create Business"}
                </button>
              </div> */}
              {/* ✅ Submit Button (NOW opens plan popup) */}
              <div className="pt-2">
                <button
                  onClick={handleOpenPlanAfterValidation}
                  disabled={
                    isCreating ||
                    !newBusiness.name.trim() ||
                    !selectedCategoryId ||
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

      {/* ✅ Subscription Plan Popup */}
      {openPlanModal && (
  <div className="fixed inset-0 z-[10010] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-1xl p-6 relative">
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
          {/* pill (no cut) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow">
            Monthly
          </div>

          {/* content */}
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

          {/* button (aligned) */}
          <div className="p-6 mt-auto">
            <button
              type="button"
              className="w-full rounded-full bg-blue-500 text-white font-bold py-4 text-lg hover:bg-blue-600 transition"
              onClick={(e) => {
                e.stopPropagation(); // ✅ card click conflict avoid
                setSelectedPlan("monthly");
                handleConfirmPlan();
              }}
              disabled={isCreating}
            >
              Choose Plan
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
          {/* pill (no cut) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-10 py-3 rounded-full shadow">
            Yearly
          </div>

          {/* content */}
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

          {/* button (aligned) */}
          <div className="p-6 bg-white mt-auto rounded-b-[36px]">
            <button
              type="button"
              className="w-full rounded-full bg-white text-[#06A7E8] border-2 border-[#06A7E8] font-bold py-4 text-lg hover:bg-[#06A7E8] hover:text-white transition"
              onClick={(e) => {
                e.stopPropagation(); // ✅ card click conflict avoid
                setSelectedPlan("yearly");
                handleConfirmPlan();
              }}
              disabled={isCreating}
            >
              Choose Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}
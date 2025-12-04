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

// ---------- Component Props ----------
interface AddBusinessModalProps {
  onBusinessCreated?: () => void; // Callback after successful creation
  setOpenAddBusinessModal: React.Dispatch<React.SetStateAction<boolean>>;
}



// ---------- Component ----------
export default function AddBusinessModal({ onBusinessCreated, setOpenAddBusinessModal} : AddBusinessModalProps) {
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  
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

  // Lock body scroll when modal is open
  useEffect(() => {
    const checkbox = document.getElementById('business-toggle') as HTMLInputElement;
    
    if (!checkbox) return;

    const lockScroll = () => {
      if (checkbox.checked) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      }
    };

    checkbox.addEventListener('change', lockScroll);

    return () => {
      checkbox.removeEventListener('change', lockScroll);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  // Fetch business types
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

  // Create business handler
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    // Validation
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
    };

    try {
      setIsCreating(true);

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

      // Reset form
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
      setSelectedCategoryId("");

      // Close modal
      const checkbox = document.getElementById(
        "business-toggle"
      ) as HTMLInputElement | null;
      if (checkbox) checkbox.checked = false;

      // Callback to parent to refresh list
      if (onBusinessCreated) {
        onBusinessCreated();
      }
    } catch (err: any) {
      setCreateError(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      
      <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-10000 ">
        <div className="bg-white rounded-2xl shadow-2xl w-11/12 sm:w-[600px] p-6 relative overflow-y-auto">
          <label
            onClick={()=> setOpenAddBusinessModal(false)}
            className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            ×
          </label>

          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Add New Business
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            This business will remain locked until it has been claimed by the
            business. Please submit to admin for approval.
          </p>

          {createError && (
            <p className="text-red-500 text-sm mb-2">{createError}</p>
          )}

          <form className="space-y-4" onSubmit={handleCreateBusiness}>
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Sample Business Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                value={newBusiness.name}
                onChange={(e) =>
                  setNewBusiness((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            {/* Business Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address <span className="text-red-500">*</span>
              </label>

              <GoogleAddressInput
                value={newBusiness.fullAddress}
                onChangeText={(text) =>
                  setNewBusiness((prev) => ({
                    ...prev,
                    fullAddress: text,
                  }))
                }
                onSelect={(result) => {
                  console.log("Selected place:", result);

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
              <label className="block text-md font-medium text-gray-700 mb-2">
                Upload Business Logo/Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept=".svg,.png,.jpg,.gif"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    console.log("logo file selected", e.target.files?.[0]);
                  }}
                />
                <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text:center hover:bg-gray-50 cursor-pointer h-fit">
                  <img
                    src="/assets/images/upload-icon.avif"
                    alt="upload-icon"
                    className="w-10 h-10"
                  />
                  <p className="text-[#0519CE] font-semibold text-sm">
                    Click to upload{" "}
                    <span className="text-gray-500 text-xs">
                      or drag and drop
                    </span>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    SVG, PNG, JPG or GIF (max. 800×400px)
                  </p>
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
                rows={3}
                value={newBusiness.description}
                onChange={(e) =>
                  setNewBusiness((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>
            </div>

            {/* Category select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Categories <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none"
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

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <label
                 onClick={()=> setOpenAddBusinessModal(false)}
                className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </label>
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-60"
              >
                {isCreating ? "Creating..." : "Create Business"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
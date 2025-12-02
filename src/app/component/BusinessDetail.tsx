<<<<<<< Updated upstream
"use client";

import React, { useEffect, useState } from "react";

// ---------- Types ----------
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

type LinkedType = {
  business_type_id?: string;
};

type BusinessProfileApi = BusinessProfile & {
  owner_email?: string;
  linkedTypes?: LinkedType[];
};

type BusinessType = {
  id: string;
  name: string;
};

interface BusinessDetailProps {
  businessId: string;
  setOpenDetailPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const BusinessDetail: React.FC<BusinessDetailProps> = ({
  businessId,
  setOpenDetailPopup,
  onUpdated,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [btLoading, setBtLoading] = useState(false);
  const [btError, setBtError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    ownerEmail: "",
    description: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    email: "",
    phoneNumber: "",
    website: "",
    businessCategory: "", // will store UUID of business_type.id
  });

  // ---------- Fetch business types ----------
  useEffect(() => {
    const fetchBusinessTypes = async () => {
      try {
        if (!API_BASE_URL) return;

        setBtLoading(true);
        setBtError(null);

        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("access_token")
            : null;

        const res = await fetch(
          `${API_BASE_URL}/business-type/list?page=1&limit=200`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load business types (${res.status})`);
        }

        const data = await res.json();
        // Response shape: { page, limit, total, totalPages, data: BusinessType[] }
        setBusinessTypes(data.data || []);
        setBtLoading(false);
      } catch (err: unknown) {
        console.error(err);
        const message =
          err instanceof Error ? err.message : "Failed to fetch business types";
        setBtError(message);
        setBtLoading(false);
      }
    };

    fetchBusinessTypes();
  }, [API_BASE_URL]);

  // ---------- Fetch existing business profile ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!API_BASE_URL || !businessId) {
          setLoading(false);
          return;
        }

        setLoading(true);
        setError(null);

        const token =
          typeof window !== "undefined"
            ? window.localStorage.getItem("access_token")
            : null;

        if (!token) {
          setError("Login required. No access token found.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `${API_BASE_URL}/business/business-profile/${businessId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to load business profile (${res.status})`);
        }

        const data: BusinessProfileApi = await res.json();

        setForm({
          name: data.name || "",
          address: data.address || "",
          ownerEmail: data.owner_email || "",
          description: data.description || "",
          city: data.city || "",
          state: data.state || "",
          zipcode: data.zipcode || "",
          country: data.country || "",
          email: data.email || "",
          phoneNumber: data.phone_number || "",
          website: data.website || "",
          // yahan backend se aane wala business_type_id UUID store ho raha hai
          businessCategory: data.linkedTypes?.[0]?.business_type_id ?? "",
        });

        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        const message =
          err instanceof Error ? err.message : "Failed to fetch business profile";
        setError(message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL, businessId]);

  // ---------- Common change handler ----------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- Submit / Update ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!API_BASE_URL) {
        setError("API base URL is not configured.");
        return;
      }

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem("access_token")
          : null;

      if (!token) {
        setError("Login required. No access token found.");
        return;
      }

      setSaving(true);

      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        description: form.description,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        zipcode: form.zipcode,
        email: form.email,
        phone_number: form.phoneNumber,
        website: form.website,
      };

      if (form.businessCategory) {
        // yahan pe UUID jaa raha hai jo select se aya hai
        payload.business_type = [form.businessCategory];
      }

      const res = await fetch(
        `${API_BASE_URL}/business/update/${businessId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const body = (await res.json().catch(() => null)) as
        | BusinessProfile
        | { message?: string }
        | null;

      if (!res.ok) {
        console.error("Update error:", body);
        const message =
          (body as { message?: string })?.message ||
          `Failed to update business (${res.status})`;
        throw new Error(message);
      }

      if (onUpdated && body) {
        onUpdated(body as BusinessProfile);
      }

      setSaving(false);
      setOpenDetailPopup(false);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to update business";
      setSaving(false);
      setError(message);
    }
  };

  const handleClose = () => {
    setError(null);
    setOpenDetailPopup(false);
  };

  // ---------- UI ----------
  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Edit Business Details
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading business details...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm mb-2">
                {error}
              </p>
            )}

            {/* Business Name */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="12 West Brewing"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                type="text"
                placeholder="12 W Main St, Mesa, AZ 85201, USA"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Profile Owner Email */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Profile Owner Email
              </label>
              <input
                name="ownerEmail"
                type="email"
                placeholder="alison@visitmesa.com"
                value={form.ownerEmail}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-md font-medium text-gray-800 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* City / State / Zip / Country */}
            <div className="flex justify-between flex-wrap gap-y-4">
              <div className="w-[230px]">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="Mesa"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
                />
              </div>

              <div className="w-[230px]">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  name="state"
                  type="text"
                  placeholder="Arizona"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
                />
              </div>

              <div className="w-[230px]">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Zip
                </label>
                <input
                  name="zipcode"
                  type="text"
                  placeholder="85201"
                  value={form.zipcode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
                />
              </div>

              <div className="w-[230px]">
                <label className="block text-md font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  name="country"
                  type="text"
                  placeholder="Maricopa County"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                placeholder="downtown12west@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                type="text"
                placeholder="+1 480-508-7018"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Business Website
              </label>
              <input
                name="website"
                type="text"
                placeholder="http://12westbrewing.com/mesa"
                value={form.website}
                onChange={handleChange}
                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
            </div>

            {/* Business Category (ID) */}
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Business Categories
              </label>

              {btError && (
                <p className="text-xs text-red-500 mb-1">
                  {btError}
                </p>
              )}

              <select
                name="businessCategory"
                value={form.businessCategory}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-2 focus:ring-[#0519CE] outline-none"
              >
                <option value="">
                  {btLoading ? "Loading categories..." : "Select Category"}
                </option>

                {businessTypes.map((bt) => (
                  <option key={bt.id} value={bt.id}>
                    {bt.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 w-full text-center text-md font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 w-full text-center text-md font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Updating..." : "Update Details"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
=======
import React from 'react'

export default function BusinessDetail() {
    return (
        <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
                {/* <!-- Close Button --> */}
                <label htmlFor="edit-about-popup-toggle"
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                    ×
                </label>

                {/* <!-- Modal Header --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Business Details</h2>

                {/* <!-- Form --> */}
                <form className="space-y-6">
                    {/* <!-- Business Name --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" placeholder="12 West Brewing"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>

                    {/* <!-- Business Address --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Address</label>
                        <input type="text" placeholder="12 W Main St, Mesa, AZ 85201, USA"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>

                    {/* <!-- Owner Email --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Profile Owner Email</label>
                        <input type="email" placeholder="alison@visitmesa.com"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>


                    {/* <!-- Business Description --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-800 mb-1">
                            Description
                        </label>

                        <textarea
                            rows={10}
                            cols={40}
                            className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none"
                            defaultValue={`In March 2016, co-founders Bryan McCormick and Noel Garcia were introduced through mutual friends. They made it official in April and immediately started brewing on a one-barrel system.

After hearing about the Barnone project at Agritopia, Noel called Joe Johnston to see if there were any spots left. Thankfully there was and three days later it was a done deal! While construction on Barnone continued, Noel & Bryan upgraded to a 10-barrel system at their production facility and cranked out beers for their grand opening in November of 2016.`}
                        />
                    </div>

                    {/* Form */}
                    <div className='flex justify-between flex-wrap space-y-4'>

                        {/* <!-- City Name --> */}
                        <div className='w-[230px]'>
                            <label className="block text-md font-medium text-gray-700 mb-1">City</label>
                            <input type="text" placeholder="Mesa"
                                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>


                        {/* <!-- State Name --> */}
                        <div className='w-[230px]'>
                            <label className="block text-md font-medium text-gray-700 mb-1">
                                State</label>
                            <input type="text" placeholder="Arizona"
                                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Zip code --> */}
                        <div className='w-[230px]'>
                            <label className="block text-md font-medium text-gray-700 mb-1">
                                Zip</label>
                            <input type="number" placeholder="85201"
                                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Country --> */}
                        <div className='w-[230px]'>
                            <label className="block text-md font-medium text-gray-700 mb-1">

                                Country</label>
                            <input type="text" placeholder="Maricopa County"
                                className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                    </div>


                    {/* <!-- Email --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" placeholder="downtown12west@gmail.com"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>


                    {/* <!-- Phone Number --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Phone Number
                        </label>
                        <input type="number" placeholder="+1 480-508-7018"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>

                    {/* <!-- Business Website --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Business Website</label>
                        <input type="text" placeholder="http://12westbrewing.com/mesa"
                            className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                    </div>

                    {/* <!-- Business Category --> */}
                    <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Business Categories</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-2 focus:ring-[#0519CE] outline-none">
                            <option>Select Category</option>
                            <option value="Restaurant">Restaurant</option>
                            <option>Retail</option>
                            <option>Healthcare</option>
                            <option>Accessibility Services</option>
                        </select>
                    </div>

                    {/* <!-- Form Buttons --> */}
                    <div className="flex justify-center gap-3 pt-2">
                        <label htmlFor="edit-about-popup-toggle"
                            className="px-5 py-2.5 w-full text-center text-md font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                            Cancel
                        </label>
                        <button type="submit"
                            className="px-5 py-2.5 w-full text-center text-md font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                            Update Details
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
>>>>>>> Stashed changes

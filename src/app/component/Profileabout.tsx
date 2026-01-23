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

interface ProfileaboutProps {
  businessId: string;
  setOpenAboutModal: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const Profileabout: React.FC<ProfileaboutProps> = ({
  businessId,
  setOpenAboutModal,
  onUpdated,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Existing description load karo
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
          `${API_BASE_URL}business/business-profile/${businessId}`,
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

        const data: BusinessProfile = await res.json();
        setDescription(data.description || "");
        setLoading(false);
      } catch (err: unknown) {
        console.error(err);
        const msg =
          err instanceof Error ? err.message : "Failed to fetch business profile";
        setError(msg);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [API_BASE_URL, businessId]);

  const handleClose = () => {
    setError(null);
    setOpenAboutModal(false);
  };

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
        description: description.trim() || null,
      };

      const res = await fetch(
        `${API_BASE_URL}business/update/${businessId}`,
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
        console.error("Update description error:", body);
        const msg =
          (body as { message?: string })?.message ||
          `Failed to update description (${res.status})`;
        throw new Error(msg);
      }

      if (onUpdated && body) {
        onUpdated(body as BusinessProfile);
      }

      setSaving(false);
      setOpenAboutModal(false);
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Failed to update description";
      setSaving(false);
      setError(msg);
    }
  };

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

        {/* Modal Header */}
        <h2 className="text-lg font-bold text-gray-700 mb-4">
          Update Business About Information
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500">Loading description...</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Business Description */}
            <div>
              <label className="block text-md font-medium text-gray-800 mb-1">
                Business Description
              </label>

              <textarea
                rows={10}
                cols={40}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none"
              />
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
                {saving ? "Updating..." : "Update Description"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profileabout;

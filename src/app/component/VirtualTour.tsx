"use client";

import React, { useEffect, useState } from "react";

export type VirtualTourType = {
  id: string;
  name: string;
  linkUrl: string;
  displayOrder: number;
  active: boolean;
};

interface VirtualTourProps {
  businessId: string;
  setOpenVirtualTour: (open: boolean) => void;
  onUpdated?: () => void | Promise<void>;
  tour?: VirtualTourType | null; // edit mode
}

const VirtualTour: React.FC<VirtualTourProps> = ({
  businessId,
  setOpenVirtualTour,
  onUpdated,
  tour,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!tour;

  // Prefill when editing
  useEffect(() => {
    if (tour) {
      setTitle(tour.name || "");
      setLink(tour.linkUrl || "");
    }
  }, [tour]);

  const handleClose = () => {
    if (!saving) setOpenVirtualTour(false);
  };

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!API_BASE_URL) {
      setError("API base URL is not configured.");
      return;
    }

    const token = getToken();
    if (!token) {
      setError("You are not logged in (no access token).");
      return;
    }

    if (!title.trim() || !link.trim()) {
      setError("Title and Virtual Link are required.");
      return;
    }

    const payload = {
      name: title.trim(),
      linkUrl: link.trim(),
      businessId: businessId,
      active: true,
    };

    try {
      setSaving(true);

      const url = isEditMode
        ? `${API_BASE_URL}/business-virtual-tours/update/${tour!.id}`
        : `${API_BASE_URL}/business-virtual-tours/create`;

      const res = await fetch(url, {
        method: isEditMode ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || "Failed to save virtual tour");
      }

      if (onUpdated) {
        await onUpdated();
      }

      setOpenVirtualTour(false);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
        {/* CLOSE */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        <h2 className="text-lg font-bold text-gray-700 mb-4">
          {isEditMode ? "Edit Virtual Tour" : "Add Virtual Tour"}
        </h2>

        {error && (
          <p className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-3 text-sm">
            {error}
          </p>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="360 Virtual Tour"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-700 hover:border-[#0519CE] focus:border-[#0519CE] outline-none"
            />
          </div>

          {/* Link */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Virtual Link
            </label>
            <input
              type="text"
              placeholder="https://cloud.threshold360.com/location/12345"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-700 hover:border-[#0519CE] focus:border-[#0519CE] outline-none"
            />
          </div>

          {/* BUTTONS (only Cancel + Create/Update) */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              {saving
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Tour"
                : "Create Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VirtualTour;

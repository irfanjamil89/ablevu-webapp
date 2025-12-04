"use client";

import React, { useState, useEffect } from "react";

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

interface AccessibilityResourcesPopupProps {
  businessId: string;
  setOpenAccessibilityResourcesPopup: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onUpdated?: (b: BusinessProfile) => void;

  // ⭐ edit mode ke liye
  resource?: any;
}

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

const AccessibilityResourcesPopup: React.FC<AccessibilityResourcesPopupProps> = ({
  businessId,
  setOpenAccessibilityResourcesPopup,
  onUpdated,
  resource,
}) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [label, setLabel] = useState("");
  const [link, setLink] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = !!resource?.id;

  // ⭐ Edit mode mein form pre-fill
  useEffect(() => {
    if (resource) {
      setLabel(resource.label || "");
      setLink(resource.link || resource.url || "");
    } else {
      setLabel("");
      setLink("");
    }
  }, [resource]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!API_BASE_URL) return;

    const token = getToken();
    if (!token) {
      alert("No access token");
      return;
    }

    if (!label.trim()) {
      alert("Label is required");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        business_id: businessId,
        label: label.trim(),
        link: link.trim() || null,
        active: true,
      };

      const url = isEdit
        ? `${API_BASE_URL}/additional-resource/update/${resource.id}`
        : `${API_BASE_URL}/additional-resource/create`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = isEdit
          ? "Failed to update resource"
          : "Failed to save resource";
        try {
          const body = await res.json();
          if (body?.message) {
            msg = Array.isArray(body.message)
              ? body.message.join(", ")
              : body.message;
          }
        } catch {}
        throw new Error(msg);
      }

      const updated = await res.json();
      if (onUpdated && updated) {
        onUpdated(updated);
      }

      setOpenAccessibilityResourcesPopup(false);
    } catch (err: any) {
      console.error(err);
      alert(
        err.message ||
          (isEdit ? "Failed to update resource" : "Failed to save resource")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      {/* MODAL CARD */}
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">
        {/* CLOSE BUTTON */}
        <label
          onClick={() => setOpenAccessibilityResourcesPopup(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </label>

        {/* HEADER */}
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          Additional Accessibility Resources
        </h2>
        <p className="text-gray-700 text-md mb-4">
          In this section, you can add link of social story, sensory maps or
          link of programs.
        </p>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Label */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              placeholder="Enter"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-500 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          {/* Add Link */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-1">
              Add Link
            </label>
            <input
              type="text"
              placeholder="Paste..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-500 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 pt-2">
            <label
              onClick={() => setOpenAccessibilityResourcesPopup(false)}
              className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </label>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 disabled:opacity-70"
            >
              {saving
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                ? "Update"
                : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessibilityResourcesPopup;

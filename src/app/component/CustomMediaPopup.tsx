"use client";
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface CustomMediaPopupProps {
  businessId: string;
  setCustomMediaPopup: React.Dispatch<React.SetStateAction<boolean>>;
  activeCustomSectionId: string | null;
  onUpdated?: () => void;
  media?: any;
}

const CustomMediaModal: React.FC<CustomMediaPopupProps> = ({
  businessId,
  setCustomMediaPopup,
  activeCustomSectionId,
  onUpdated,
  media,
}) => {

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [label, setlabel] = useState("");
  const [Description, setDescription] = useState("");
  const [link, setlink] = useState("");
  const [active, setactive] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const isEdit = !!media?.id;

   useEffect(() => {
    console.log("media in modal:", media);
      if (media) {
        setlabel(media.label);
        setDescription(media.description);
        setlink(media.link);
      } else {
        setlabel("");
        setDescription("");
        setlink("");
      }
    }, [media]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const payload = {
      business_id: businessId,
      business_custom_section_id: activeCustomSectionId,
      label,
      link,
      description: Description,
      active
    };
    const url = isEdit
      ? `${API_BASE_URL}business-custom-sections-media/update/${media.id}`
      : `${API_BASE_URL}business-custom-sections-media/create`;

      const method = isEdit ? "PATCH" : "POST";

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(url,{
        method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        setSuccess("Custom Media added successfully!");
        setlabel("");
        setlink("");
        onUpdated?.();
        setCustomMediaPopup(false);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create Custom Media.");
      }
    } catch (err: any) {
      console.error("Custom Media Error:", err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-[500px]  p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEdit ? "Edit Custom Section Media" : "Create Custom Section Media"}</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={() => setCustomMediaPopup(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-base font-medium mb-2">
            Title
          </label>
          <input
            id="label"
            type="text"
            placeholder="Enter"
            value={label} onChange={(e) => setlabel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-6">
          <label className="block text-gray-700 text-base font-medium mb-2">
            Description
          </label>
          <textarea
            placeholder="Enter..."
            rows={5}
            value={Description}
             onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Add Link Input */}
        <div className="mb-8">
          <label className="block text-gray-700 text-base font-medium mb-2">
            Add Link
          </label>
          <input
            id="link"
            type="text"
            placeholder="Paste..."
            value={link} onChange={(e) => setlink(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => setCustomMediaPopup(false)}
            className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={loading}
           className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-800">
            {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomMediaModal;
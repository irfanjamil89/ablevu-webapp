"use client";
import React, { useState } from 'react';
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
    onUpdated?: () => void;
}

const CustomMediaModal: React.FC<CustomMediaPopupProps> = ({
    businessId,
    setCustomMediaPopup,
    onUpdated,
}) => {

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-[500px]  p-8 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Custom Media</h2>
          <button className="text-gray-400 hover:text-gray-600" onClick={()=> setCustomMediaPopup(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <label className="block text-gray-700 text-base font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            placeholder="Enter"
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
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {/* Add Link Input */}
        <div className="mb-8">
          <label className="block text-gray-700 text-base font-medium mb-2">
            Add Link
          </label>
          <input
            type="text"
            placeholder="Paste..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
           onClick={()=> setCustomMediaPopup(false)}
           className="flex-1 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-full text-lg font-medium hover:bg-gray-50">
            Cancel
          </button>
          <button className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-full text-lg font-medium hover:bg-blue-800">
            Create Media
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomMediaModal;
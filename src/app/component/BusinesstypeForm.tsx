"use client";
import React, { useState } from "react";
import axios from "axios";

export default function BusinessTypeForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const userId = "80dfa7c9-f919-4ffa-b37b-ad36899ec46d";

    try {
      const response = await axios.post(
        `https://staging-api.qtpack.co.uk/business-type/create/${userId}`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201) {
        setMessage("Business type added successfully!");
        setName("");
        if (onSuccess) onSuccess(); // trigger reload on success
      }
    } catch (error: any) {
      console.error("Error:", error.response?.data || error);
      setMessage("Failed to add business type. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="add-business-type" className="hidden peer" />
      <label
        htmlFor="add-business-type"
        className="px-3 py-2 text-sm font-bold text-white bg-[#0519CE] rounded-full cursor-pointer hover:bg-blue-700 transition"
      >
        Add Business Type
      </label>

      {/* Overlay */}
      <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
          <label
            htmlFor="add-business-type"
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            ×
          </label>
          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Add Business Type
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-md font-medium text-gray-700 mb-1">
                Title <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Title"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
              />
            </div>

            {message && (
              <p
                className="text-sm text-green-600"
              >
                {message}
              </p>
            )}

            <div className="flex justify-center gap-3 pt-2">
              <label
                htmlFor="add-business-type"
                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </label>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

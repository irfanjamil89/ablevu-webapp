"use client";
import React, { useState } from "react";
import axios from "axios";

interface FeatureTypeFormProps {
  onSuccess: () => void; // callback to refresh table
}

export default function FeatureTypeForm({ onSuccess }: FeatureTypeFormProps) {
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: form.name,
      display_order: null,
      picture_url: null,
      active: null,
    };

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_BASE_URL+"accessible-feature-types/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201 && response.data) {
        setSuccess("Accessibility feature type added successfully!");
        setForm({ name: "" });
        onSuccess(); // refresh list
      } else {
        setError(response.data?.message || "Failed to add feature type.");
      }
    } catch (err: any) {
      console.error("Error creating feature type:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="feature-type-toggle" className="hidden peer" />
      <label
        htmlFor="feature-type-toggle"
        className="px-3 py-2 text-sm font-bold text-white bg-[#0519CE] rounded-full cursor-pointer hover:bg-blue-700 transition"
      >
        Add Feature Type
      </label>

      {/* Modal */}
      <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">
          <label
            htmlFor="feature-type-toggle"
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            ×
          </label>

          <h2 className="text-lg font-bold text-gray-700 mb-4">
            Add Feature Type
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500 font-bold">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter Name"
                maxLength={250}
                pattern="^[A-Za-z\s]{1,50}$"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <div className="flex justify-center gap-3 pt-2">
              <label
                htmlFor="feature-type-toggle"
                className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Cancel
              </label>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 w-full text-center cursor-pointer text-sm font-bold bg-[#0519CE] text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
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

"use client";
import React, { useState } from "react";
import axios from "axios";

interface FeedbackTypeFormProps {
  onSuccess: () => void;
}

export default function FeedbackTypeForm({ onSuccess }: FeedbackTypeFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      name: name,
      image_url: "",  // required by backend but no UI field
      active: true    // default TRUE
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}feedback-type/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccess("Feedback type added successfully!");
        setName("");
        onSuccess();
      }
    } catch (err: any) {
      console.error("Feedback Type Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="feedback-toggle" className="hidden peer" />

      <label
        htmlFor="feedback-toggle"
        className="px-3 py-2 text-sm font-bold text-white bg-[#0519CE] rounded-full cursor-pointer hover:bg-blue-700 transition"
      >
        Add Feedback Type
      </label>

      {/* Modal */}
      <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

          <label
            htmlFor="feedback-toggle"
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
          >
            ×
          </label>

          <h2 className="text-lg font-bold text-gray-800 mb-5">
            Add Feedback Type
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name Field Only */}
            <div>
              <label
                htmlFor="name"
                className="block text-md font-medium text-gray-700 mb-1"
              >
                Name <span className="text-red-500">*</span>
              </label>

              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:border-[#0519CE] outline-none transition"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            {/* Buttons */}
            <div className="flex justify-between gap-3 pt-2">
              <label
                htmlFor="feedback-toggle"
                className="px-5 py-2 w-full text-center border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100 font-semibold"
              >
                Cancel
              </label>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 w-full bg-[#0519CE] text-white rounded-full hover:bg-blue-700 font-semibold disabled:opacity-50"
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

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface FeedbackProps {
  setOpenFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type FeedbackType = {
  id: string;
  name: string;
};

const Feedback: React.FC<FeedbackProps> = ({ setOpenFeedbackModal }) => {
  const [feedbackTypeId, setFeedbackTypeId] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [types, setTypes] = useState<FeedbackType[]>([]);
  const [typesLoading, setTypesLoading] = useState<boolean>(true);
  const [OpenSuccessModal, setOpenSuccessModal] = useState<boolean>(false);
  const [typesError, setTypesError] = useState<string>("");

  // 🔹 Feedback types list fetch
  const fetchFeedbackTypes = async () => {
    setTypesLoading(true);
    setTypesError("");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback-type/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = res.data; // 👈 yahan let → const

      if (Array.isArray(data)) {
        setTypes(data);
      } else if (Array.isArray(data?.data)) {
        setTypes(data.data);
      } else if (Array.isArray(data?.items)) {
        setTypes(data.items);
      } else {
        setTypesError("Unable to load feedback types.");
      }
    } catch (err: any) {
      console.error(
        "Feedback types load error:",
        err.response?.data || err.message
      );
      setTypesError("Failed to load feedback types.");
    } finally {
      setTypesLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbackTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!feedbackTypeId) {
      setError("Please select a feedback type.");
      return;
    }
    if (!comment.trim()) {
      setError("Please enter your comments.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        business_id: null,
        feedback_type_id: feedbackTypeId,
        comment: comment.trim(),
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/create`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setComment("");
      setFeedbackTypeId("");
      setOpenSuccessModal(true);
      
    } catch (err: any) {
      console.error(
        "Feedback submit error:",
        err.response?.data || err.message
      );
      setError(
        err.response?.data?.message ||
          "Failed to submit feedback. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-10000">
      {/* MODAL CARD */}
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpenFeedbackModal(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Share Feedback About AbleVu
        </h2>

        {/* FORM */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Feedback Type */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Select Feedback type
            </label>
            <select
              value={feedbackTypeId}
              onChange={(e) => setFeedbackTypeId(e.target.value)}
              className="w-full border hover:border-[#0519CE] border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-1 focus:ring-[#0519CE] outline-none"
            >
              <option value="">
                {typesLoading ? "Loading..." : "Select"}
              </option>
              {!typesLoading &&
                types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
            {typesError && (
              <p className="text-xs text-red-500 mt-1">{typesError}</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              placeholder="Type here..."
              rows={5}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenFeedbackModal(false)}
              className="px-4 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || typesLoading}
              className="px-4 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white cursor-pointer rounded-full hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
      {OpenSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
            <div className="flex justify-center mb-4">
              <div className="bg-[#0519CE] rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2">Success</h2>
            <p className="mb-4">Feedback Submit Successfully!</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => {setOpenSuccessModal(false),setOpenFeedbackModal(false)}}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>

  );
};

export default Feedback;

"use client";

import React, { useEffect, useState } from "react";

interface Review {
  id: string;
  business_id: string;
  review_type_id: string;
  description: string;
  approved: boolean;
  feature?: string;
  recommendation?: boolean;
  user_name?: string;
  business_name?: string;
  user_avatar?: string;
  business_avatar?: string;
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("No access token found");

        const res = await fetch(
          "https://staging-api.qtpack.co.uk/business-reviews/list",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        console.log("API Response:", json); // Log full response

        // Ensure reviews is always an array
        if (Array.isArray(json.data)) {
          setReviews(json.data);
        } else if (Array.isArray(json)) {
          setReviews(json);
        } else {
          setReviews([]);
          console.warn("Reviews is not an array:", json);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center w-full items-center h-[400px]">
      <img src="/assets/images/favicon.png" className="w-15 h-15 animate-spin" alt="Favicon" />
    </div>
    );


  return (
    <div className="w-full min-h-screen bg-white px-6 py-5 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Reviews</h1>
        <p className="text-red-500 text-lg">{error}</p>


      {Array.isArray(reviews) && reviews.length > 0 ? (
        reviews.map((review) => (
          <section
            key={review.id}
            className="w-full mx-auto bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-2">
              {/* Left: User */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                  <img
                    src={review.user_avatar || "/assets/images/Profile.avif"}
                    className="w-6 h-6 rounded-full"
                    alt="profile"
                  />
                </div>
                <div className="text-gray-700 font-semibold">
                  {review.user_name || "Anonymous"}
                </div>
              </div>

              
            </div>

            {/* Question & Feature */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-3 items-center">
                <h3 className="text-sm text-gray-900 mb-2">What went well?</h3>
                <span className="text-sm text-gray-900 mb-2 bg-[#E5E5E7] px-3 py-1 rounded-full">
                  {review.feature || "N/A"}
                </span>
              </div>

              {review.recommendation && (
                <div className="Recommend flex gap-2 justify-between items-center bg-[#F0F1FF] px-3 py-1.5 rounded-full">
                  <img
                    src="/assets/images/thumbs-up.svg"
                    className="w-4 h-4"
                    alt="thumbs up"
                  />
                  <span className="text-sm text-[#0519CE]">Recommend</span>
                </div>
              )}
            </div>

            {/* Review Text */}
            <div className="py-4">
              <p>{review.description}</p>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <label
                htmlFor="questions-popup-toggle"
                className="px-5 py-3 text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
              >
                Private
              </label>
              <button
                type="button"
                className="px-7 py-3 text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700"
              >
                Approve & Post
              </button>
            </div>
          </section>
        ))
      ) : (
        <p className="text-gray-500">No reviews found.</p>
      )}
    </div>
  );
}

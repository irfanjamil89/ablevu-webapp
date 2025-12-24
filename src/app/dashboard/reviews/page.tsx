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
  created_by_name: string;
  business_name: string;
  business_logo: string;
  review_type_title: string;
  user_avatar?: string;
  business_avatar?: string;
}

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);


  const fetchReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}users/1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = await userRes.json();
      setUserRole(userData.user_role);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business-reviews/list`,
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
      const list = Array.isArray(json.data) ? json.data : [];
      // Ensure reviews is always an array
      setReviews(list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (reviewId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business-reviews/update/${reviewId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approved: true }),
        }
      );

      if (!res.ok) throw new Error("Failed to approve review");


      await fetchReviews();

      setOpenSuccessModal(true);
    } catch (err) {
      console.error(err);
    }
  };


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
                    src={review.user_avatar || "/assets/images/profile.avif"}
                    className="w-6 h-6 rounded-full"
                    alt="profile"
                  />
                </div>
                <div className="text-gray-700 font-semibold">
                  {review.created_by_name || "Anonymous"}
                </div>
                </div>

                {/* Right: Business */}
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">

                  <span className="text-gray-700 font-semibold ">{review.business_name ?? "Unknown Business"}</span>
                  {review.business_logo && (
                    <img
                      src={review.business_logo}
                      alt={review.business_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  )}
                </div>
            </div>

            {/* Question & Feature */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex gap-3 items-center">
                <h3 className="text-sm text-gray-900 mb-2">What went well?</h3>
                <span className="text-sm text-gray-900 mb-2 bg-[#E5E5E7] px-3 py-1 rounded-full">
                  {review.review_type_title || "N/A"}
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
              {(userRole === "Admin" || userRole === "Business") && (
                <>
                  {!review.approved ? (
                    <button
                      type="button"
                      onClick={() => approveReview(review.id)}
                      className="px-7 py-3 text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700"
                    >
                      Approve & Post
                    </button>
                  ) : (
                    <span className="px-5 py-3 text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full ">
                      Approved
                    </span>
                  )}
                </>
              )}
            </div>
          </section>
        ))
      ) : (
        <p className="text-gray-500">No reviews found.</p>
      )}
      {openSuccessModal && (
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

            <h2 className="text-lg font-bold mb-2">Approved Successfully!</h2>
            <p className="mb-4">The review has been approved & posted.</p>

            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => setOpenSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

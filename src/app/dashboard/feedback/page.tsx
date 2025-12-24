"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Feedback = {
  id: string;
  business_id: string | null;
  feedback_type_id: string;
  comment: string;
  approved_at: string | null;
  active: boolean;
  created_by: string | null;
  modified_by: string | null;
  created_at: string;
  modified_at: string;
};

type UserInfo = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_picture_url: string | null;
};

type FeedbackType = {
  id: string;
  name: string;
};

export default function Page() {
  const [feedbacks, setFeedbacks] = useState<
    (Feedback & { user?: UserInfo })[]
  >([]);
  const [feedbackTypes, setFeedbackTypes] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1) Feedback list
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data: Feedback[] = res.data?.data || [];

      // 2) Unique user IDs from created_by
      const userIds = Array.from(
        new Set(
          data
            .map((fb) => fb.created_by)
            .filter((id): id is string => Boolean(id))
        )
      );

      // 3) Fetch each user once using /users/me/:id
          const userMap: Record<string, UserInfo> = {};
          await Promise.all(
            userIds.map(async (id) => {
              try {
                const userRes = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/${id}`,
                  {
                    headers: {
                      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                  }
                );
                const u = userRes.data;
                userMap[id] = {
                  id: u.id,
                  first_name: u.first_name,
                  last_name: u.last_name,
                  email: u.email,
                  profile_picture_url: u.profile_picture_url,
                };
              } catch (e) {
                console.error("Error fetching user", id, e);
              }
            })
          );

      // 4) Attach user to each feedback
      const withUsers = data.map((fb) => ({
        ...fb,
        user: fb.created_by ? userMap[fb.created_by] : undefined,
      }));

      setFeedbacks(withUsers);
    } catch (err: any) {
      console.error("Error fetching feedback:", err);
      setError("Failed to load feedback.");
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbackTypes = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback-type/list`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = res.data;
      if (Array.isArray(data)) {
        setFeedbackTypes(data);
      } else if (Array.isArray(data?.data)) {
        setFeedbackTypes(data.data);
      } else if (Array.isArray(data?.items)) {
        setFeedbackTypes(data.items);
      }
    } catch (err) {
      console.error("Error fetching feedback types:", err);
      // optional: setError("Failed to load feedback types.");
    }
  };

  useEffect(() => {
    fetchFeedback();
    fetchFeedbackTypes();
  }, []);

  const formatDate = (iso: string | null) => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getUserName = (user?: UserInfo) => {
    if (!user) return "User";
    const full = `${user.first_name || ""} ${user.last_name || ""}`.trim();
    return full || "User";
  };

  const getFeedbackTypeName = (id: string) => {
    const ft = feedbackTypes.find((t) => t.id === id);
    return ft?.name || "Feedback";
  };



  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="w-full h-screen ">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">
          {/* Header Row */}
          <div className="w-full min-h-screen bg-white px-6 py-5">
            {/* Header */}
            <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">
                Feedback
              </h1>
            </div>

            {/* Table */}
            <div className="w-full bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <tbody className="space-y-3">
                    {loading ? (
                      <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                        <td className="px-4 py-6 text-center w-full text-gray-500">
                          Loading...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                        <td className="px-4 py-6 text-center w-full text-red-500">
                          {error}
                        </td>
                      </tr>
                    ) : feedbacks.length === 0 ? (
                      <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                        <td className="px-4 py-6 text-center w-full text-gray-500">
                          No feedback found.
                        </td>
                      </tr>
                    ) : (
                      currentFeedbacks.map((fb) => (
                        <tr
                          key={fb.id}
                          className="border rounded-lg border-gray-200 justify-between flex flex-row items-center"
                        >
                          {/* Feedback type name */}
                          <td className="px-4 py-2 flex items-center gap-2 font-medium">
                            {getFeedbackTypeName(fb.feedback_type_id)}
                          </td>

                          {/* Comment */}
                          <td className="px-4 py-2 text-md leading-tight w-[350px]">
                            <div className="space-y-2">
                              <p>{fb.comment}</p>
                            </div>
                          </td>

                          {/* User: name + email */}
                          <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                            <div className="flex gap-3 items-center">
                              <img
                                src={
                                  fb.user?.profile_picture_url ||
                                  "/assets/images/profile.avif"
                                }
                                alt="User"
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex flex-col text-sm">
                                <span>{getUserName(fb.user)}</span>
                                <span className="text-gray-600 font-medium">
                                  {fb.user?.email || ""}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-2 flex gap-3">
                            {formatDate(fb.approved_at || fb.created_at)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                {!loading && !error && currentFeedbacks.length > 0 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                    {/* Left side: Entry counter */}
                    <div className="text-sm text-gray-600">
                      Showing {startIndex + 1} to {Math.min(endIndex, currentFeedbacks.length)} of {currentFeedbacks.length} entries
                    </div>

                    {/* Right side: Pagination buttons */}
                    <div className="flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === 1
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, idx) => (
                          <React.Fragment key={idx}>
                            {page === '...' ? (
                              <span className="px-3 py-1 text-gray-500">...</span>
                            ) : (
                              <button
                                onClick={() => goToPage(page as number)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                                  ? "bg-[#0519CE] text-white"
                                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {page}
                              </button>
                            )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${currentPage === totalPages
                          ? "border-gray-200 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
                          }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

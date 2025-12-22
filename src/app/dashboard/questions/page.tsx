"use client";

import React, { useEffect, useState } from "react";

interface Question {
  id: string;
  business_id: string;
  question: string;
  answer?: string;
  active: boolean;
  created_at: string;
  created_by: string;
  modified_at?: string;
  modified_by?: string;
  show_name: boolean;
  created_by_name: string;
  business_name: string;
  business_logo: string;
}

export default function Page() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}business-questions/list`,
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
        console.log("Questions API Response:", json);

        if (Array.isArray(json.data)) {
          setQuestions(json.data);
        } else {
          setQuestions([]);
          console.warn("Questions data is not an array:", json);
        }
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };



    fetchQuestions();
  }, []);

  const handlePostAnswer = async (q: Question, answer: string) => {
    try {
      setUpdating(q.id);
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("No access token found");

      const userId = q.created_by; // or current logged-in user ID
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}business-questions/update/${q.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answer }),
        }
      );



      const json = await res.json();
      console.log("Update Response:", json);

      // Update local state
      setQuestions((prev) =>
        prev.map((item) =>
          item.id === q.id ? { ...item, answer: answer } : item
        )
      );
    } catch (err: any) {
      setError(err.message || "Failed to update answer");
    } finally {
      setUpdating(null);
      setError("");
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">All Questions</h1>

      {questions.length === 0 ? (
        <p className="text-gray-500">No questions found.</p>
      ) : (
        questions.map((q) => {
          return (
            <section
              key={q.id}
              className="w-full mx-auto bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
            >
              {/* Top Row */}
              <div className="flex items-center justify-between mb-4">
                {/* Left: User */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                    <img
                      src="/assets/images/Profile.avif"
                      className="w-6 h-6 rounded-full"
                      alt="profile"
                    />
                  </div>
                  <div className="text-gray-700 font-semibold">
                    {q.show_name && q.created_by_name
                      ? q.created_by_name
                      : "Anonymous"}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(q.created_at).toLocaleDateString()}
                  </div>
                </div>

                {/* Right: Business */}
                <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">

                  <span className="text-gray-700 font-semibold ">{q.business_name ?? "Unknown Business"}</span>
                  {q.business_logo && (
                    <img
                      src={q.business_logo}
                      alt={q.business_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Question */}
              <h2 className="text-xl font-semibold text-gray-900 mb-3">{q.question}</h2>
              {(userRole === "Contributor" || userRole === "User") && q.answer && (
                <p className="text-gray-700 mb-2">
                  {q.answer}
                </p>
              )}

              {error ? (
                <>
                  <p className="text-red-500 mb-2">{error}</p>
                </>

              ) : (
                <>

                </>
              )

              }



              {/* Textarea & Post Button */}
              {userRole === "Business" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePostAnswer(q, answers[q.id] ?? "");
                  }}
                >
                  <textarea
                    placeholder="Write your answer here"
                    value={answers[q.id] ?? q.answer ?? ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                    }
                    className="w-full border placeholder:text-gray-600 border-gray-300 rounded-xl p-4 text-sm hover:border-[#0519CE] focus:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none mb-4"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={updating === q.id}
                      className={`px-10 py-3 bg-[#0519CE] text-white font-semibold rounded-full text-sm ${updating === q.id ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0519CE]"
                        }`}
                    >
                      {updating === q.id ? "Posting..." : "Post"}
                    </button>
                  </div>
                </form>
              )}
            </section>
          );
        })
      )}
    </div>
  );
}


"use client";
import React, { useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [OpenSuccessModal, setOpenSuccessModal] = useState(false);

  const handleBecomeContributor = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}users/change-role`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          newRole: "Contributor"
        })
      });

      const data = await response.json();

      if (response.ok) {
        setOpenSuccessModal(true);
      } else {
        setMessage(data.message || 'Failed to update role. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" w-full flex justify-center items-center h-[400px]">
        <img
          src="/assets/images/favicon.png"
          className="w-15 h-15 animate-spin"
          alt="Favicon"
        />
      </div>
    );
  }


  return (
    <section className="w-full mt-10 py-20 bg-white">
      <div className="max-w-6xl mx-auto text-center px-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Become an AbleVu Contributor
        </h2>
        {/* First Paragraph */}
        <p className="text-gray-700 leading-relaxed mb-6">
          AbleVu Contributors play a key role in making communities more accessible by creating detailed accessibility profiles for local businesses. As a paid contributor, you&apos;ll visit businesses, document their accessibility features, and submit profiles for approval. If the business unlocks its profile with a yearly subscription, you&apos;ll earn $99 per approved listing.
        </p>
        {/* Second Paragraph */}
        <p className="text-gray-700 leading-relaxed mb-6">
          We are committed to ensuring that at least 50% of our contributors are people with disabilities, providing a flexible, financially rewarding opportunity for those who may face challenges with traditional employment or simply want extra income. Join us in making accessibility information more widely available while getting paid for your efforts!
        </p>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleBecomeContributor}
          disabled={loading}
          className="inline-block cursor-pointer px-10 py-3 rounded-full bg-[#0519CE] hover:bg-blue-700 text-white font-semibold transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Become Contributor
        </button>
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
            <p className="mb-4">You are now a volunteer contributor (one more step to get paid!)</p>
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg cursor-pointer"
              onClick={() => {
                setOpenSuccessModal(false);
                window.location.reload();
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

    </section>
  );
}
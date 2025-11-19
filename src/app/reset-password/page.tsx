"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ResetPassword from "../component/ResetPassword";

// Separate component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);

  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // Get token from URL and open modal
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setToken(token);
      setOpenResetPasswordModal(true);
    }
  }, [searchParams]);

  return (
    <>
      {openResetPasswordModal && token && (
        <ResetPassword
          token={token} 
          setOpenResetPasswordModal={setOpenResetPasswordModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}

      {openSuccessModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
            {/* Check Icon */}
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

            {/* Modal content */}
            <h2 className="text-lg font-bold mb-2">Password Reset Successful!</h2>
            <p className="mb-4">You can now login with your new password.</p>

            {/* OK Button */}
            <button
              className="bg-[#0519CE] text-white px-4 py-2 rounded-lg"
              onClick={() => {
                setOpenSuccessModal(false);
                window.location.href = "/";
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Main page component with Suspense boundary
const Page: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0519CE]"></div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default Page;
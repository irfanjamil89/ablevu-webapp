"use client";

import React, { useMemo, useState } from "react";

import AddBusinessModal from "@/app/component/AddBusinessModal";
import Login from "@/app/component/Login";
import Signup from "@/app/component/Signup";
import ForgotPassword from "@/app/component/Forgotpassword";
import Successmodal from "@/app/component/Successmodal";
import { useUser } from "@/app/component/UserContext";

export default function Package() {
  const { user, refreshUser } = useUser();

  const [OpenAddBusinessModal, setOpenAddBusinessModal] = useState(false);

  // ✅ CTA style alert
  const [OpenAlertModal, setOpenAlertModal] = useState(false);

  // ✅ Login flow modals (same as header/cta)
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const role = useMemo(() => user?.user_role || "Guest", [user]);
  const isNormalUser = role === "User";

  const handleBusinessCreated = () => {
    setOpenAddBusinessModal(false);
  };

  const handleLoginSuccess = () => {
    setOpenLoginModal(false);
    refreshUser?.();
  };

  const handleChoosePlan = () => {
    // ✅ Guest OR Normal User -> OPEN SAME ALERT (NO redirect)
    if (!user || isNormalUser) {
      setOpenAlertModal(true);
      return;
    }

    // ✅ Business / Contributor -> open AddBusinessModal
    setOpenAddBusinessModal(true);
  };

  return (
    <div>
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-30 pb-20 lg:text-[48px] font-['Montserrat']">
            List Your Business For More Customer Reach
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 lg:gap-10 md:gap-10 justify-center items-center">
            {/* Monthly */}
            <div className="relative w-full lg:max-w-[300px] lg:h-[450px] md:h-[400px] h-[400px] sm:max-w-[320px] md:max-w-[280px] max-w-[280px] mx-auto border border-[#00AEEF]/30 rounded-[40px] overflow-visible shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div className="absolute w-[240px] -top-6 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[14px]">
                Monthly
              </div>

              <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex-1 flex flex-col justify-between font-['Montserrat']">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[24px]">
                    $29
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm sm:text-base text-left">
                    {[
                      "Upload 30+ photos & videos.",
                      "Integrate your 360° virtual tour.",
                      "Answer customer questions",
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px]">
                        <img
                          src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754668447204x505861640092924350/checked%201.png"
                          className="w-5 h-5"
                          alt="check"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleChoosePlan}
                className="w-full bg-[#00AEEF] text-white font-medium p-[20px] rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-[#0095cc] focus:outline-none shadow-[0_6px_15px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_20px_rgba(0,174,239,0.55)] font-['Helvetica'] text-[16px]"
              >
                Choose Plan
              </button>
            </div>

            {/* Yearly */}
            <div className="relative -top-20 w-full lg:max-w-[300px] lg:h-[430px] md:h-[400px] h-[400px] sm:max-w-[320px] max-w-[300px] mx-auto bg-[#00AEEF] text-white rounded-[40px] shadow-lg flex flex-col justify-between border border-transparent">
              <div className="absolute w-[240px] -top-6 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[14px]">
                Yearly
              </div>

              <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[24px]">
                    $299
                  </h3>
                  <ul className="space-y-3 text-sm sm:text-base text-left">
                    {[
                      "Upload 30+ photos & videos.",
                      "Integrate your 360° virtual tour.",
                      "Answer customer questions",
                      "Most cost-effective",
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px]">
                        <img
                          src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754669098831x827540237841378800/checked%201%20%281%29.png"
                          className="w-5 h-5"
                          alt="check"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={handleChoosePlan}
                className="w-full bg-white text-[#00AEEF] font-medium p-[20px] -mb-2 rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-gray-100 focus:outline-none shadow-[0_6px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] font-['Helvetica'] text-[16px]"
              >
                Choose Plan
              </button>
            </div>

            {/* Custom */}
            <div className="relative w-full lg:max-w-[300px] lg:h-[450px] md:h-[500px] sm:h-[500px] h-[450px] sm:max-w-[320px] md:max-w-[280px] max-w-[280px] mx-auto border border-[#00AEEF]/30 rounded-[40px] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div className="absolute w-[240px] -top-6 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[14px]">
                Custom
              </div>

              <div className="px-6 sm:px-8 md:px-10 pt-12 pb-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-4 text-[24px]">
                    Destinations
                  </h3>
                  <ul className="space-y-3 text-gray-600 text-sm sm:text-base text-left mb-4 text-[14px]">
                    {[
                      "Upload 30+ photos & videos.",
                      "Integrate your 360° virtual tour.",
                      "Answer customer questions",
                    ].map((text, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px]">
                        <img
                          src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754668447204x505861640092924350/checked%201.png"
                          className="w-5 h-5"
                          alt="check"
                        />
                        {text}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-left leading-relaxed text-[12px]">
                    For Convention & Visitors Bureau, Entertainment Parks and Destination Marketing Organizations and more.
                  </p>
                  <p className="text-gray-500 text-left mt-2 leading-relaxed text-[12px]">
                    Contact us to discuss customized pricing and features for organizations managing multiple locations.
                  </p>
                </div>
              </div>

              <button
                onClick={handleChoosePlan}
                className="w-full bg-[#00AEEF] text-white font-medium p-[20px] rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-[#0095cc] focus:outline-none shadow-[0_6px_15px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_20px_rgba(0,174,239,0.55)] font-['Helvetica'] text-[16px]"
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Add Business Modal */}
      {OpenAddBusinessModal && (
        <AddBusinessModal
          setOpenAddBusinessModal={setOpenAddBusinessModal}
          onBusinessCreated={handleBusinessCreated}
        />
      )}

      {/* ✅ SAME CTA ALERT UI */}
      {OpenAlertModal && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8">
            <div className="flex justify-center mb-4">
              <div className="bg-red-600 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2 text-gray-800">
              Be a Business Owner
            </h2>
            <p className="mb-4 text-gray-600">
              Please signup or login as a business owner to add your business
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setOpenLoginModal(true);
                  setOpenAlertModal(false);
                }}
                className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Auth modals (same page) */}
      {openLoginModal && (
        <Login
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
        />
      )}

      {openSignupModal && (
        <Signup
          setOpenSignupModal={setOpenSignupModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}

      {OpenForgotPasswordModal && (
        <ForgotPassword
          setOpenForgotPasswordModal={setOpenForgotPasswordModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSuccessModal={setOpenSuccessModal}
        />
      )}

      {openSuccessModal && (
        <Successmodal
          setOpenSuccessModal={setOpenSuccessModal}
          setOpenLoginModal={setOpenLoginModal}
          setOpenSignupModal={setOpenSignupModal}
        />
      )}
    </div>
  );
}

"use client";
import React, { useState } from "react";

import AddBusinessModal from "./AddBusinessModal";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";

export default function Cta() {
  const [openAddBusinessModal, setOpenAddBusinessModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenAlertModal, setOpenAlertModal] = useState(false);




  const handleOpenPopup = () => {

    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    if (token) {
      setOpenAddBusinessModal(true);      // open AddBusiness modal
    } else {
      setOpenAlertModal(true);
    }
  };

  return (
    <div>
      <section
        className="relative lg:h-[550px] md:h-auto flex flex-col mt-20 items-center justify-center text-center py-20 px-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/images/Main.png')" }}
      >
        <div className="relative z-10 max-w-4xl custom-container">
          <h2 className="md:text-4xl lg:text-[48px] text-4xl font-bold text-white mb-5 font-['Roboto']">
            Join the Movement for Accessibility
          </h2>
          <p className="text-white/90 mb-8 text-base md:text-lg font-['Inter'] lg:text-[18px] lg:leading-[1.5]">
            Empower your city to be more inclusive and accessible for everyone.
            Take the first step toward creating a barrier-free community.
          </p>

          {/* ------ Buttons ------ */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-['Helvetica']">
            <button
              onClick={handleOpenPopup}
              className="bg-white text-black font-semibold py-3 px-16 cursor-pointer rounded-full shadow hover:bg-sky-50 transition text-[16px]"
            >
              Add your Business
            </button>

            <button
              onClick={handleOpenPopup}
              className="bg-white text-black font-semibold py-3 px-6 cursor-pointer rounded-full shadow hover:bg-sky-50 transition text-[16px]"
            >
              Become an Access-friendly City
            </button>
          </div>
        </div>
      </section>

      {/* Add Business Modal */}
      {openAddBusinessModal && (
        <AddBusinessModal setOpenAddBusinessModal={setOpenAddBusinessModal}/>
      )}

      {openLoginModal && (
        <Login setOpenLoginModal={setOpenLoginModal}

          setOpenSignupModal={setOpenSignupModal}
          setOpenForgotPasswordModal={setOpenForgotPasswordModal} />

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
      {OpenAlertModal && (<div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-600 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} > <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" /> </svg>
            </div>
          </div>
          <h2 className="text-lg font-bold mb-2 text-gray-800">Be a Business Owner</h2>
          <p className="mb-4 text-gray-600"> Please signup or login as a business owner to add your business</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => {setOpenLoginModal(true) , setOpenAlertModal(false)}} className="px-5 py-2 w-full border border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 cursor-pointer" > OK
            </button>
          </div>
        </div>
      </div>
      )}



    </div>
  );
}

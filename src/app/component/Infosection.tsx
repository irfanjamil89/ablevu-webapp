"use client";
import React, { useState } from "react";
import Link from "next/link";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./Forgotpassword";
import Successmodal from "./Successmodal";

export default function Infosection() {

  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [openSignupModal, setOpenSignupModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [OpenForgotPasswordModal, setOpenForgotPasswordModal] = useState(false);
  return (
    <div>
      <section className="relative mt-20 bg-[#F6F6F6] py-20">
        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">

          {/* Heading */}
          <span className="mb-2 inline-block rounded-full bg-[#26A8DC] px-4 py-2 text-xs font-semibold text-white/70 font-['Montserrat'] lg:text-[16px]">
            HOW IT WORKS
          </span>
          <h2 className="mb-20 md:text-4xl lg:text-[48px] text-4xl font-bold text-gray-800 font-['Roboto']">
            Get started in just 3 steps
          </h2>

          {/* Steps */}
          <div className="relative flex flex-col items-center lg:items-start md:items-start justify-between gap-10 md:flex-row lg:container lg:mx-auto">

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/f=auto,dpr=1,fit=contain/f1754652278519x961031211161504000/Rectangle%202566.png"
                  alt="Sign Up"
                  className="h-64 w-52 rounded-xl object-cover shadow-lg"
                />
                <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-bold text-gray-700 shadow-sm">
                  01
                </div>
              </div>
              <h3 className="mt-10 text-lg font-semibold text-gray-800 font-['Roboto'] lg:text-[24px]">
                Sign up
              </h3>
              <p className="mb-3 text-gray-600 font-['Montserrat'] pt-2 text-[18px] lg:text-[18px] md:text-sm sm:text-sm">
                Sign up as a contributor
              </p>
              <div onClick={() => setOpenSignupModal(true)}  className="rounded-full bg-[#26A8DC] px-6 py-2 text-sm font-semibold text-white cursor-pointer transition hover:bg-blue-500 font-['Montserrat'] lg:text-[16px]">
                Sign Up
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/f=auto,dpr=1,fit=contain/f1754653501869x494431534676114750/Rectangle%202568.png"
                  alt="Learn"
                  className="h-64 w-52 rounded-xl object-cover shadow-lg"
                />
                <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-bold text-gray-700 shadow-sm">
                  02
                </div>
              </div>
              <h3 className="mt-10 text-lg font-semibold text-gray-800 font-['Roboto'] lg:text-[24px]">
                Learn
              </h3>
              <p className="mb-3 text-gray-600 font-['Montserrat'] mt-2 text-[18px] lg:text-[18px] md:text-sm sm:text-sm">
                Learn how you can contribute
              </p>
              <Link href='https://us02web.zoom.us/webinar/register/WN_JjZF98d0QlehZOzf79a6og' className="mt-5 rounded-full bg-[#26A8DC] px-6 py-2 mb-3 text-sm font-semibold text-white transition hover:bg-blue-500 font-['Montserrat'] lg:text-[16px]">
                Join
              </Link>
              <p className="mt-1 text-gray-500 font-['Montserrat'] text-[18px] lg:text-[18px] md:text-sm sm:text-sm">
                Our Info Session
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/f=auto,dpr=1,fit=contain/f1754656188720x557747497789182100/Rectangle%202567.png"
                  alt="Start"
                  className="h-64 w-52 rounded-xl object-cover shadow-lg"
                />
                <div className="absolute -bottom-5 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-gray-300 bg-white text-sm font-bold text-gray-700 shadow-sm">
                  03
                </div>
              </div>
              <h3 className="mt-10 text-lg font-semibold text-gray-800 font-['Roboto'] lg:text-[24px]">
                Start
              </h3>
              <p className="text-sm text-gray-600 font-['Montserrat'] mt-2 lg:text-[16px]">
                Start making an impact
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Modals remain the same */}
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

  )
}

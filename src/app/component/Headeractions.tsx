"use client";
import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function HeaderActions() {
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
  const [openSignupModal, setOpenSignupModal] = useState<boolean>(false);


  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setOpenSignupModal(true)}
          className="rounded-full cursor-pointer border border-[rgba(5,25,206,1)] py-3 px-5 text-[rgba(5,25,206,1)] transition hover:bg-[rgba(5,25,206,1)] hover:text-white"
        >
          Sign Up
        </button>
        <button
          onClick={() => setOpenLoginModal(true)}
          className="rounded-full cursor-pointer bg-[rgba(5,25,206,1)] py-3 px-6 text-white transition hover:bg-[#0414a8]"
        >
          Log In
        </button>
      </div>

      {openLoginModal  && <Login setOpenLoginModal={setOpenLoginModal} setOpenSignupModal={setOpenSignupModal} />}
      {openSignupModal  && <Signup setOpenSignupModal={setOpenSignupModal} setOpenLoginModal={setOpenLoginModal} />}
    </>
  );
}

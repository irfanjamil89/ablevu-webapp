"use client";
import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function HeaderActions() {
  const [openModal, setOpenModal] = useState<"login" | "signup" | null>(null);

  const closeModal = () => setOpenModal(null);

  return (
    <>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setOpenModal("signup")}
          className="rounded-full border border-[rgba(5,25,206,1)] py-3 px-5 text-[rgba(5,25,206,1)] transition hover:bg-[rgba(5,25,206,1)] hover:text-white"
        >
          Sign Up
        </button>
        <button
          onClick={() => setOpenModal("login")}
          className="rounded-full bg-[rgba(5,25,206,1)] py-3 px-6 text-white transition hover:bg-[#0414a8]"
        >
          Log In
        </button>
      </div>

      {openModal === "login" && <Login onClose={closeModal} />}
      {openModal === "signup" && <Signup onClose={closeModal} />}
    </>
  );
}

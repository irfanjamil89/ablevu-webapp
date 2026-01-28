import React from "react";

export default function Booking() {
  return (
    <section className="relative mt-20 overflow-hidden">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-top opacity-80"
    style={{
      backgroundImage: "url('/assets/images/AbleVu_UseCaseDiagram.png')",
    }}
  ></div>

  {/* Content Wrapper */}
  <div className="relative mx-auto custom-container max-w-6xl px-4 lg:py-20 md:py-32 font-['Montserrat']">
    <h2 className="mb-16 text-center font-bold sm:mt-0 md:text-4xl lg:text-[48px] text-4xl">
      How to Get Started
    </h2>

    <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-end">
      {/* Card 1 */}
      <div className="flex flex-col items-center rounded-2xl border border-[#2BC0EE] bg-white px-2 py-4 shadow-md transition hover:shadow-lg md:p-8">
        <img
          className="rounded-[30px] p-4 h-48 w-56 object-cover"
          src="/assets/images/book-img.png"
          alt="Book"
        />
        <h3 className="mb-2 text-xl font-semibold">Book</h3>
        <p className="text-center text-base text-[#00B4FF]">
          Book an introductory <br /> call
        </p>
      </div>

      {/* Card 2 (highlighted) */}
      <div className="flex flex-col items-center rounded-2xl bg-[#00B4FF] px-2 py-4 text-white shadow-2xl md:p-8 lg:mb-20">
        <img
          className="rounded-[30px] p-4 h-48 w-56 object-cover"
          src="/assets/images/city-img.png"
          alt="City"
        />
        <h3 className="mb-2 text-xl font-semibold">City</h3>
        <p className="text-center text-base">Share your city details</p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col items-center rounded-2xl border border-[#2BC0EE] bg-white px-2 py-4 shadow-md transition hover:shadow-lg md:p-8">
        <img
          className="rounded-[30px] p-4 h-48 w-56 object-cover"
          src="/assets/images/city-img.jpg"
          alt="Growth"
        />
        <h3 className="mb-2 text-xl font-semibold">Growth</h3>
        <p className="text-center text-base text-[#00B4FF]">
          Partner with AbleVu to grow <br />
          accessibility
        </p>
      </div>
    </div>

    <div className="mt-12 text-center font-['Roboto']">
      <button className="rounded-full text-[16px] bg-[#00B4FF] px-8 py-3 font-medium text-white transition hover:bg-[#00B4FF] cursor-pointer">
        Book a Call
      </button>
    </div>
  </div>
</section>

  );
}

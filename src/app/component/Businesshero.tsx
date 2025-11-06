import React from "react";

export default function Businesshero() {
  return (
    <section
  className="relative min-h-[100vh] md:min-h-screen bg-cover lg:bg-center bg-no-repeat flex items-center z-10 bg-[#F6F6F6]"
  style={{
    backgroundImage: "url('/assets/images/hero-slider-1.jpg')",
  }}
>
  {/* Content container */}
  <div className="flex lg:justify-start md:justify-center justify-center relative z-10 w-full lg:container mt-10 py-20 lg:mx-auto px-6 md:px-12 lg:px-6 text-center md:text-left">
    <div className="text-black max-w-[700px] mx-auto md:mx-0">
      <h1 className="font-['Righteous'] text-5xl sm:text-5xl md:text-6xl md:text-center lg:text-[64px] font-normal my-[40px]">
        Make Your Business More Accessible Today
      </h1>
      <p className="font-['Montserrat'] lg:text-[18px] lg:leading-[1.5] lg:text-start font-medium md:text-3xl md:text-center sm:text-lg text-2xl my-[40px]">
        Connect with more customers by showcasing your accessibility features on
        AbleVu.
      </p>
      <div className="flex gap-4 lg:justify-start md:justify-center justify-center">
        <img
          src="/assets/images/Rectangle 32.png"
          alt="City Image 1"
          className="w-40 h-40 rounded-2xl object-contain"
        />
        <img
          src="/assets/images/Rectangle 30.png"
          alt="City Image 2"
          className="w-40 h-40 rounded-2xl object-contain"
        />
      </div>
    </div>
  </div>
</section>

  );
}

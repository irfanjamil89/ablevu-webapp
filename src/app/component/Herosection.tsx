import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[100vh] md:min-h-screen bg-cover bg-top bg-no-repeat flex items-center"
      style={{ backgroundImage: "url('/assets/images/hero.jpg')" }}
      aria-labelledby="hero-heading"
      role="region"
    >
      {/* Background overlay to ensure text contrast */}
      <div className="absolute inset-0 bg-black/15" aria-hidden="true"></div>

      <div className="flex lg:justify-start md:justify-center justify-center relative z-10 w-5/6 mx-auto  lg:mx-auto px-6 md:px-12 lg:px-6 text-center md:text-left">
        <div className="text-white max-w-[700px] mx-auto md:mx-0">
          {/* Accessible heading */}
          <h1
            id="hero-heading"
            className="font-['Montserrat'] text-5xl sm:text-5xl md:text-6xl lg:text-[64px] font-semibold my-[40px]"
          >
            AbleVu is Coming to Your City
          </h1>

          {/* Ensure text has sufficient contrast and is readable */}
          <p
            className="font-['Montserrat'] text-lg md:text-xl lg:text-[18px] lg:leading-[1.6] my-[40px]"
          >
            Help your community discover accessible places and experiences.
          </p>

          {/* Accessible button */}
          <button
            className=" cursor-pointer font-['Montserrat'] bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-300 focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            type="button"
            aria-label="Explore access-friendly cities"
          >
            Access-friendly Cities
          </button>
        </div>
      </div>
    </section>
  );
}

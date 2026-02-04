"use client";
import React from "react";

export default function HeroSection() {
  return (
    <section
      className="relative h-[600px] sm:h-[650px] md:h-[700px] lg:h-[750px] xl:h-[800px] bg-cover bg-top bg-no-repeat flex items-center"
      style={{ backgroundImage: "url('/assets/images/hero.jpg')" }}
      aria-labelledby="hero-heading"
      role="region"
    >
      {/* Enhanced background overlay with gradient for better text contrast */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" 
        aria-hidden="true"
      ></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-white max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-[650px] text-center lg:text-left mx-auto lg:mx-0">
          {/* Accessible heading with responsive typography and animation */}
          <h1
            id="hero-heading"
            className="font-['Montserrat'] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[64px] font-semibold mb-6 sm:mb-8 md:mb-10 leading-tight sm:leading-tight md:leading-[1.2] animate-fade-in-up"
          >
            AbleVu is Coming to Your City
          </h1>

          {/* Enhanced description with better spacing and readability */}
          <p
            className="font-['Montserrat'] text-base sm:text-lg md:text-xl lg:text-[18px] leading-relaxed sm:leading-relaxed md:leading-[1.6] mb-8 sm:mb-10 md:mb-12 text-gray-100 animate-fade-in-up animation-delay-200"
          >
            Help your community discover accessible places and experiences.
          </p>

          {/* Enhanced button with better interactions */}
                    {/* Accessible button */}
          <a href="/access-friendly-city" className="block"><button
            className=" cursor-pointer font-['Montserrat'] bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-lg transition duration-300 focus:outline-none focus:ring-offset-2 focus:ring-offset-transparent"
            type="button"
            aria-label="Explore access-friendly cities"
          >
            Top Cities To Visit
          </button>
          </a>
        </div>
      </div>
    </section>
  );
}
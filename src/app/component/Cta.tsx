import React from 'react'

export default function Cta() {
  return (
   <section
  className="relative lg:h-[550px] md:h-auto flex flex-col mt-20 items-center justify-center text-center py-20 px-0 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/assets/images/Main.png')" }}
>
  <div className="relative z-10 max-w-4xl">
    <h2 className="md:text-4xl lg:text-[48px] text-4xl font-bold text-white mb-5 font-['Roboto']">
      Join the Movement for Accessibility
    </h2>
    <p className="text-white/90 mb-8 text-base md:text-lg font-['Inter'] lg:text-[18px] lg:leading-[1.5]">
      Empower your city to be more inclusive and accessible for everyone.
      Take the first step toward creating a barrier-free community.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center font-['Helvetica']">
      <button className="bg-white text-black font-semibold py-3 px-16 cursor-pointer rounded-full shadow hover:bg-sky-50 transition text-[16px]">
        Add your Business
      </button>
      <button className="bg-white text-black font-semibold py-3 px-6 cursor-pointer rounded-full shadow hover:bg-sky-50 transition text-[16px]">
        Become an Access-friendly City
      </button>
    </div>
  </div>
</section>


  )
}

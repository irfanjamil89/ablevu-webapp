import React from 'react'

export default function Social() {
  return (
    <section
  className="bg-white bg-cover bg-center py-16 px-4 md:px-0 mt-10"
  style={{ backgroundImage: "url('/assets/images/Rectangle 2556.png')" }}
>
  <div className="max-w-7xl lg:container lg:mx-auto flex flex-col lg:flex-row md:flex-col items-center justify-center gap-10 overflow-x-hidden px-4">
    
    {/* Left-side image */}
    <div className="relative flex justify-center">
      <img
        src="/assets/images/Vector.png"
        alt="Wheelchair user working"
        className="w-[500px]"
      />
    </div>

    {/* Right-side content */}
    <div className="text-center md:text-left md:flex md:flex-col md:justify-center font-['Montserrat'] lg:w-[50%] md:w-[80%] lg:text-start md:text-center">
      <h2 className="font-bold text-[#1A1A1A] mb-8 lg:leading-[1.2] md:text-4xl lg:text-[48px] text-4xl">
        SOCIAL IMPACT PLUS <br /> ECONOMIC IMPACT
      </h2>
      <p className="text-gray-700 mb-8 mx-auto md:mx-0 text-[18px]">
        At AbleVu, we view accessibility as transparent sharing, not a
        checklist. A few profile pictures simplify decision-making,
        removing barriers to leaving home.
      </p>

      <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-8">
        {/* Stat 1 */}
        <div className="flex items-center space-x-4 w-80 flex-col lg:flex-row md:flex-row mx-auto lg:mx-0 md:mx-0">
          <div className="w-20 h-20 rounded-full border-4 border-[#2BC0EE] flex items-center justify-center text-black text-xl font-bold font-['Roboto']">
            58.2B
          </div>
          <p className="text-sm text-gray-700 md:w-40 text-center lg:text-start md:text-start mt-2">
            Is spent by travelers with mobility disabilities per year
          </p>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center space-x-4 w-80 flex-col lg:flex-row md:flex-row mx-auto lg:mx-0 md:mx-0">
          <div className="w-20 h-20 rounded-full border-4 border-[#2BC0EE] flex items-center justify-center text-black text-xl font-bold font-['Roboto']">
            96%
          </div>
          <p className="text-sm text-gray-700 md:w-40 text-center lg:text-start md:text-start mt-2">
            Of travelers with disabilities say they face accommodation
            problems
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

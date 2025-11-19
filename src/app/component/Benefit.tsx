import React from 'react'

export default function Benefit() {
  return (
   <section className="py-16 bg-white">
  <div className="lg:w-5/6 lg:mx-auto px-6">
    <div className="bg-gray-100 rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8 font-['Montserrat']">
      
      {/* Left: Heading */}
      <h2 className="font-bold text-gray-800 lg:w-1/2 md:w-1/3 text-center md:text-left md:text-4xl lg:text-[48px] text-4xl">
        BENEFITS
      </h2>

      {/* Right: 3 Boxes */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 w-full md:w-2/3 ">
        
        {/* Box 1 */}
        <div className="flex flex-col items-center justify-center text-center bg-[#39B249] text-white rounded-xl p-6 w-full sm:w-1/3 shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] cursor-pointer">
          <img
            src="/assets/images/Group.png"
            alt="Empower Icon"
            className="w-12 h-12 mb-4"
          />
          <p className="text-base font-medium leading-snug text-[16px]">
            Empower residents with accessible information
          </p>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col items-center justify-center text-center bg-[#F15730] text-white rounded-xl p-6 w-full sm:w-1/3 shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] cursor-pointer">
          <img
            src="/assets/images/Group (1).png"
            alt="Support Icon"
            className="w-12 h-12 mb-4"
          />
          <p className="text-base font-medium leading-snug text-[16px]">
            Support local businesses
          </p>
        </div>

        {/* Box 3 */}
        <div className="flex flex-col items-center justify-center text-center bg-[#26A8DC] text-white rounded-xl p-6 w-full sm:w-1/3 shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] cursor-pointer">
          <img
            src="/assets/images/Icon.png"
            alt="Inclusive Icon"
            className="w-12 h-12 mb-4"
          />
          <p className="text-base font-medium leading-snug text-[16px]">
            Foster an inclusive community
          </p>
        </div>

      </div>
    </div>
  </div>
</section>

  )
}

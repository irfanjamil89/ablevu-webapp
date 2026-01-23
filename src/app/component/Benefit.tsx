import React from 'react'

export default function Benefit() {
  return (
   <section className="py-16 bg-white">
  <div className="lg:w-5/6 lg:mx-auto px-6 custom-container">
    <div className="bg-gray-100 rounded-2xl p-8 md:px-0 lg:px-6 flex lg:flex-row flex-col md:flex-col sm:flex-col md:items-center md:justify-between sm:gap-0 gap-8 font-['Montserrat']">
      
      {/* Left: Heading */}
      <h2 className="font-bold text-gray-800 lg:w-[450px] md:w-full sm:w-full sm:mb-6 md:mb-6 lg:mb-0 text-center md:text-lcenter md:text-4xl lg:text-[48px] text-4xl">
        BENEFITS
      </h2>

      {/* Right: 3 Boxes */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 w-full md:px-6 lg:px-0">
        
        {/* Box 1 */}
        <div className="flex flex-col items-center justify-center text-center bg-[#39B249] text-white rounded-xl p-6 w-full sm:w-full shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] md:min-h-[150px] cursor-pointer">
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
        <div className="flex flex-col items-center justify-center text-center bg-[#F15730] text-white rounded-xl p-6 w-full sm:w-full shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] md:min-h-[150px] cursor-pointer">
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
        <div className="flex flex-col items-center justify-center text-center bg-[#26A8DC] text-white rounded-xl p-6 w-full sm:w-full shadow-md transition-transform hover:-translate-y-1 lg:min-h-[220px] cursor-pointer">
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

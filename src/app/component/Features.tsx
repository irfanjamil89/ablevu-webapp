import React from 'react'

export default function Features() {
  return (
    <section className="bg-white py-16">
  <div className="lg:container lg:mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-start justify-center">
    
    {/* Left-side image */}
    <div className="relative flex justify-center">
      <img
        src="/assets/images/business-img-2.png"
        alt="Wheelchair user working"
        className="w-[650px] object-cover"
      />
    </div>

    {/* Right Content */}
    <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 lg:gap-40 md:gap-10 sm:gap-10 gap-10 items-center lg:items-start">
      
      {/* Box 1 */}
      <div className="flex flex-col lg:items-start md:items-start sm:items-center items-center text-center lg:text-start md:text-start">
        <div className="text-[#0097E2] mb-3">
          <img src="/assets/images/reach 1.png" alt="Reach Icon" className="h-[50px] w-[50px]" />
        </div>
        <h3 className="font-['Inter'] font-semibold text-lg text-gray-800 mb-1 lg:text-[24px]">
          Experienced
        </h3>
        <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
          Reach a wider audience with inclusive listings
        </p>
      </div>

      {/* Box 2 */}
      <div className="flex flex-col lg:items-start md:items-start sm:items-center items-center text-center lg:text-start md:text-start">
        <div className="text-[#0097E2] mb-3">
          <img src="/assets/images/List.png" alt="List Icon" className="h-[50px] w-[50px]" />
        </div>
        <h3 className="font-['Inter'] font-semibold text-lg text-gray-800 mb-1 lg:text-[24px]">
          Mission Statement
        </h3>
        <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
          Highlight your accessibility features
        </p>
      </div>

      {/* Box 3 */}
      <div className="flex flex-col lg:items-start md:items-start sm:items-center items-center text-center lg:text-start md:text-start">
        <div className="text-[#0097E2] mb-3">
          <img src="/assets/images/brand 1.png" alt="Brand Icon" className="h-[50px] w-[50px]" />
        </div>
        <h3 className="font-['Inter'] font-semibold text-lg text-gray-800 mb-1 lg:text-[24px]">
          Bonded. Insured. Experienced.
        </h3>
        <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
          Increase trust and loyalty with your customers
        </p>
      </div>

      {/* Box 4 */}
      <div className="flex flex-col lg:items-start md:items-start sm:items-center items-center text-center lg:text-start md:text-start">
        <div className="text-[#0097E2] mb-3">
          <img src="/assets/images/easy-to-use 1.png" alt="Ease Icon" className="h-[50px] w-[50px]" />
        </div>
        <h3 className="font-['Inter'] font-semibold text-lg text-gray-800 mb-1 lg:text-[24px]">
          Employment
        </h3>
        <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
          Easy setup and management
        </p>
      </div>

    </div>
  </div>
</section>


  )
}

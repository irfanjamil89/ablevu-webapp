import React from 'react'

export default function Expand() {
  return (
    <section
  className="bg-cover bg-center px-4 py-16 font-['Montserrat'] md:px-20"
  style={{ backgroundImage: "url('/assets/images/Rectangle 2571.png')" }}
>
  <div className="mx-auto max-w-7xl justify-center text-center">
    {/* Section Heading */}
    <h2 className="mb-12 font-bold text-[#1A1A1A] md:text-4xl lg:text-[48px] text-4xl">
      Expanding Your Reach
    </h2>

    {/* Cards Grid */}
    <div className="flex flex-wrap justify-center items-center gap-5">
      {/* Card 1: Disability */}
      <div className="flex w-full max-w-xs flex-col items-start rounded-lg bg-white px-4 py-6 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <h3 className="text-sm lg:text-[18px] font-semibold">DISABILITY</h3>
            <p className="my-2 text-xl lg:text-[24px] font-bold text-[#1A1A1A]">
              1/6
            </p>
            <p className="text-xs lg:text-[16px] text-gray-500">Globally</p>
          </div>
          <img
            src="/assets/images/disabled 1.png"
            className="h-20 w-20"
            alt="Disability Icon"
          />
        </div>
      </div>

      {/* Card 2: Anxiety */}
      <div className="flex w-full max-w-xs flex-col items-start rounded-lg bg-white px-4 py-6 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <h3 className="text-sm lg:text-[18px] font-semibold">ANXIETY</h3>
            <p className="my-2 text-xl lg:text-[24px] font-bold text-[#1A1A1A]">
              301 Million
            </p>
            <p className="text-xs lg:text-[16px] text-gray-500">Individuals</p>
          </div>
          <img
            src="/assets/images/mental-disorder 1.png"
            className="h-20 w-20"
            alt="Anxiety Icon"
          />
        </div>
      </div>

      {/* Card 3: Elderly */}
      <div className="flex w-full max-w-xs flex-col items-start rounded-lg bg-white px-4 py-6 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <h3 className="text-sm lg:text-[18px] font-semibold">ELDERLY</h3>
            <p className="my-2 text-xl lg:text-[24px] font-bold text-[#1A1A1A]">
              1.6 Billion
            </p>
            <p className="text-xs lg:text-[16px] text-gray-500">Individuals</p>
          </div>
          <img
            src="/assets/images/old-people 1.png"
            className="h-20 w-20"
            alt="Elderly Icon"
          />
        </div>
      </div>

      {/* Card 4: Autism */}
      <div className="flex w-full max-w-xs flex-col items-start rounded-lg bg-white px-4 py-6 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <h3 className="text-sm lg:text-[18px] font-semibold">AUTISM</h3>
            <p className="my-2 text-xl lg:text-[24px] font-bold text-[#1A1A1A]">
              75 Million
            </p>
            <p className="text-xs lg:text-[16px] text-gray-500">Individuals</p>
          </div>
          <img
            src="/assets/images/autism 1.png"
            className="h-20 w-20"
            alt="Autism Icon"
          />
        </div>
      </div>

      {/* Card 5: Physical Disability */}
      <div className="flex w-full max-w-xs flex-col items-start rounded-lg bg-white px-4 py-6 shadow-md">
        <div className="flex w-full items-center justify-between">
          <div className="text-start">
            <h3 className="text-sm lg:text-[18px] font-semibold">
              PHYSICAL DISABILITY
            </h3>
            <p className="my-2 text-xl lg:text-[24px] font-bold text-[#1A1A1A]">
              269 Million
            </p>
            <p className="text-xs lg:text-[16px] text-gray-500">Individuals</p>
          </div>
          <img
            src="/assets/images/walking 1.png"
            className="h-20 w-20"
            alt="Physical Disability Icon"
          />
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

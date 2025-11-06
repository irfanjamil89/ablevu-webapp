import React from 'react'

export default function Citiesslider() {
  return (
    <section className="mx-0 relative z-100 md:mx-auto lg:container mt-0 md:-mt-28 flex w-full mt-10 md:w-10/12 lg:w-10/12 flex-col items-center justify-between gap-0 rounded-[25px] bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-10 lg:flex-row">
      {/* LEFT SIDE */}
      <div className="flex-1 text-center lg:text-left">
        <h2 className="font-['Helvetica'] mb-5 font-bold text-gray-900 md:text-4xl lg:text-[48px] text-4xl">
          Where to?
        </h2>
        <p className="font-['Helvetica'] text-base text-gray-800 md:text-lg lg:text-[18px]">
          Finding Accessibility-Transparent Cities and Businesses
        </p>
      </div>

      {/* RIGHT SIDE (PURE TAILWIND CONTINUOUS SLIDER) */}
      <div className="relative w-full flex-1 overflow-hidden">
        {/* Radio Buttons */}
        <input type="radio" name="slider" id="s1" className="hidden peer/s1" defaultChecked />
        <input type="radio" name="slider" id="s2" className="hidden peer/s2" />
        <input type="radio" name="slider" id="s3" className="hidden peer/s3" />

        {/* Slider Wrapper */}
        <div
          className="flex w-[330%] transition-transform duration-700
            peer-checked/s1:translate-x-0
            peer-checked/s2:-translate-x-[33.333%]
            peer-checked/s3:-translate-x-[66.666%]"
        >
          {/* All Cards (one continuous strip) */}
          <div className="flex w-full flex-shrink-0 justify-center font-['Helvetica'] gap-4 p-6">
            {/* Repeated City Cards */}
            {[
              { name: 'Mesa', businesses: 58 },
              { name: 'East Lansing', businesses: 21 },
              { name: 'Detroit', businesses: 32 },
              { name: 'Chicago', businesses: 25 },
              { name: 'Phoenix', businesses: 47 },
              { name: 'Austin', businesses: 63 },
              { name: 'Austin', businesses: 63 },
              { name: 'Austin', businesses: 63 },
              { name: 'Austin', businesses: 63 },
              { name: 'Austin', businesses: 63 },
            ].map((city, i) => (
              <div key={i} className="w-1/4 bg-white rounded-[20px] shadow-md">
                <img
                  src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=256,h=181,f=auto,dpr=0.75,fit=cover,q=75/f1744979714205x630911143129575800/Untitled%20design%20%2829%29.png"
                  alt={city.name}
                  className="rounded-t-[20px] w-full h-40 object-cover"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg text-gray-900">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.businesses} Businesses</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARROWS */}
        <div className="absolute inset-0 flex items-center justify-between px-4 text-gray-800">
          <label
            htmlFor="s1"
            className="text-3xl text-black font-bold cursor-pointer opacity-70 hover:opacity-100 peer-checked/s2:inline peer-checked/s3:inline hidden"
          >
            &#8592;
          </label>
          <label
            htmlFor="s2"
            className="text-3xl text-black font-bold cursor-pointer opacity-70 hover:opacity-100 peer-checked/s1:inline hidden"
          >
            &#8594;
          </label>
          <label
            htmlFor="s3"
            className="text-3xl text-black font-bold cursor-pointer opacity-70 hover:opacity-100 peer-checked/s2:inline hidden"
          >
            &#8594;
          </label>
        </div>
      </div>
    </section>

  )
}

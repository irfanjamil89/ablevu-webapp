import React from 'react'

export default function Citiesslider() {
  return (
    <div className="mx-auto relative space-y-5 z-100 w-full md:-mt-28 flex mt-10 md:w-10/12 lg:w-10/12 flex-col items-center justify-between gap-0 rounded-[25px] bg-white/70 p-6 shadow-2xl backdrop-blur-md md:p-10 lg:flex-row">

      {/* LEFT SIDE */}
      <div className="flex flex-wrap lg:w-1/4 text-center lg:text-left">
        <h2 className="w-full font-['Helvetica'] mb-5 font-bold text-gray-900 md:text-4xl lg:text-[48px] text-4xl">
          Where to?
        </h2>
        <p className="w-full font-['Helvetica'] text-base text-gray-800 md:text-lg lg:text-[18px]">
          Finding Accessibility-Transparent Cities and Businesses
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="relative w-full flex-2 overflow-hidden">

        {/* SLIDER WRAPPER */}
        <div className='flex w-[300%]'>

          {/* SLIDE 1 */}
          <div className="w-1/3 flex gap-1 justify-center px-2 sm:px-4 md:px-6">
            {cards()}
          </div>

        </div>
      </div>
    </div>
  );
}


/* CARD GENERATOR (RESPONSIVE CARD WIDTH) */
function cards() {
  const data = [
    { name: "Mesa", businesses: 58 },        // index 0
    { name: "East Lansing", businesses: 21 },// index 1
    { name: "Detroit", businesses: 32 },     // index 2
    { name: "Chicago", businesses: 25 },     // index 3
  ];

  return data.map((city, i) => (
    <div
      key={i}
      className={`
        bg-white rounded-[20px] shadow-md w-[22%] max-[1300px]:w-[30%] max-[768px]:w-[45%] max-[500px]:w-[90%]

        ${i === 3 ? "max-[1300px]:hidden" : ""}

        ${i === 0 ? "max-[768px]:hidden" : ""} 

        ${
          (i === 0 || i === 2 || i === 3) 
            ? "max-[500px]:hidden" 
            : ""
        } 
      `}
    >
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
  ));
}



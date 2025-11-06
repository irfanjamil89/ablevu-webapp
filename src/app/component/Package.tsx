import React from 'react'

export default function Package() {
  return (
    <section className="bg-white py-20">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    {/* Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-14 pb-20 lg:text-[48px] font-['Montserrat']">
      List Your Business For More Customer Reach
    </h2>

    {/* Pricing Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 lg:gap-10 md:gap-10 justify-center items-center">

      {/* Monthly Plan */}
      <div className="relative w-full lg:max-w-[300px] lg:h-[450px] md:h-[400px] h-[400px] sm:max-w-[320px] md:max-w-[280px] max-w-[280px] mx-auto border border-[#00AEEF]/30 rounded-[40px] overflow-visible shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        {/* Tab */}
        <div className="absolute w-[90%] -top-5 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 text-sm px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[18px]">
          Monthly
        </div>

        <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex-1 flex flex-col justify-between font-['Montserrat']">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[24px]">$29</h3>
            <ul className="space-y-3 text-gray-600 text-sm sm:text-base text-left">
              {[
                "Upload 30+ photos & videos.",
                "Integrate your 360° virtual tour.",
                "Answer customer questions",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px]">
                  <img
                    src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754668447204x505861640092924350/checked%201.png"
                    className="w-5 h-5"
                    alt="check"
                  />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="w-full bg-[#00AEEF] text-white font-medium p-[20px] rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-[#0095cc] focus:outline-none shadow-[0_6px_15px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_20px_rgba(0,174,239,0.55)] font-['Helvetica'] text-[16px]">
          Choose Plan
        </button>
      </div>

      {/* Yearly Plan (Highlighted) */}
      <div className="relative w-full lg:max-w-[300px] lg:h-[430px] md:h-[400px] h-[400px] sm:max-w-[320px] max-w-[300px] mx-auto bg-[#00AEEF] text-white rounded-[40px] shadow-lg flex flex-col justify-between border border-transparent">
        <div className="absolute w-[90%] -top-5 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 text-sm px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[18px]">
          Yearly
        </div>

        <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-[24px]">$299</h3>
            <ul className="space-y-3 text-sm sm:text-base text-left">
              {[
                "Upload 30+ photos & videos.",
                "Integrate your 360° virtual tour.",
                "Answer customer questions",
                "Most cost-effective",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px]">
                  <img
                    src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754669098831x827540237841378800/checked%201%20%281%29.png"
                    className="w-5 h-5"
                    alt="check"
                  />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="w-full bg-white text-[#00AEEF] font-medium p-[20px] -mb-2 rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-gray-100 focus:outline-none shadow-[0_6px_15px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] font-['Helvetica'] text-[16px]">
          Choose Plan
        </button>
      </div>

      {/* Custom Plan */}
      <div className="relative w-full lg:max-w-[300px] lg:h-[450px] md:h-[500px] sm:h-[500px] h-[450px] sm:max-w-[320px] md:max-w-[280px] max-w-[280px] mx-auto border border-[#00AEEF]/30 rounded-[40px] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
        <div className="absolute w-[90%] -top-5 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 text-sm px-6 py-3 rounded-full font-medium shadow-md font-['Helvetica'] lg:text-[18px]">
          Custom
        </div>

        <div className="px-6 sm:px-8 md:px-10 pt-12 pb-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-[24px]">Destinations</h3>
            <ul className="space-y-3 text-gray-600 text-sm sm:text-base text-left mb-4 text-[14px]">
              {[
                "Upload 30+ photos & videos.",
                "Integrate your 360° virtual tour.",
                "Answer customer questions",
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-2 text-[12px]">
                  <img
                    src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=24,h=24,f=auto,dpr=1,fit=contain/f1754668447204x505861640092924350/checked%201.png"
                    className="w-5 h-5"
                    alt="check"
                  />
                  {text}
                </li>
              ))}
            </ul>
            <p className="text-xs sm:text-sm text-gray-600 text-left leading-relaxed text-[12px]">
              For Convention & Visitors Bureau, Entertainment Parks and Destination Marketing Organizations and more.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 text-left mt-2 leading-relaxed text-[12px]">
              Contact us to discuss customized pricing and features for organizations managing multiple locations.
            </p>
          </div>
        </div>

        <button className="w-full bg-[#00AEEF] text-white font-medium p-[20px] rounded-[40px] cursor-pointer transition-all duration-300 hover:bg-[#0095cc] focus:outline-none shadow-[0_6px_15px_rgba(0,174,239,0.4)] hover:shadow-[0_8px_20px_rgba(0,174,239,0.55)] font-['Helvetica'] text-[16px]">
          Choose Plan
        </button>
      </div>
    </div>
  </div>
</section>

  )
}

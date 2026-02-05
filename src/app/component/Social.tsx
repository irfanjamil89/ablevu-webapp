import React from 'react'

export default function Social() {
  return (
    <section className="relative py-20 px-4 md:px-8 overflow-hidden">

      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/assets/images/Vector.png"
          alt="Background"
          className="w-full h-full object-cover opacity-10 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* left side - Large image card */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/assets/images/Vector.png"
                alt="Wheelchair user working"
                className="w-full h-auto object-cover"
              />

              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Making a difference</p>
                    <p className="text-sm font-semibold text-gray-800">Empowering accessible travel</p>
                  </div>
                  <div className="w-10 h-10 bg-[#2BC0EE] rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating decorative element */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#2BC0EE]/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#2BC0EE]/10 rounded-full blur-3xl"></div>
          </div>

          {/* right side - Stacked info cards */}
          <div className="space-y-6 font-['Montserrat']">

            {/* Main content card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl text-center md:text-left">
              <div className="inline-block bg-[#2BC0EE]/10 text-[#2BC0EE] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                Our Mission
              </div>

              <h2 className="font-bold text-[#1A1A1A] leading-narrow text-4xl lg:text-5xl mb-4">
                Social Impact Plus
                <span className="block text-[#2BC0EE] mt-2">Economic Impact</span>
              </h2>

              <p className="text-gray-600 text-base leading-relaxed">
                At AbleVu, we view accessibility as transparent sharing, not a
                checklist. A few profile pictures simplify decision-making,
                removing barriers to leaving home.
              </p>
            </div>

            {/* Stats cards - horizontal */}
            <div className="flex flex-col sm:flex-row gap-6">

              {/* Stat 1 */}
              <div className="flex-1 bg-gradient-to-br from-[#2BC0EE] to-[#1EA5CC] rounded-2xl p-6 shadow-lg text-white relative overflow-hidden group hover:shadow-2xl transition-shadow">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 md:text-left text-center">
                  <div className="text-4xl font-bold font-['Roboto'] mb-2">58.2B</div>
                  <p className="text-sm text-white/90 leading-tight">
                    Is spent by travelers with mobility disabilities per year
                  </p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex-1 bg-white border-2 border-[#2BC0EE] rounded-2xl p-6 shadow-lg relative overflow-hidden group hover:shadow-2xl transition-shadow">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#2BC0EE]/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 md:text-left text-center">
                  <div className="text-4xl font-bold text-[#2BC0EE] font-['Roboto'] mb-2">96%</div>
                  <p className="text-sm text-gray-700 leading-tight">
                    Of travelers with disabilities say they face accommodation problems
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
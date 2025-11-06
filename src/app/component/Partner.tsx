import React from 'react'

export default function Partner() {
  return (
    <section className="bg-white py-16">
  {/* Partner Logos */}
  <div className="lg:container lg:mx-auto bg-gray-100 rounded-2xl flex flex-wrap justify-center lg:justify-between items-center gap-10 py-10 px-10">
    <img
      src="/assets/images/brand-1-Photoroom.png"
      alt="Logo 1"
      className="h-12 object-cover"
    />
    <img
      src="/assets/images/brand-2.png"
      alt="Logo 2"
      className="h-[80px] object-cover"
    />
    <img
      src="/assets/images/brand-3-Photoroom.png"
      alt="Logo 3"
      className="h-[80px] object-cover"
    />
    <img
      src="/assets/images/brand-4.png"
      alt="Logo 4"
      className="h-12 object-cover"
    />
    <img
      src="/assets/images/brand-5-Photoroom.png"
      alt="Logo 5"
      className="h-[100px] object-cover"
    />
  </div>
</section>

  )
}

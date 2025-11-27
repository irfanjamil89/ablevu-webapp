import React from 'react'

export default function Page() {
  return (
    <section className="w-full mt-10 py-20 bg-white">
  <div className="max-w-6xl mx-auto text-center px-6">

    {/* <!-- Title --> */}
    <h2 className="text-2xl font-semibold text-gray-900 mb-6">
      Become an AbleVu Contributor
    </h2>

    {/* <!-- First Paragraph --> */}
    <p className="text-gray-700 leading-relaxed mb-6">
      AbleVu Contributors play a key role in making communities more accessible by creating detailed accessibility profiles for local businesses. As a paid contributor, you’ll visit businesses, document their accessibility features, and submit profiles for approval. If the business unlocks its profile with a yearly subscription, you’ll earn $100 per approved listing.
    </p>

    {/* <!-- Second Paragraph --> */}
    <p className="text-gray-700 leading-relaxed mb-6">
      We are committed to ensuring that at least 50% of our contributors are people with disabilities, providing a flexible, financially rewarding opportunity for those who may face challenges with traditional employment or simply want extra income. Join us in making accessibility information more widely available while getting paid for your efforts!
    </p>

    {/* <!-- Button --> */}
    <a
      href="#"
      className="inline-block cursor-pointer px-10 py-3 rounded-full bg-[#0519CE] hover:bg-blue-700 text-white font-semibold transition text-sm"
    >
      Become Contributor
    </a>

  </div>
</section>

  )
}

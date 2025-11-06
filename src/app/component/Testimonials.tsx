import React from 'react'

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
  <div className="max-w-7xl mx-auto text-center px-6 font-['Raleway']">
    {/* Testimonial Image */}
    <img
      src="/assets/images/Ellipse 10.png"
      alt="Profile"
      className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
    />

    {/* Testimonial Text */}
    <p className="text-gray-700 text-lg leading-relaxed mb-8 text-[18px]">
      AbleVu is such a great accessibility tool, it allows me to see an
      environment before I go. This is important to me because I am a
      wheelchair user and it allows me to know that I will be able to get
      around and access the areas that I need to go and if I do see anything
      that I might have an issue with I can plan accordingly. I really wish
      more places had such in-depth visual tours.
    </p>

    {/* Name and Title */}
    <h3 className="font-['Montserrat'] text-[18px] font-semibold text-gray-900">
      Joe Rezmer
    </h3>
    <p className="font-['Montserrat'] text-[16px] text-gray-500 my-2">
      Forward Creative Manager
    </p>

    {/* Stars */}
    <div className="flex justify-center space-x-1 text-yellow-400 mb-12">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M12 .587l3.668 7.431L24 9.753l-6 5.847L19.335 24 12 20.202 4.665 24 6 15.6 0 9.753l8.332-1.735z" />
        </svg>
      ))}
    </div>
  </div>
</section>

  )
}

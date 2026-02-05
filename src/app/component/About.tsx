import React from 'react'

export default function About() {
  return (
    <section className="bg-white py-12 sm:mb-0 sm:px-0 md:mb-[-150px] md:px-20 lg:container lg:mx-auto lg:mb-[-150px] lg:px-4 lg:w-[1200px]">
  <div
    className="relative box-content flex flex-col-reverse items-center justify-center overflow-visible rounded-2xl bg-cover bg-center bg-no-repeat px-6 py-10 text-white md:flex-row md:items-start md:justify-between md:px-12"
    style={{
      backgroundImage:
        "url('/assets/images/f713478d42be6596107cbda49abb704fdb0de5b2.png')",
    }}
  >
    {/* Text Content */}
    <div className="z-10 text-center lg:w-4x1 md:w-2/3 md:text-left">
      <h2 className="mb-4 font-['Roboto'] text-3xl lg:text-[36px] font-bold">
        Meet Meegan Winters
      </h2>
      <p className="font-['Montserrat'] text-base leading-relaxed lg:text-[16px]">
        Meegan Winters is the CEO/Founder of AbleVu. Her experience as a special
        education teacher teaching students with Autism, paired with having a
        best friend who was a wheelchair user, sparked the idea to start AbleVu.
        Meegan has worked with individuals with special needs and autism for
        over 20 years. Her passion and goodwill to make the world accessible for
        all is the force that drives us toward success.
      </p>
    </div>

    {/* Image (Overflow Style) */}
    <div className="mt-10 transform md:absolute md:top-1/2 md:right-12 md:mt-0 md:w-1/3 md:-translate-y-1/2">
      <img
        src="/assets/images/image 22.png"
        alt="Meegan Winters"
        className="mx-auto max-w-[300px] sm:mt-[-100px] md:mt-[30px] lg:max-w-[350px] md:max-w-[280px] lg:mt-[-63px]"
      />
    </div>
  </div>
</section>

  )
}

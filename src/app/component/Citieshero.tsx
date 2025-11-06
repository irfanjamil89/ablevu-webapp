import React from 'react'

export default function Citieshero() {
  return (
    <section
  className="min-h-screen bg-cover bg-top bg-no-repeat flex items-center overflow-hidden"
  style={{ backgroundImage: "url('/assets/images/Untitled design.png')" }}
>
  {/* Content container */}
  <div className="w-full lg:container lg:mx-auto px-6 md:px-12 lg:px-6 text-center md:text-left py-16 md:py-24 lg:py-32">
    <div className="text-white max-w-[800px] mx-auto md:mx-0">
      
      <h1 className="font-['Righteous'] text-3xl sm:text-4xl md:text-5xl lg:text-[64px] font-normal my-6 md:my-10 leading-tight">
        What is an AbleVu Access-friendly City?
      </h1>

      <p className="font-['Montserrat'] text-base sm:text-lg md:text-xl lg:text-[18px] lg:leading-[1.6] font-medium my-6 md:my-10">
        An AbleVu Accessible City is a community that prioritizes accessibility through transparency — 
        not compliance. It represents a local effort to help individuals of all abilities plan ahead 
        by providing detailed, easy-to-find information about public spaces. These profiles help people 
        “know before they go,” offering peace of mind and building trust with potential visitors. 
        To be recognized as an AbleVu Accessible City, a minimum of 15 locations — such as businesses, 
        attractions, parks, schools, or government buildings — must have profiles created on AbleVu.
      </p>

      <button
        className="flex font-['Montserrat'] mx-auto md:mx-0 bg-transparent border border-white cursor-pointer text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:bg-white hover:text-black"
      >
        Access-friendly Cities
      </button>
    </div>
  </div>
</section>

  )
}

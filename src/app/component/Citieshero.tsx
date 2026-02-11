import React from 'react'

export default function Citieshero() {
  return (
        <section
      className="relative h-[650px] sm:h-[650px] md:h-[650px] xl:h-[700px] w-full bg-cover bg-top bg-no-repeat flex items-end justify-center"
      style={{ backgroundImage: "url('/assets/images/citieshero.png')" }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute z-1 inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/50"></div>
  {/* Content container */}
  <div className="w-full z-2 lg:w-5/6 lg:mx-auto px-2 md:px-12 lg:px-6 text-center md:text-left pt-16 pb-5 md:pt-24 md:pb-10 lg:py-32">
    <div className="text-white text-center">
      
      <h1 className="font-['Montserrat'] text-3xl sm:text-4xl md:text-4xl lg:text-[44px] font-semibold my-6 md:my-10 leading-tight">
        What is an AbleVu Access-Friendly City?
      </h1>

      <p className="font-['Montserrat'] text-base sm:text-lg md:text-xl lg:text-[15px] lg:leading-[1.6] font-medium my-6 md:my-10">
        An AbleVu Accessible City is a community that prioritizes accessibility through transparency — 
        not compliance. It represents a local effort to help individuals of all abilities plan ahead 
        by providing detailed, easy-to-find information about public spaces. These profiles help people 
        “know before they go,” offering peace of mind and building trust with potential visitors. 
        To be recognized as an AbleVu Accessible City, a minimum of 15 locations — such as businesses, 
        attractions, parks, schools, or government buildings — must have profiles created on AbleVu.
      </p>

      <button
        className="flex font-['Montserrat'] mx-auto  bg-[rgba(5,25,206,1)] border border-transparent hover:border-white  cursor-pointer text-white font-semibold py-3 px-8 rounded-lg transition duration-300 hover:bg-transparent hover:text-white"
      >
        Access-Friendly Cities
      </button>
    </div>
  </div>
</section>

  )
}

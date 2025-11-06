import React from 'react'

export default function Contributorhero() {
  return (
    <section
  className="relative lg:h-[786px] md:h-[950px] sm:h-[950px] h-[950px] bg-cover bg-top bg-no-repeat flex items-center"
  style={{
    backgroundImage:
      "url('https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=3072,f=auto,dpr=1,fit=contain/f1754901025432x967462609251017000/hero%20shape%207.png')",
  }}
>
  {/* Content container */}
  <div className="flex lg:justify-start md:justify-center justify-center relative z-10 w-full lg:container lg:mx-auto px-6 md:px-12 lg:px-6 text-center md:text-left">
    <div className="mx-auto max-w-[830px] text-black md:mx-0">
      <h1 className="font-['Righteous'] text-5xl sm:text-5xl md:text-6xl md:text-center lg:text-[64px] lg:md:text-start font-normal mb-[20px]">
        Become an
      </h1>
      <h1 className="font-['Righteous'] text-5xl sm:text-5xl md:text-6xl md:text-center lg:text-[64px] lg:md:text-start font-normal mt-[20px]">
        Accessibility Contributor
      </h1>
      <p className="font-['Montserrat'] lg:text-[18px] lg:leading-[1.5] lg:text-start font-medium md:text-3xl md:text-center sm:text-3xl sm:text-lg text-2xl my-[40px]">
        Help people experience better accessibility by sharing local knowledge.
      </p>
      <button className="flex font-['Montserrat'] lg:mx-0 md:mx-auto sm:mx-auto mx-auto bg-[rgba(255,255,255,0.01)] border border-black cursor-pointer text-black font-semibold py-3 px-6 sm:px-8 rounded-lg transition duration-300 hover:border-white hover:bg-white">
        Sign up as a contributor
      </button>
    </div>
  </div>
</section>


  )
}

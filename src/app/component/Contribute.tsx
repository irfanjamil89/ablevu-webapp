import React from 'react'

export default function Contribute() {
  return (
    
  <section className="relative bg-[#F6F6F6] py-16">
  <div className="mx-auto flex max-w-7xl flex-col justify-center items-center gap-10 px-6 md:flex-row lg:container lg:mx-auto">
    
    {/* Left Image */}
    <div className="relative flex justify-center">
      <img
        src="https://411bac323421e63611e34ce12875d6ae.cdn.bubble.io/cdn-cgi/image/w=768,h=627,f=auto,dpr=1,fit=contain/f1754645620338x336164258344977560/Rectangle%202564.png"
        alt="Why Contribute"
        className="rounded-3xl w-[500px]"
      />
    </div>

    {/* Right Content */}
    <div className="text-center md:w-1/2 md:text-left">
      <h2 className="mb-8 text-center font-['Montserrat'] md:text-4xl lg:text-[48px] text-4xl font-bold text-gray-900">
        Why Contribute
      </h2>

      <div className="flex flex-col justify-between gap-8 pt-5 md:flex-row md:items-start font-['Montserrat']">
        
        {/* Box 1 */}
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-4 rounded-full bg-[#008CFF]/10 p-3 text-[#008CFF]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 text-[16px] lg:text-[16px] md:text-sm sm:text-sm">
            Make a meaningful impact
          </p>
        </div>

        {/* Box 2 */}
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-4 rounded-full bg-[#008CFF]/10 p-3 text-[#008CFF]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 text-[16px] lg:text-[16px] md:text-sm sm:text-sm">
            Share valuable insights
            <br />
            about local businesses
          </p>
        </div>

        {/* Box 3 */}
        <div className="flex flex-col items-center md:items-start">
          <div className="mb-4 rounded-full bg-[#008CFF]/10 p-3 text-[#008CFF]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-700 text-[16px] lg:text-[16px] md:text-sm sm:text-sm">
            Build a more inclusive world
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

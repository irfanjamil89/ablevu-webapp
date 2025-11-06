import React from "react";

export default function Feature() {
  return (
    <section
  className="bg-no-repeat bg-cover bg-top py-20 mt-20"
  style={{
    backgroundImage: "url('/assets/images/Vector 2.png')",
  }}
>
  <div className="lg:container lg:mx-auto max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
    
    {/* Left-side image */}
    <div className="relative flex justify-center">
      <img
        src="/assets/images/image-22-(1) 1.png"
        alt="Wheelchair user working"
        className="w-[650px] h-auto object-contain"
      />
    </div>

    {/* Right Content */}
    <div className="max-w-6xl flex flex-col gap-8">
      
      {/* Box 1 */}
      <div className="flex items-center gap-4 flex-col lg:flex-row md:flex-row text-center lg:text-start md:text-start">
        <div
          className="w-auto h-[70px] bg-no-repeat bg-contain p-3 flex items-center justify-center"
          style={{
            backgroundImage: "url('/assets/images/Ellipse 16.png')",
          }}
        >
          <img
            src="/assets/images/jewelry-shop.png"
            alt="Business Icon"
            className="w-[40px] h-[40px] object-contain"
          />
        </div>
        <div className="pe-2">
          <h3 className="font-['Roboto'] text-lg font-bold text-gray-900 lg:text-[24px] mb-2">
            Showcase Your Business’s Accommodations
          </h3>
          <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
            Use the AbleVu map to highlight your business accessibility features
            to potential visitors.
          </p>
        </div>
      </div>

      {/* Box 2 */}
      <div className="flex items-center gap-4 flex-col lg:flex-row md:flex-row text-center lg:text-start md:text-start">
        <div
          className="w-auto h-[70px] bg-no-repeat bg-contain p-3 flex items-center justify-center"
          style={{
            backgroundImage: "url('/assets/images/Ellipse 16.png')",
          }}
        >
          <img
            src="/assets/images/info 1.png"
            alt="Info Icon"
            className="w-[40px] h-[40px] object-contain"
          />
        </div>
        <div className="pe-2">
          <h3 className="font-['Roboto'] text-lg font-bold text-gray-900 lg:text-[24px] mb-2">
            Inform Visitors Before They Arrive
          </h3>
          <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
            Provide essential accessibility details so visitors can plan with
            confidence before they arrive.
          </p>
        </div>
      </div>

      {/* Box 3 */}
      <div className="flex items-center gap-4 flex-col lg:flex-row md:flex-row text-center lg:text-start md:text-start">
        <div
          className="w-auto h-[70px] bg-no-repeat bg-contain p-3 flex items-center justify-center"
          style={{
            backgroundImage: "url('/assets/images/Ellipse 16.png')",
          }}
        >
          <img
            src="/assets/images/user-engagement.png"
            alt="Engagement Icon"
            className="w-[40px] h-[40px] object-contain"
          />
        </div>
        <div className="pe-2">
          <h3 className="font-['Roboto'] text-lg font-bold text-gray-900 lg:text-[24px] mb-2">
            Engage Directly with Visitors
          </h3>
          <p className="font-['Montserrat'] text-gray-600 text-sm lg:text-[16px]">
            Our Q&amp;A commenting feature lets your business directly address
            visitor accessibility questions.
          </p>
        </div>
      </div>

    </div>
  </div>
</section>

  );
}

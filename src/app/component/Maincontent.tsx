import React from 'react'
import VirtualTour from './VirtualTour';

interface MaincontentProps {
  businessId: string;
}

export default function Maincontent({ businessId }: MaincontentProps) {
  return (
    <div className='px-10 py-7 w-7/10'>
      <VirtualTour/>
      <div className="audio my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Audio Tours</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/audio.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Audio Tour to shown</p>
        </div>
      </div>

      <div className="property my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Property Images</h3>
        <div className="flex flex-wrap gap-x-2 items-center">
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <img src="/assets/images/pool.jpg" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
        </div>
      </div>

      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Accessibility Features</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Features to shown</p>
        </div>
      </div>

      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Partner Certifications/Programs</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Active Partnerships</p>
        </div>
      </div>

      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Reviews</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/link.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No reviews to show</p>
        </div>
      </div>


      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Accessibility Questions</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Questions to shown</p>
        </div>
      </div>
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Additional Accessibility Resources</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/link.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Resources to show</p>
        </div>
      </div>
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Accessibility Media</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Media to shown</p>
        </div>
      </div>
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Custom Sections</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/blank.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Custom section to shown</p>
        </div>
      </div>




    </div>

  )
}

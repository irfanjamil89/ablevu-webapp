import React from 'react'

export default function Maincontent() {
  return (
    <div className='px-10 py-7 w-7/10'>
      <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full ">

        <h3 className="text-xl font-[600] mb-4" >Virtual Tours</h3>
        <p >Explore the location virtually to make informed decisions and plan your visit</p>
        <p className='text-xs mt-1'>Interested in adding an accessibility virtual tour? Email <a href="mailto:info@ableeyes.org" ><span className="text-[#0205d3]">info@ableeyes.org</span></a> for more information</p>
        <div className="tours mt-6 flex flex-wrap justify-between gap-5">
          <div className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
              <div className="icon flex items-center">
                <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
                <p>Enterance</p>
              </div>
              <div className="link">
                <a href="https://maps.app.goo.gl/4bQdcAEkZk3fqpQH9">View</a>
              </div>
          </div>
          <div className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
              <div className="icon flex items-center">
                <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
                <p>Enterance</p>
              </div>
              <div className="link">
                <a href="https://maps.app.goo.gl/4bQdcAEkZk3fqpQH9">View</a>
              </div>
          </div>
          <div className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
              <div className="icon flex items-center">
                <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
                <p>Enterance</p>
              </div>
              <div className="link">
                <a href="https://maps.app.goo.gl/4bQdcAEkZk3fqpQH9">View</a>
              </div>
          </div>
          <div className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
              <div className="icon flex items-center">
                <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
                <p>Enterance</p>
              </div>
              <div className="link">
                <a href="https://maps.app.goo.gl/4bQdcAEkZk3fqpQH9">View</a>
              </div>
          </div>
        </div>
      </div>

      <div className="audio my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Audio Tours</h3>
        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
            <img src="/assets/images/audio.avif" alt="" />
            <p className="mt-4 font-medium text-[#6d6d6d]">No Audio Tour to shown</p>
        </div>
      </div>

      <div className="property my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <h3 className="text-xl font-[600] mb-4" >Property Images</h3>
        <div className="flex flex-wrap gap-x-3 items-center">
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

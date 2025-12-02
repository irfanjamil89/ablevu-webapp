import React from 'react'

export default function VirtualTour() {
  return (
    <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full ">

        <h3 className="text-xl font-[600] mb-4" >Virtual Tours</h3>
        <p >Explore the location virtually to make informed decisions and plan your visit</p>
        <p className='text-xs mt-1'>Interested in adding an accessibility virtual tour? Email <a href="mailto:info@ableeyes.org" ><span className="text-[#0205d3]">info@ableeyes.org</span></a> for more information</p>
        <div className="tours mt-6 flex flex-wrap justify-between gap-3">
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
  )
}

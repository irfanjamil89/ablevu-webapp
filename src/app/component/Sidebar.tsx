import React from 'react'
import { AiOutlineLike } from "react-icons/ai";
import { BsBookmark } from "react-icons/bs";
import { BsArrowLeft } from "react-icons/bs";
import { BsLink } from "react-icons/bs";
import { BsEnvelope } from "react-icons/bs";
import { BsTelephone } from "react-icons/bs";
import { BsPin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsInstagram } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
export default function Sidebar() {
   return (
      <div className='w-3/10 h-[200vh] px-10 py-7 border-r border-solid  border-[#e5e5e7]'>
         <div className="head flex items-center justify-between">
            <div className="icon flex items-center text-2xl font-[600]">
               <button className=" cursor-pointer">
                     <BsArrowLeft className="w-6 h-6 mr-3 " />
               </button>
               <h3>Business Details</h3>
            </div>
            <div className="button cursor-pointer rounded-4xl border font-[600] border-[#e5e5e7] py-3 px-4 flex items-center"><img src="/assets/images/share.png" alt="Share Icon" className="w-5 h-5 mr-3" /> Share</div>
         </div>
         <div className="logo items-center justify-center border border-solid  rounded-3xl border-[#e5e5e7] mt-6">
            <img src="/assets/images/businesslogo.png" alt="Share Icon" className="w-80 m-auto" />
         </div>
         <div className="info py-8 ">
            <div className="flex items-center justify-between ">
               <h3 className="text-2xl font-[600]" >12 West Brewing</h3>
               <div className="flex">
                  <button className="flex items-center gap-1 mr-3 py-1 px-3 rounded-2xl text-[#0205d3] bg-[#f0f1ff] transition-colors cursor-pointer">
                     <AiOutlineLike className="w-5 h-5" />
                     <span>2</span>
                  </button>
                  <button className="flex items-center gap-2 text-[#0205d3] transition-colors cursor-pointer">
                     <BsBookmark className="w-5 h-5" />
                   
                  </button>
               </div>
            </div>
            <div className="flex items-center mt-4 border-b pb-6 border-[#e5e5e7] ">
               <p className="mr-4 text-gray-500 ">Categories</p>
               <p className='bg-[#f8f9fb] py-1 px-3 rounded-2xl text-gray-700'><span>Restaurant</span></p>
            </div>
         </div>
         <div className="details">
            <h3 className="text-xl font-[600] mb-4" >Details</h3>
            <p className='flex items-center mb-3'><BsLink className="w-7 h-7 mr-3  rotate-130 text-[#0205d3]" /><a href="http://12westbrewing.com/mesa" className="block"> http://12westbrewing.com/mesa</a></p>
            <p className='flex items-center mb-3'><BsEnvelope className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="mailto:downtown12west@gmail.com" className="block"> downtown12west@gmail.com</a></p>
            <p className='flex items-center mb-3'><BsTelephone className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="tel:14805087018" className="block"> +14805087018</a></p>
            <p className='flex items-center mb-3'><BsPin className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="" className="block"> 12 W Main St, Mesa, AZ 85201, USA</a></p>
         </div>
         <div className="social border-b pb-10 border-[#e5e5e7]">
            <h3 className="text-xl font-[600] my-6" >Operating Hours</h3>
            <p className="flex items-center mb-3"><BsClock className="w-5 h-5 mr-3   text-[#0205d3]" /> <span>Mon - Fri</span> <span className='ml-8'>9:00 AM to 4:30 PM</span></p>
         </div>
         <div className="social border-b pb-10 border-[#e5e5e7]">
            <h3 className="text-xl font-[600] my-6" >Social Links</h3>
            <div className="flex">
               <a href="" className='inline'><BsFacebook className="w-10 h-10 mr-3   text-[#139df8]" /></a>
               <a href="" className='inline'><BsInstagram className="w-10 h-10 mr-3   text-[#E1306C]" /></a>
            </div>
         </div>

         <div className="pb-10">
            <h3 className="text-xl font-[600] my-6" >About</h3>
            <p className='mb-4'>In March 2016, co-founders Bryan McCormick and Noel Garcia were introduced through mutual friends. They made it official in April and immediately started brewing on a one-barrel system.</p>
            <p> After hearing about the Barnone project at Agritopia, Noel called Joe Johnston to see if there were any spots left. Thankfully there was and three days later it was a done deal! While construction on Barnone continued, Noel & Bryan upgraded to a 10-barrel system at their production facility and cranked out beers for their grand opening in November of 2016.</p>
         </div>

      </div>
   )
}

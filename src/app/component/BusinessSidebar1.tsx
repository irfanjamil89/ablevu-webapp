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

export default function BusinessSidebar1() {
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

         {/* Details */}
         <div className="details">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-[600] mb-4" >Details</h3>
               <button>
                  <label htmlFor="edit-details-popup-toggle" className="text-sm text-gray-800 cursor-pointer font-bold">
                     <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-5 h-5 cursor-pointer" />
                  </label>
               </button>

               {/* <!-- Modal --> */}
               <input type="checkbox" id="edit-details-popup-toggle" className="hidden peer" />
               <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
                     {/* <!-- Close Button --> */}
                     <label htmlFor="edit-details-popup-toggle"
                        className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                        ×
                     </label>

                     {/* <!-- Modal Header --> */}
                     <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Business Details</h2>

                     {/* <!-- Form --> */}
                     <form className="space-y-6">
                        {/* <!-- Business Name --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Name</label>
                           <input type="text" placeholder="12 West Brewing"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Business Address --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Address</label>
                           <input type="text" placeholder="12 W Main St, Mesa, AZ 85201, USA"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Owner Email --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Profile Owner Email</label>
                           <input type="email" placeholder="alison@visitmesa.com"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>


                        {/* <!-- Business Description --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-800 mb-1">
                              Description
                           </label>

                           <textarea
                              rows={10}
                              cols={40}
                              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none"
                              defaultValue={`In March 2016, co-founders Bryan McCormick and Noel Garcia were introduced through mutual friends. They made it official in April and immediately started brewing on a one-barrel system.

After hearing about the Barnone project at Agritopia, Noel called Joe Johnston to see if there were any spots left. Thankfully there was and three days later it was a done deal! While construction on Barnone continued, Noel & Bryan upgraded to a 10-barrel system at their production facility and cranked out beers for their grand opening in November of 2016.`}
                           />
                        </div>

                        {/* Form */}
                        <div className='flex justify-between flex-wrap space-y-4'>

                           {/* <!-- City Name --> */}
                           <div className='w-[230px]'>
                              <label className="block text-md font-medium text-gray-700 mb-1">City</label>
                              <input type="text" placeholder="Mesa"
                                 className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                           </div>


                           {/* <!-- State Name --> */}
                           <div className='w-[230px]'>
                              <label className="block text-md font-medium text-gray-700 mb-1">
                                 State</label>
                              <input type="text" placeholder="Arizona"
                                 className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                           </div>

                           {/* <!-- Zip code --> */}
                           <div className='w-[230px]'>
                              <label className="block text-md font-medium text-gray-700 mb-1">
                                 Zip</label>
                              <input type="number" placeholder="85201"
                                 className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                           </div>

                           {/* <!-- Country --> */}
                           <div className='w-[230px]'>
                              <label className="block text-md font-medium text-gray-700 mb-1">

                                 Country</label>
                              <input type="text" placeholder="Maricopa County"
                                 className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                           </div>

                        </div>


                        {/* <!-- Email --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Email</label>
                           <input type="email" placeholder="downtown12west@gmail.com"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>


                        {/* <!-- Phone Number --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Phone Number
                           </label>
                           <input type="number" placeholder="+1 480-508-7018"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Business Website --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Business Website</label>
                           <input type="text" placeholder="http://12westbrewing.com/mesa"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Business Category --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Business Categories</label>
                           <select
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-2 focus:ring-[#0519CE] outline-none">
                              <option>Select Category</option>
                              <option value="Restaurant">Restaurant</option>
                              <option>Retail</option>
                              <option>Healthcare</option>
                              <option>Accessibility Services</option>
                           </select>
                        </div>

                        {/* <!-- Form Buttons --> */}
                        <div className="flex justify-center gap-3 pt-2">
                           <label htmlFor="edit-details-popup-toggle"
                              className="px-5 py-2.5 w-full text-center text-md font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                              Cancel
                           </label>
                           <button type="submit"
                              className="px-5 py-2.5 w-full text-center text-md font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                              Update Details
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>

            <p className='flex items-center mb-3'><BsLink className="w-7 h-7 mr-3  rotate-130 text-[#0205d3]" /><a href="http://12westbrewing.com/mesa" className="block"> http://12westbrewing.com/mesa</a></p>
            <p className='flex items-center mb-3'><BsEnvelope className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="mailto:downtown12west@gmail.com" className="block"> downtown12west@gmail.com</a></p>
            <p className='flex items-center mb-3'><BsTelephone className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="tel:14805087018" className="block"> +14805087018</a></p>
            <p className='flex items-center mb-3'><BsPin className="w-5 h-5 mr-3   text-[#0205d3]" /><a href="" className="block"> 12 W Main St, Mesa, AZ 85201, USA</a></p>
         </div>

         {/* Operating Hours */}
         <div className="social border-b pb-10 border-[#e5e5e7]">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-[600] my-6" >Operating Hours</h3>
               <button>
                  <label htmlFor="business-schedule-popup-toggle" className="text-md text-gray-800 cursor-pointer font-bold">
                     <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-5 h-5 cursor-pointer" />
                  </label>
               </button>

               {/* <!-- Modal --> */}
               <input type="checkbox" id="business-schedule-popup-toggle" className="hidden peer" />
               <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[630px] p-8 relative">
                     {/* <!-- Close Button --> */}
                     <label htmlFor="business-schedule-popup-toggle"
                        className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                        ×
                     </label>

                     {/* <!-- Modal Header --> */}
                     <h2 className="text-2xl font-bold text-gray-700 mb-4">Business Schedule</h2>

                     {/* <!-- Table --> */}
                     <div className="space-y-6">

                        <div>
                           <table className="min-w-full">
                              <thead>
                                 <tr>
                                    <th className="text-left py-2 text-sm font-semibold text-gray-500">Day of Week</th>
                                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">Open/Close</th>
                                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">Opening Time</th>
                                    <th className="text-center px-2 py-2 text-sm font-semibold text-gray-500">/</th>
                                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-500">Closing Time</th>
                                    <th className="text-center px-4 py-2 text-sm font-semibold text-gray-500"></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Monday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />
                                    </td>
                                 </tr>

                                 {/* <!-- Repeat rows for other days --> */}

                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Tuesday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-1 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>



                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Wednesday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>



                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Thursday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>


                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Friday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>



                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Saturday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>



                                 <tr>
                                    <td className="py-3 font-semibold text-gray-800">Sunday</td>
                                    <td className="px-4 py-3 flex justify-center cursor-pointer">
                                       <input type="checkbox" className="w-5 h-5 mt-2 text-blue-600 rounded" />
                                    </td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="text-center px-2 py-3 font-bold">-</td>
                                    <td className="px-4 py-3">
                                       <input type="time" value="18:44" className="border border-gray-300 cursor-pointer rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600" />
                                    </td>
                                    <td className="px-4 py-3 text-center cursor-pointer text-gray-500 hover:text-gray-800">
                                       <img src="/assets/images/paste.svg" alt="paste" className='w-5 h-5' />

                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <p className="flex items-center mb-3"><BsClock className="w-5 h-5 mr-3   text-[#0205d3]" /> <span>Mon - Fri</span> <span className='ml-8'>9:00 AM to 4:30 PM</span></p>
         </div>

         {/* Social Links */}
         <div className="social border-b pb-10 border-[#e5e5e7]">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-[600] my-6" >Social Links</h3>
               <button>
                  <label htmlFor="social-popup-toggle" className="text-sm text-gray-800 cursor-pointer font-bold">
                     <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-5 h-5 cursor-pointer" />
                  </label>
               </button>

               {/* <!-- Modal --> */}
               <input type="checkbox" id="social-popup-toggle" className="hidden peer" />
               <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
                     {/* <!-- Close Button --> */}
                     <label htmlFor="social-popup-toggle"
                        className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                        ×
                     </label>

                     {/* <!-- Modal Header --> */}
                     <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Social Links</h2>

                     {/* <!-- Form --> */}
                     <form className="space-y-6">
                        {/* <!-- Business Name --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Facebook link</label>
                           <input type="text" placeholder="https://www.facebook.com/Downtown12West"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Business Address --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-700 mb-1">Instagram link</label>
                           <input type="text" placeholder="https://www.instagram.com/downtown_12_west/?fbclid=IwAR3z6DCjsTJ1c14sskvGAa_b17QTHy3vwiu_BC2s_sNZlW0msjNZoorOBKg"
                              className="w-full border border-gray-300 placeholder:text-gray-700 rounded-lg px-3 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none" />
                        </div>

                        {/* <!-- Form Buttons --> */}
                        <div className="flex justify-center gap-3 pt-2">
                           <label htmlFor="social-popup-toggle"
                              className="px-5 py-2.5 w-full text-center text-md font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                              Cancel
                           </label>
                           <button type="submit"
                              className="px-5 py-2.5 w-full text-center text-md font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                              Update Social Links
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>
            <div className="flex">
               <a href="" className='inline'><BsFacebook className="w-10 h-10 mr-3   text-[#139df8]" /></a>
               <a href="" className='inline'><BsInstagram className="w-10 h-10 mr-3   text-[#E1306C]" /></a>
            </div>
         </div>

         {/* About */}

         <div className="pb-10">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-[600] my-6" >About</h3>
               <button>
                  <label htmlFor="edit-about-popup-toggle" className="text-sm text-gray-800 cursor-pointer font-bold">
                     <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-5 h-5 cursor-pointer" />
                  </label>
               </button>

               {/* <!-- Modal --> */}
               <input type="checkbox" id="edit-about-popup-toggle" className="hidden peer" />
               <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                  <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative max-h-[90vh] overflow-y-auto">
                     {/* <!-- Close Button --> */}
                     <label htmlFor="edit-about-popup-toggle"
                        className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                        ×
                     </label>

                     {/* <!-- Modal Header --> */}
                     <h2 className="text-lg font-bold text-gray-700 mb-4">Update Business About Information</h2>

                     {/* <!-- Form --> */}
                     <form className="space-y-6">

                        {/* <!-- Business Description --> */}
                        <div>
                           <label className="block text-md font-medium text-gray-800 mb-1">
                              Business Description
                           </label>

                           <textarea
                              rows={10}
                              cols={40}
                              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-md hover:border-[#0519CE] focus:hover:border-[#0519ce00] focus:ring-1 focus:ring-[#0519CE] outline-none"
                              defaultValue={`In March 2016, co-founders Bryan McCormick and Noel Garcia were introduced through mutual friends. They made it official in April and immediately started brewing on a one-barrel system.

After hearing about the Barnone project at Agritopia, Noel called Joe Johnston to see if there were any spots left. Thankfully there was and three days later it was a done deal! While construction on Barnone continued, Noel & Bryan upgraded to a 10-barrel system at their production facility and cranked out beers for their grand opening in November of 2016.`}
                           />
                        </div>

                        {/* <!-- Form Buttons --> */}
                        <div className="flex justify-center gap-3 pt-2">
                           <label htmlFor="edit-about-popup-toggle"
                              className="px-5 py-2.5 w-full text-center text-md font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                              Cancel
                           </label>
                           <button type="submit"
                              className="px-5 py-2.5 w-full text-center text-md font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                              Update Description
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            </div>

            <p className='mb-4'>In March 2016, co-founders Bryan McCormick and Noel Garcia were introduced through mutual friends. They made it official in April and immediately started brewing on a one-barrel system.</p>
            <p> After hearing about the Barnone project at Agritopia, Noel called Joe Johnston to see if there were any spots left. Thankfully there was and three days later it was a done deal! While construction on Barnone continued, Noel & Bryan upgraded to a 10-barrel system at their production facility and cranked out beers for their grand opening in November of 2016.</p>


         </div>

         {/* <!-- Single Business --> */}

         <div className="text-left">
            {/* <!-- Hidden Toggle --> */}
            <input type="checkbox" id="single-business-toggle" className="hidden peer" />

            {/* <!-- Trigger --> */}
            <label
               htmlFor="single-business-toggle"
               className="flex items-center justify-between border border-gray-300 text-gray-500 text-sm px-3 py-3 rounded-full hover:border-[#0519CE] cursor-pointer w-full transition-all duration-200"

            >
               Claimed
               <svg
                  className="w-2.5 h-2.5 ms-3 transition-transform duration-200 peer-checked:rotate-180"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
               >
                  <path stroke="currentColor"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2" d="m1 1 4 4 4-4" />
               </svg>
            </label>

            {/* <!-- Click outside overlay --> */}
            <label htmlFor="single-business-toggle" className="hidden peer-checked:block fixed inset-0 z-10"></label>

            {/* <!-- Dropdown --> */}
            <div
               className="absolute z-20 mt-2 hidden peer-checked:block border border-gray-200 bg-white divide-y divide-gray-100 rounded-lg shadow-md"
            >
               <ul className="py-2 text-sm text-gray-700">
                  <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Archived</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Pending Approved</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Approved</a></li>
                  <li><a href="#" className="block px-3 py-1 hover:bg-gray-100">Claimed</a></li>
               </ul>
            </div>
         </div>

         <div className='mt-3'>
            <button type="submit"
               className="flex justify-center items-center gap-2 px-5 py-2.5 w-full text-center text-md font-bold bg-[#FFEBEB] text-[#DD3820] rounded-full cursor-pointer">
               <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5'/> Delete Business
            </button>
         </div>


      </div>
   )
}

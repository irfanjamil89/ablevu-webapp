import React from 'react'

export default function Accessiblecities() {
  return (
    <div className="w-full h-screen overflow-hidden">
      <div
        className="flex items-center justify-between border-b border-gray-200 bg-white">
        <div className="w-full min-h-screen bg-white">

          {/* <!-- Header Row --> */}
          <div className="w-full min-h-screen bg-white px-6 py-5">

            {/* <!-- Header --> */}
            <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
              {/* <!-- Title --> */}

              <h1 className="text-2xl font-semibold text-gray-900">Accessible Cities (13)</h1>

              <div className="flex items-center gap-3">


                {/* <!-- Add New Business --> */}
                {/* pop-up button start */}

                <input type="checkbox" id="Accessible-cities-toggle" className="hidden peer" />

                {/* <!-- OPEN BUTTON --> */}
                <label htmlFor="Accessible-cities-toggle"
                  className="px-5 py-2.5 text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700 transition">
                  Add City
                </label>

                {/* <!-- OVERLAY --> */}
                <div
                  className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

                  {/* <!-- MODAL CARD --> */}
                  <div
                    className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

                    {/* <!-- CLOSE BUTTON --> */}
                    <label htmlFor="Accessible-cities-toggle"
                      className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                      ×
                    </label>

                    {/* <!-- HEADER --> */}
                    <h2 className="text-lg font-bold text-gray-700 mb-4">Add Accessibility City</h2>

                    {/* <!-- FORM --> */}
                    <form className="space-y-6">

                      {/* <!-- Upload Business Logo --> */}
                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-2">Upload Picture</label>
                        <div className="relative">
                          {/* Hidden file input */}
                          <input
                            type="file"
                            accept=".svg,.png,.jpg,.gif"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />

                          {/* Upload Area */}
                          <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                            <img src="/assets/images/upload-icon.avif" alt="upload-icon" className='w-10 h-10' />
                            <p className="text-[#0519CE] font-semibold text-sm">Click to upload <span className='text-gray-500 text-xs'>or drag and drop</span></p>
                            <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                          </div>
                        </div>
                      </div>


                      {/* <!-- Enter City --> */}
                      <div>
                        <label className="block text-md font-medium text-gray-700 mb-1">Enter City</label>
                        <input type="text" placeholder="Search for City"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                      </div>

                      {/* <!-- Select Businesses --> */}
                      <div className="mb-4 relative">
                        {/* Label */}
                        <label className="block text-md font-medium text-gray-700 mb-1">
                          Select Businesses
                        </label>

                        {/* Hidden Toggle Checkbox */}
                        <input type="checkbox" id="dropdownToggle" className="hidden peer" />

                        {/* Trigger Button */}
                        <label
                          htmlFor="dropdownToggle"
                          className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
                        >
                          <span className="truncate">Select Businesses</span>
                          {/* <svg
                            className="w-4 h-4 text-gray-500 transition-transform duration-200 peer-checked:rotate-180"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg> */}
                        </label>

                        {/* Overlay (closes dropdown when clicking outside) */}
                        {/* <label
                          htmlFor="dropdownToggle"
                          className="hidden peer-checked:block fixed inset-0 z-10"
                        ></label> */}

                        {/* Dropdown Menu */}
                        {/* <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-md hidden peer-checked:flex flex-col">
                          <button className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Restaurant
                          </button>
                          <button className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Retail
                          </button>
                          <button className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Healthcare
                          </button>
                          <button className="text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            Accessibility Services
                          </button>
                        </div> */}
                      </div>


                      <div className="mt-4">


                      </div>


                      {/* <!-- BUTTONS --> */}
                      <div className="flex justify-center gap-3 pt-2">
                        <label htmlFor="Accessible-cities-toggle"
                          className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                          Cancel
                        </label>
                        <button type="submit"
                          className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                          Create City
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* pop-up button END */}

              </div>
            </div>

            {/* <!-- table --> */}
            <div className="w-full bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead className="bg-gray-100 text-gray-600">
                    {/* <tr>
          <th className="px-4 py-2">City</th>
          <th className="px-4 py-2">Businesses</th>
          <th className="px-4 py-2 text-center">Featured?</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr> */}
                  </thead>
                  <tbody className='space-y-3'>
                    {/* <!-- Row 1 --> */}
                    <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                      <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                        <img src="assets/images/lansing-227361685 (1).avif" alt="Lansing" className="rounded-full" />
                        Lansing
                      </td>
                      <td className="px-4 py-2"><span className='bg-[#FFE2C7] text-sm text-gray-700 font-semibold py-2.5 px-3 rounded-sm'>60 Businesses</span></td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center space-x-4">
                          <label htmlFor="toggle" className="inline-flex items-center cursor-pointer">
                            <span className="mr-2 text-md font-medium">Featured?</span>
                            <div className="relative">
                              {/* <!-- Hidden checkbox input --> */}
                              <input type="checkbox" id="toggle" className="sr-only peer" />
                              {/* <!-- Switch background --> */}
                              <div className="block w-8 h-5 border-2 rounded-full peer-checked:bg-[#12B76A] peer-checked:border-none"></div>
                              {/* <!-- Switch handle --> */}
                              <div className="dot absolute left-1 top-1 border-2 peer-checked:bg-white peer-checked:border-none w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3"></div>
                            </div>
                          </label>
                        </div>

                      </td>


                      <td className="px-4 py-2 flex gap-3">
                        {/* <!-- Delete Button --> */}
                        <button>
                          <img src="assets/images/delete-svgrepo-com.svg" alt="Delete" className="w-8 h-8 cursor-pointer" />
                        </button>

                        {/* <!-- Hidden Checkbox for Modal Toggle --> */}
                        <input type="checkbox" id="Edit-cities-popup-toggle" className="hidden peer" />

                        {/* <!-- Edit Button --> */}
                        <button className="text-red-600 hover:text-red-800">
                          <label htmlFor="Edit-cities-popup-toggle" className="text-sm text-gray-800 cursor-pointer font-bold">
                            <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-6 h-6 cursor-pointer" />
                          </label>
                        </button>

                        {/* <!-- Modal --> */}
                        <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                          <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

                            {/* <!-- Close Button --> */}
                            <label htmlFor="Edit-cities-popup-toggle"
                              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                              ×
                            </label>

                            {/* <!-- Modal Header --> */}
                            <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Accessibility City</h2>

                            {/* <!-- Form --> */}
                            <form className="space-y-6">

                              {/* <!-- Upload Business Logo --> */}
                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
                                <div className="relative">
                                  {/* <!-- Hidden File Input --> */}
                                  <input
                                    type="file"
                                    accept=".svg,.png,.jpg,.gif"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  {/* <!-- Upload Area --> */}
                                  <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                                    <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
                                    <p className="text-[#0519CE] font-semibold text-sm">Click to upload <span className="text-gray-500 text-xs">or drag and drop</span></p>
                                    <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                                  </div>
                                  <img src="assets/images/tower 2.jpg" alt="Uploaded" className="mt-3 h-40" />
                                </div>
                              </div>

                              {/* <!-- Partner Name --> */}
                              <div>
                                <label className="block text-md font-medium text-gray-800 mb-1">Enter City</label>
                                <input type="text" placeholder="Lansing, MI, USA"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200" />
                              </div>

                              {/* <!-- Website Link --> */}
                              <div className="mb-4 relative">
                                <label className="block text-md font-medium text-gray-800 mb-1">Select Businesses</label>
                                {/* <!-- Hidden Toggle Checkbox --> */}
                                <input type="checkbox" id="dropdownToggle" className="hidden peer" />
                                {/* <!-- Trigger Button --> */}
                                <label
                                  htmlFor="dropdownToggle"
                                  className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
                                >
                                  <span className="truncate">Select Businesses</span>
                                </label>
                              </div>

                              {/* <!-- Form Buttons --> */}
                              <div className="flex justify-center gap-3 pt-2">
                                <label htmlFor="Edit-cities-popup-toggle"
                                  className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                  Cancel
                                </label>
                                <button type="submit"
                                  className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                  Create City
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </td>

                    </tr>

                    {/* <!-- Row 2 --> */}
                    <tr className="border rounded-lg border-gray-200 justify-between flex flex-row items-center">
                      <td className="px-4 py-2 flex items-center gap-2 font-semibold">
                        <img src="assets/images/lansing-227361685 (1).avif" alt="Lansing" className="rounded-full" />
                        Lansing
                      </td>
                      <td className="px-4 py-2"><span className='bg-[#FFE2C7] text-sm text-gray-700 font-semibold py-2.5 px-3 rounded-sm'>60 Businesses</span></td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex items-center space-x-4">
                          <label htmlFor="toggle-2" className="inline-flex items-center cursor-pointer">
                            <span className="mr-2 text-md font-medium">Featured?</span>
                            <div className="relative">
                              {/* <!-- Hidden checkbox input --> */}
                              <input type="checkbox" id="toggle-2" className="sr-only peer" />
                              {/* <!-- Switch background --> */}
                              <div className="block w-8 h-5 border-2 rounded-full peer-checked:bg-[#12B76A] peer-checked:border-none"></div>
                              {/* <!-- Switch handle --> */}
                              <div className="dot absolute left-1 top-1 border-2 peer-checked:bg-white peer-checked:border-none w-3 h-3 rounded-full transition-transform peer-checked:translate-x-3"></div>
                            </div>
                          </label>
                        </div>

                      </td>


                      <td className="px-4 py-2 flex gap-3">
                        {/* <!-- Delete Button --> */}
                        <button>
                          <img src="assets/images/delete-svgrepo-com.svg" alt="Delete" className="w-8 h-8 cursor-pointer" />
                        </button>

                        {/* <!-- Hidden Checkbox for Modal Toggle --> */}
                        <input type="checkbox" id="Edit-cities-popup-toggle" className="hidden peer" />

                        {/* <!-- Edit Button --> */}
                        <button className="text-red-600 hover:text-red-800">
                          <label htmlFor="Edit-cities-popup-toggle" className="text-sm text-gray-800 cursor-pointer font-bold">
                            <img src="assets/images/writing-svgrepo-com.svg" alt="Edit" className="w-6 h-6 cursor-pointer" />
                          </label>
                        </button>

                        {/* <!-- Modal --> */}
                        <div className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">
                          <div className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[550px] p-8 relative">

                            {/* <!-- Close Button --> */}
                            <label htmlFor="Edit-cities-popup-toggle"
                              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                              ×
                            </label>

                            {/* <!-- Modal Header --> */}
                            <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Accessibility City</h2>

                            {/* <!-- Form --> */}
                            <form className="space-y-6">

                              {/* <!-- Upload Business Logo --> */}
                              <div>
                                <label className="block text-md font-medium text-gray-700 mb-2">Upload Logo</label>
                                <div className="relative">
                                  {/* <!-- Hidden File Input --> */}
                                  <input
                                    type="file"
                                    accept=".svg,.png,.jpg,.gif"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  />
                                  {/* <!-- Upload Area --> */}
                                  <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer h-fit">
                                    <img src="/assets/images/upload-icon.avif" alt="upload-icon" className="w-10 h-10" />
                                    <p className="text-[#0519CE] font-semibold text-sm">Click to upload <span className="text-gray-500 text-xs">or drag and drop</span></p>
                                    <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF (max. 800×400px)</p>
                                  </div>
                                  <img src="assets/images/tower 2.jpg" alt="Uploaded" className="mt-3 h-40" />
                                </div>
                              </div>

                              {/* <!-- Partner Name --> */}
                              <div>
                                <label className="block text-md font-medium text-gray-800 mb-1">Enter City</label>
                                <input type="text" placeholder="Lansing, MI, USA"
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md hover:border-[#0519CE] focus:border-[#0519CE] placeholder:text-gray-500 outline-none transition-all duration-200" />
                              </div>

                              {/* <!-- Website Link --> */}
                              <div className="mb-4 relative">
                                <label className="block text-md font-medium text-gray-800 mb-1">Select Businesses</label>
                                {/* <!-- Hidden Toggle Checkbox --> */}
                                <input type="checkbox" id="dropdownToggle" className="hidden peer" />
                                {/* <!-- Trigger Button --> */}
                                <label
                                  htmlFor="dropdownToggle"
                                  className="flex items-center justify-between w-full border border-gray-300 rounded-lg px-3 py-2.5 text-md text-gray-500 hover:border-[#0519CE] peer-checked:border-[#0519CE] cursor-pointer bg-white transition-all duration-200"
                                >
                                  <span className="truncate">Select Businesses</span>
                                </label>
                              </div>

                              {/* <!-- Form Buttons --> */}
                              <div className="flex justify-center gap-3 pt-2">
                                <label htmlFor="Edit-cities-popup-toggle"
                                  className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                                  Cancel
                                </label>
                                <button type="submit"
                                  className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                                  Create City
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

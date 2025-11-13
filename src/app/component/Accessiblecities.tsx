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
                            <img src="/assets/images/upload-icon.avif" alt="upload-icon" className='w-10 h-10'/>
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

            {/* <!-- Empty State Content --> */}
            <section className="flex-1">

              {/* <!-- table START --> */}
              {/* Hidden “none” radio for reset */}
              <input type="radio" name="menuGroup" id="none" className="hidden" defaultChecked />

              <div className="h-auto overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="text-gray-500 text-sm font-bold">
                    <tr>
                      <th scope="col" className="w-auto lg:w-[500px] py-3 pr-3 pl-3"></th>
                      <th scope="col" className="px-6 py-3"></th>
                      <th scope="col" className=" text-center px-6 py-3"></th>
                      <th scope="col" className="px-3 py-3 text-right"></th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">

                    {/* Reusable Row Component Pattern */}
                    {[
                      ["ASL Video Tour Available", "Auditory"],
                      ["Descriptive Device", "Visual"],
                      ["Hearing Impaired System", "Auditory"],
                      ["Hearing Impaired System", "Visual"],
                      ["Headphone/Speech Mode available", "Auditory"],
                      ["Audio Jack", "Auditory"],
                    ].map(([title, type], index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 pr-4 pl-3">{title}</td>
                        <td className="px-6 py-4">{type}</td>
                        <td className="px-6 py-4 text-center font-medium">Yes</td>

                        {/* Dropdown Cell */}
                        <td className="relative px-6 py-4 text-right">
                          {/* Radio Input */}
                          <input
                            type="radio"
                            name="menuGroup"
                            id={`menuToggle${index}`}
                            className="hidden peer"
                          />

                          {/* Trigger Icon */}
                          <label
                            htmlFor={`menuToggle${index}`}
                            className="cursor-pointer text-gray-500 text-2xl select-none"
                          >
                            ⋮
                          </label>

                          {/* Invisible overlay to close when clicked outside */}
                          <label
                            htmlFor="none"
                            className="hidden peer-checked:block fixed inset-0 z-40"
                          ></label>

                          {/* Dropdown Menu */}
                          <div className="absolute right-0 mt-2 w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg z-50 hidden peer-checked:flex flex-col">
                            <button className="flex items-center border-b border-gray-200 gap-2 px-4 py-2 text-gray-700 hover:bg-[#EFF0F1] text-sm">
                              ✏️ Edit
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-sm rounded-b-lg">
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>

              </div>


            </section>
          </div>

        </div>

      </div>
    </div>
  )
}

import React from 'react'

export default function Maincontent() {
  return (
    <div className='px-10 py-7 w-7/10'>
      <div className="tour border p-6 rounded-3xl border-[#e5e5e7] w-full ">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Virtual Tours</h3>

          <div className="flex flex-wrap gap-y-4 lg:flex-nowrap items-center justify-between mb-8">
            {/* <!-- Title --> */}
            <div className="flex items-center gap-3">

              {/* <!-- Add New Business --> */}
              {/* pop-up button start */}

              <input type="checkbox" id="virtual-tour-toggle" className="hidden peer" />

              {/* <!-- OPEN BUTTON --> */}
              <label htmlFor="virtual-tour-toggle"
                className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
                Add Virtual Tours
              </label>

              {/* <!-- OVERLAY --> */}
              <div
                className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

                {/* <!-- MODAL CARD --> */}
                <div
                  className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">

                  {/* <!-- CLOSE BUTTON --> */}
                  <label htmlFor="virtual-tour-toggle"
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                    ×
                  </label>

                  {/* <!-- HEADER --> */}
                  <h2 className="text-lg font-bold text-gray-700 mb-4">Edit Virtual Tour</h2>

                  {/* <!-- FORM --> */}
                  <form className="space-y-5">

                    {/* <!-- Title --> */}
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Title</label>
                      <input type="text" placeholder="360 Virtual Tour"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-700 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                    </div>

                    {/* <!-- Virtual Link --> */}
                    <div>
                      <label className="block text-md font-medium text-gray-700 mb-1">Virtual Link</label>
                      <input type="text" placeholder="https://cloud.threshold360.com/locations/8456872-629494058"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-700 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                    </div>
                    {/* <!-- BUTTONS --> */}
                    <div className="flex justify-center gap-3 pt-2">
                      <label htmlFor="virtual-tour-toggle"
                        className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                        Cancel
                      </label>
                      <button type="submit"
                        className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                        Update Details
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* pop-up button END */}

            </div>
          </div>

        </div>
        <p >Explore the location virtually to make informed decisions and plan your visit</p>
        <p className='text-xs mt-1'>Interested in adding an accessibility virtual tour? Email <a href="mailto:info@ableeyes.org" ><span className="text-[#0205d3]">info@ableeyes.org</span></a> for more information</p>
        <div className="tours mt-6 flex flex-wrap justify-between gap-5">
          <div className="flex justify-between items-center border p-4 rounded-xl border-[#e5e5e7] w-[49%]">
            <div className="icon flex items-center">
              <img src="/assets/images/walking.svg" alt="" className="w-8 mr-4" />
              <p>Enterance</p>
            </div>
            <div className="link flex items-center space-x-2">
              <a href="https://maps.app.goo.gl/4bQdcAEkZk3fqpQH9">View</a>
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
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

      {/* property image */}
      <div className="property my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Property Images</h3>
          <div className="flex items-center gap-3">
            {/* pop-up button start */}

            <input type="checkbox" id="property-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="property-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add to Collection
            </label>


            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="property-popup-toggle"
                  className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-md font-semibold text-gray-900 mb-3">Add an Image</h2>
                <p className="text-gray-700 text-md mb-4">
                  To ensure quality and relevance, your Images will first be sent to the business for approval. This helps maintain a constructive and trustworthy feedback system.
                </p>

                {/* <!-- Upload Logo --> */}
                <div className='w-[33%] mb-4'>
                  <div className="relative">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      accept=".svg,.png,.jpg,.gif"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {/* Upload Area */}
                    <div className="flex flex-col items-center border border-gray-200 rounded-lg p-10 text-center hover:bg-gray-50 cursor-pointer h-fit ">
                      <img src="/assets/images/upload-icon.avif" alt="upload-icon" className='w-10 h-10' />
                    </div>
                  </div>
                </div>

                {/* <!-- FORM --> */}
                <form className="space-y-4">

                  <div>
                    <input type="text" placeholder="alt text of the image"
                      className="w-full border border-gray-300 text-center rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0519CE] outline-none" />
                  </div>

                  <p className="text-gray-700 text-md mb-4">
                    This is our AI readers Alt text generated. Please feel free to update or improve as you see fit
                  </p>


                  {/* <!-- What do you like about this business? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Would you like to tell us anything more about this photo?</label>
                    <textarea placeholder="Enter..."
                      rows={5}
                      cols={20}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"></textarea>
                  </div>


                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="property-popup-toggle"
                      className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>

        </div>



        <div className="flex flex-wrap gap-x-3 items-center">
          <div className='relative box-content overflow-hidden'>
            <img src="/assets/images/book-img.png" alt="" className="w-[19%] my-1.5 rounded-2xl cursor-pointer" />
            <div className="absolute top-4 left-35 w-auto px-1 py-0.5 icon-box flex items-center gap-2 box-content rounded bg-[#9c9c9c91]">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>
          </div>

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

      {/* Accessibility Features */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Accessibility Features</h3>

          <div className="flex items-center gap-3">
            {/* pop-up button start */}

            <input type="checkbox" id="accessibility-features-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="accessibility-features-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add Features
            </label>

            {/* <!-- OVERLAY --> */}
            

            {/* pop-up button END */}

          </div>

        </div>

        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/blank.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Features to shown</p>
        </div> */}
        <div className="audios py-10 rounded-xl space-y-2">
          <div className='box flex items-center gap-3'>
            <div className='w-[120px]'>
              <div className="icon-box flex items-center gap-2 box-content w-full">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>
            </div>
            <div className="heading box-content w-[100px]">
              <h3 className='text-md text-gray-500'>Physical</h3>
            </div>

            <div className="content flex flex-wrap items-start gap-2">
              <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                <h3 className='text-sm'>Accessible entrance available</h3>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                <h3 className='text-sm'>Accessible entrance available</h3>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                <h3 className='text-sm'>Accessible entrance available </h3>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                <h3 className='text-sm'>Accessible entrance available</h3>
              </div>

              <div className="flex items-center gap-1 bg-[#F2F2F3] p-2 rounded-lg w-auto">
                <img src="/assets/images/tick.svg" alt="tick" className='w-5 h-5' />
                <h3 className='text-sm'>Accessible entrance available</h3>
              </div>
            </div>
          </div>

        </div>
      </div>


      {/* Partner Certifications/Programs */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Partner Certifications/Programs</h3>
          <div className="flex items-center gap-3">
            {/* pop-up button start */}

            <input type="checkbox" id="add-partner-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="add-partner-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add Partnership
            </label>


            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="add-partner-popup-toggle"
                  className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-md font-semibold text-gray-900 mb-4">Add Partner Certificates/Programs</h2>


                {/* <!-- FORM --> */}
                <form className="space-y-4">


                  {/* <!-- What went well? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Select Partner</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-1 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none">
                      <option value="" disabled selected>
                        Choose from this dropdown
                      </option>

                      <option>Hidden Disabilities</option>
                      <option>Autism Double - Checked</option>
                      <option>Kulture City</option>
                      <option>Visit Able</option>
                      <option>Autism Travel Club</option>
                      <option>Becoming rentABLE</option>
                      <option>RightHear</option>
                    </select>
                  </div>

                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="add-partner-popup-toggle"
                      className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>
        </div>



        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/blank.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Active Partnerships</p>
        </div> */}

        <div className='flex flex-wrap space-x-3 space-y-3'>
          <section className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm w-[22%]">

            {/* <!-- Top Row --> */}
            <div className="flex items-center text-start justify-between mb-2">

              {/* <!-- Left: Anonymous + time --> */}
              <div className="flex items-center gap-3 pr-2">
                <div className="detail flex flex-col">
                  <div className="text-gray-700 font-semibold text-md">Hidden Disabilities</div>
                </div>

              </div>

              {/* <!-- Right: Location --> */}
              <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer">
                <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
                <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
              </div>

            </div>

            <div className='w-full flex justify-center py-5'>
              <img src="/assets/images/brand-1.png" alt="" className='w-lg' />
            </div>

            <div className="link w-full flex justify-center py-1">
              <a href="#" className='hover:underline text-sm text-[#0519CE]'>Visit Website</a>
            </div>

          </section>

        </div>

      </div>

      {/* Reviews */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Reviews</h3>

          <div className="flex items-center gap-3">
            {/* pop-up button start */}

            <input type="checkbox" id="reviews-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="reviews-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Write Reviews
            </label>


            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="reviews-popup-toggle"
                  className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-md font-semibold text-gray-900 mb-1">Write Review</h2>
                <p className="text-gray-700 text-md mb-4">
                  Our platform encourages positive comments, but we value your feedback as it helps our partners identify areas for improvement.
                </p>

                {/* <!-- FORM --> */}
                <form className="space-y-4">

                  {/* <!-- What went well? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">What went well?</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-1 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none">
                      <option value="" disabled selected>Select Features</option>
                      <option>Ease of Entry & Navigation</option>
                      <option>Parking & Transportation</option>
                      <option>Seating & Resting Areas</option>
                    </select>
                  </div>


                  {/* <!-- What do you like about this business? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">What do you like about this business?</label>
                    <textarea placeholder="Enter comments..."
                      rows={5}
                      cols={20}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"></textarea>
                  </div>


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

                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="reviews-popup-toggle"
                      className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Submit to business
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>

        </div>

        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/link.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No reviews to show</p>
        </div> */}

        <section className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm">

          {/* <!-- Top Row --> */}
          <div className="flex items-center justify-between mb-2">

            {/* <!-- Left: Anonymous + time --> */}
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-200 flex items-center justify-center">
                <img src="/assets/images/Profile.avif"
                  className="w-10 h-10" alt="profile" />
              </div>
              <div className="detail flex flex-col">
                <div className="text-gray-700 font-semibold text-md">Demo Admin</div>
                <div className="text-gray-700 text-md">Dec 2, 2025</div>
              </div>

            </div>

            {/* <!-- Right: Location --> */}
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

          </div>

          {/* <!-- Question --> */}
          <p className="text-md text-gray-900 mb-2">
            Do you have accessible restrooms?
          </p>
        </section>
      </div>


      {/* Accessibility Questions */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4">Accessibility Questions</h3>

          <div className="flex items-center gap-3">
            {/* pop-up button start */}

            <input type="checkbox" id="questions-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="questions-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Ask a Question
            </label>


            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[540px] py-8 px-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="questions-popup-toggle"
                  className="absolute top-5 right-7 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <div>


                  <h2 className="text-md font-semibold text-gray-900 mb-1">Ask a Question</h2>
                  <p className="text-gray-700 text-md mb-4">
                    AbleVu values businesses that share their accessibility information openly. All questions will first be reviewed by the business, and they may choose to respond privately or post your question publicly
                  </p>
                  <p className="text-gray-700 text-md mb-2">
                    Would you like your name to remain anonymous if posted publicly to help other users who may have the same question?
                  </p>

                  <div className="flex items-center gap-10 mb-4">

                    {/* Yes */}
                    <label className="flex items-center gap-2 text-gray-700 text-sm">
                      <input
                        type="radio"
                        name="answer"
                        value="yes"
                        className="h-4 w-4 text-[#0519CE] border-gray-300 focus:ring-[#0519CE]"
                      />
                      Yes
                    </label>

                    {/* No */}
                    <label className="flex items-center gap-2 text-gray-700 text-sm">
                      <input
                        type="radio"
                        name="answer"
                        value="no"
                        className="h-4 w-4 text-[#0519CE] border-gray-300 focus:ring-[#0519CE]"
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* <!-- FORM --> */}
                <form className="space-y-4">

                  {/* <!-- What do you like about this business? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Write your Question <span className="text-red-500">*</span></label>
                    <textarea placeholder="Enter here..."
                      rows={5}
                      cols={20}
                      className="w-full border border-gray-300 placeholder:text-gray-600 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"></textarea>
                  </div>

                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="questions-popup-toggle"
                      className="px-5 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>

        </div>

        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/blank.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Questions to shown</p>
        </div> */}

        <section className="w-full mx-auto bg-white rounded-lg border border-gray-200 p-4 shadow-sm">

          {/* <!-- Top Row --> */}
          <div className="flex items-center justify-between mb-2">

            {/* <!-- Left: Anonymous + time --> */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <img src="/assets/images/Profile.avif"
                  className="w-6 h-6" alt="profile" />
              </div>

              <div className="text-gray-700 font-semibold">Anonymous</div>
            </div>

            {/* <!-- Right: Location --> */}
            <div className="flex items-center gap-2 text-gray-700 text-sm font-medium cursor-pointer pr-5">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

          </div>

          {/* <!-- Question --> */}
          <h2 className="text-md font-semibold text-gray-900 mb-2">
            Do you have accessible restrooms?
          </h2>

          {/* <!-- Textarea --> */}
          <textarea
            rows={4}
            cols={4}
            placeholder="Write your answer here..."
            className="w-full border placeholder:text-gray-600 border-gray-300 rounded-lg p-4 text-sm hover:border-[#0519CE] focus:border-0 focus:ring-1 focus:ring-[#0519CE] outline-none"
          ></textarea>

        </section>

      </div>


      {/* Resources */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Additional Accessibility Resources</h3>
          <div className="flex items-center gap-3">

            {/* pop-up button start */}

            <input type="checkbox" id="resources-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="resources-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add Resources
            </label>

            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="resources-popup-toggle"
                  className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-2">Additional Accessibility Resources</h2>
                <p className="text-gray-700 text-md mb-4">
                  In this section, you can add link of social story, sensory maps or link of programs.
                </p>

                {/* <!-- FORM --> */}
                <form className="space-y-5">

                  {/* <!-- Label --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Label</label>
                    <input type="text" placeholder="Enter"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-500 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                  </div>

                  {/* <!-- Add Link --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Add Link</label>
                    <input type="text" placeholder="Paste..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-500 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                  </div>
                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="resources-popup-toggle"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>

        </div>
        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/link.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Resources to show</p>
        </div> */}

        <div className="pr-2 flex flex-wrap justify-between text-center space-y-3">

          <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
            <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

            <div className="paragraph text-start items-center flex gap-5">
              <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
              <p className='text-gray-700 text-sm'>
                this section
              </p>
            </div>
          </div>

          <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
            <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

            <div className="paragraph text-start items-center flex gap-5">
              <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
              <p className='text-gray-700 text-sm'>
                this section
              </p>
            </div>
          </div>

          <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
            <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

            <div className="paragraph text-start items-center flex gap-5">
              <img src="/assets/images/file.avif" alt="file" className='w-8 h-8' />
              <p className='text-gray-700 text-sm'>
                this section
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* Media */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Accessibility Media</h3>
          <div className="flex items-center gap-3">

            {/* pop-up button start */}

            <input type="checkbox" id="add-media-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="add-media-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add Media
            </label>

            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="add-media-popup-toggle"
                  className="absolute top-7 right-8 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-2">Add Media</h2>
                <p className="text-gray-700 text-md mb-4">
                  To ensure quality and relevance, your Media will first be sent to the business for approval.
                </p>

                {/* <!-- FORM --> */}
                <form className="space-y-5">

                  {/* <!-- Title --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" placeholder="Enter"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-500 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Description</label>
                    <textarea placeholder="Enter..."
                      rows={5}
                      cols={20}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none"></textarea>
                  </div>

                  {/* <!-- Add Link --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Add Link</label>
                    <input type="text" placeholder="Paste..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 placeholder:text-gray-500 text-md hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                  </div>
                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="add-media-popup-toggle"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>
        </div>

        {/* <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/blank.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Media to shown</p>
        </div> */}
        <div className="audios pr-2 flex flex-wrap justify-between text-center space-y-3">

          <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
            <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

            <div className="heading flex justify-between items-start">
              <h3 className="text-xl text-gray-800 text-start font-semibold mb-4 pr-2">Beer to raise money for autism awareness in Mesa</h3>
              <div
                className="py-1 text-sm text-[#0519CE] rounded-full cursor-pointer underline transition">
                View
              </div>
            </div>

            <div className="paragraph text-start">
              <p className='text-gray-700 text-sm'>
                Article about Visit Mesa, 12 West Brewing Co., and Chupacabra Taproom launching Spectrum IPA during Autism Acceptance Month to raise funds and awareness.
              </p>
            </div>
          </div>

          <div className="box border border-dotted p-4 rounded-xl border-[#d7d7da] space-y-2 w-[49.5%]">
            <div className="icon-box flex items-center justify-end gap-2 box-content w-full">
              <img src="/assets/images/green-tick.svg" alt="green-tick" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/yellow-pencil.svg" alt="yellow-pencil" className='w-5 h-5 cursor-pointer' />
              <img src="/assets/images/red-delete.svg" alt="red-delete" className='w-5 h-5 cursor-pointer' />
            </div>

            <div className="heading flex justify-between items-start">
              <h3 className="text-xl text-gray-800 text-start font-semibold mb-4 pr-2">Beer to raise money for autism awareness in Mesa Beer to raise money for autism awareness in Mesa</h3>
              <div
                className="py-1 text-sm text-[#0519CE] rounded-full cursor-pointer underline transition">
                View
              </div>
            </div>

            <div className="paragraph text-start">
              <p className='text-gray-700 text-sm'>
                Article about Visit Mesa, 12 West Brewing Co., and Chupacabra Taproom launching Spectrum IPA during Autism Acceptance Month to raise funds and awareness.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Custom Sections */}
      <div className=" my-8 border p-6 rounded-3xl border-[#e5e5e7] w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-[600] mb-4" >Custom Sections</h3>
          <div className="flex items-center gap-3">

            {/* pop-up button start */}

            <input type="checkbox" id="add-custom-popup-toggle" className="hidden peer" />

            {/* <!-- OPEN BUTTON --> */}
            <label htmlFor="add-custom-popup-toggle"
              className="px-3 py-2 text-md font-bold text-[#0519CE] rounded-full cursor-pointer underline transition">
              Add Custom Section
            </label>

            {/* <!-- OVERLAY --> */}
            <div
              className="fixed inset-0 bg-[#000000b4] hidden peer-checked:flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="add-custom-popup-toggle"
                  className="absolute top-7 right-8 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Add Custom Section</h2>

                {/* <!-- FORM --> */}
                <form className="space-y-5">

                  {/* <!-- Title --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Section Title</label>
                    <input type="text" placeholder="Enter"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md placeholder:text-gray-500 hover:border-[#0519CE] focus:border-[#0519CE] outline-none transition-all duration-200" />
                  </div>

                  {/* <!-- Visible to Public? --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Visible to Public?</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-1 py-2 text-md focus:ring-1 focus:ring-[#0519CE] outline-none">
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>


                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label htmlFor="add-custom-popup-toggle"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-2.5 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Create Section
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* pop-up button END */}

          </div>

        </div>


        <div className="audios border border-dotted p-10 rounded-xl border-[#e5e5e7] text-center flex flex-col justify-center items-center ">
          <img src="/assets/images/blank.avif" alt="" />
          <p className="mt-4 font-medium text-[#6d6d6d]">No Custom section to shown</p>
        </div>
      </div>




    </div>

  )
}

import React from 'react'

export type BusinessProfile = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipcode: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
};

interface AccessibilityFeaturePopupProps {
  businessId: string;
  setOpenAccessibilityFeaturePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const AccessibilityFeaturePopup: React.FC<AccessibilityFeaturePopupProps> = ({
  businessId,
  setOpenAccessibilityFeaturePopup,
  onUpdated,
}) => {


  return (
    <div
              className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label onClick={()=> setOpenAccessibilityFeaturePopup(false)}
                  className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                  ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Add Accessibility Features</h2>

                {/* <!-- FORM --> */}
                <form className="space-y-5">

                  {/* <!-- Select Type --> */}
                  <div>
                    <label className="block text-md font-medium text-gray-700 mb-1">Select Type <span className="text-red-500">*</span></label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-md focus:ring-1 focus:ring-[#0519CE] focus:hover:border-[#0519ce00] outline-none">
                      <option value="" selected disabled>Select Type</option>
                      <option>Physical</option>
                      <option>Auditory</option>
                      <option>Visual</option>
                      <option>Sensory</option>
                    </select>
                  </div>

                  {/* <!-- Scrollable multi-column list --> */}
                  <div id="categoryList" className="flex flex-wrap justify-between gap-y-2 max-h-56 overflow-y-auto">

                    <h3 className="w-full text-md font-medium text-gray-700">Select Categories</h3>

                    <label className="flex w-full items-center gap-2 text-gray-700 text-sm">
                      <input
                        id="selectAll"
                        type="checkbox"
                        className="h-4 w-4 text-[#0519CE] border-gray-300 rounded focus:ring-[#0519CE]"
                      />
                      <p className='w-[90%]'>Select All</p>
                    </label>


                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Amusement Park</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Airport</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Attraction</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Community Resource</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Church</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Education</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Family Entertainment</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Financial Institution</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Hotels / Lodging</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Library</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Museum</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Hotels / Lodging</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Library</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Museum</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Hotels / Lodging</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Library</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Museum</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Hotels / Lodging</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Library</p>
                    </label>

                    <label className="flex w-1/2 items-center gap-2 text-gray-700 text-sm">
                      <input type="checkbox" className="category h-4 w-4 text-[#0519CE] border-gray-300 rounded" />
                      <p className='w-[90%]'>Museum</p>
                    </label>
                  </div>



                  {/* <!-- BUTTONS --> */}
                  <div className="flex justify-center gap-3 pt-2">
                    <label onClick={()=> setOpenAccessibilityFeaturePopup(false)}
                      className="px-5 py-2 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100">
                      Cancel
                    </label>
                    <button type="submit"
                      className="px-5 py-2 w-full text-center text-sm font-bold bg-[#0519CE] text-white rounded-full cursor-pointer hover:bg-blue-700">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
  )
}

export default AccessibilityFeaturePopup
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

interface CustomSectionPopupProps {
  businessId: string;
  setOpenCustonSectionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const CustomSectionPopup: React.FC<CustomSectionPopupProps> = ({
  businessId,
  setOpenCustonSectionPopup,
  onUpdated,
}) => {


  return (
    <div
              className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label onClick={()=> setOpenCustonSectionPopup(false)}
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
                    <label onClick={()=> setOpenCustonSectionPopup(false)}
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
  )
}

export default CustomSectionPopup
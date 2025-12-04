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

interface PartnerCertificationPopupProps {
  businessId: string;
  setOpenPartnerCertificationsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const PartnerCertificationPopup: React.FC<PartnerCertificationPopupProps> = ({
  businessId,
  setOpenPartnerCertificationsPopup,
  onUpdated,
}) => {



  return (
    <div
              className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label onClick={()=> setOpenPartnerCertificationsPopup(false)}
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
                    <label onClick={()=> setOpenPartnerCertificationsPopup(false)}
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
  )
}

export default PartnerCertificationPopup
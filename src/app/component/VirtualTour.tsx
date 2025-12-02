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

interface VirtualTourProps {
  businessId: string;
  setOpenVirtualTour: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const VirtualTour: React.FC<VirtualTourProps> = ({
  businessId,
  setOpenVirtualTour,
  onUpdated,
}) => {


    return (
        <div
            className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

            {/* <!-- MODAL CARD --> */}
            <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:h-[] sm:w-[550px] p-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label htmlFor="virtual-tour-toggle"
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer">
                    ×
                </label>

                {/* <!-- HEADER --> */}
                <h2 className="text-lg font-bold text-gray-700 mb-4">Add Virtual Tour</h2>

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
    );
};

export default VirtualTour;


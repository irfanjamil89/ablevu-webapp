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

interface PropertyImagePopupProps {
  businessId: string;
  setOpenPropertyImagePopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const PropertyImagePopup: React.FC<PropertyImagePopupProps> = ({
  businessId,
  setOpenPropertyImagePopup,
  onUpdated,
}) => {


    return (
        <div
            className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

            {/* <!-- MODAL CARD --> */}
            <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[520px] p-6 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label onClick={()=> setOpenPropertyImagePopup(false)}
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
                        <label onClick={()=> setOpenPropertyImagePopup(false)}
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

export default PropertyImagePopup
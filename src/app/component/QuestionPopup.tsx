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

interface QuestionPopupProps {
  businessId: string;
  setOpenQuestionPopup: React.Dispatch<React.SetStateAction<boolean>>;
  onUpdated?: (b: BusinessProfile) => void;
}

// ---------- Component ----------
const QuestionPopup: React.FC<QuestionPopupProps> = ({
  businessId,
  setOpenQuestionPopup,
  onUpdated,
}) => {


  return (
    <div
              className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">

              {/* <!-- MODAL CARD --> */}
              <div
                className="bg-white rounded-3xl shadow-2xl w-11/12 sm:w-[540px] py-8 px-8 relative">

                {/* <!-- CLOSE BUTTON --> */}
                <label onClick={()=> setOpenQuestionPopup(false)}  
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
                    <label onClick={()=> setOpenQuestionPopup(false)}
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
  )
}

export default QuestionPopup
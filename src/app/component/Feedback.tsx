import React from "react";

interface FeedbackProps {
  setOpenFeedbackModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Feedback: React.FC<FeedbackProps> = ({ setOpenFeedbackModal }) => {
  return (
    <div className="fixed inset-0 bg-[#000000b4] flex items-center justify-center z-50">
      {/* MODAL CARD */}
      <div className="bg-white rounded-3xl shadow-2xl w-11/12 h-fit sm:w-[550px] p-8 relative">
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpenFeedbackModal(false)}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-2xl font-bold cursor-pointer"
        >
          ×
        </button>

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Share Feedback About AbleVu
        </h2>

        {/* FORM */}
        <form className="space-y-5" onSubmit={(e) => {
          e.preventDefault();
          // Handle form submission here
          console.log('Feedback submitted');
          setOpenFeedbackModal(false);
        }}>
          {/* Business Category */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Select Feedback type
            </label>
            <select className="w-full border hover:border-[#0519CE] border-gray-300 rounded-lg px-3 py-3 text-sm focus:ring-1 focus:ring-[#0519CE] outline-none">
              <option>Select</option>
              <option>Results aren&apos;t relevant</option>
              <option>Request to add a specific business</option>
              <option>Duplicate Business</option>
              <option>Suggest an improvement</option>
              <option>Report a bug</option>
              <option>Any other feedback</option>
            </select>
          </div>

          {/* Business Description */}
          <div>
            <label className="block text-md font-medium text-gray-700 mb-2">
              Comments
            </label>
            <textarea
              placeholder="Type here..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm hover:border-[#0519CE] focus:ring-1 focus:ring-[#0519CE] outline-none"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpenFeedbackModal(false)}
              className="px-4 py-3 w-full text-center text-sm font-bold border border-gray-300 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-3 w-full text-center text-sm font-bold bg-[#0519CE] text-white cursor-pointer rounded-full hover:bg-blue-700"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
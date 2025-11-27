import React from "react";

interface SuccessmodalProps {
  setOpenSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
           
}

const Successmodal: React.FC<SuccessmodalProps> = ({
  setOpenSuccessModal,
  setOpenLoginModal,
  setOpenSignupModal,
}) => {
  // Close modal function
  const onClose = () => {
    setOpenSignupModal(false); // Close the signup modal
    setOpenSuccessModal(false); // Close the forgot password modal if needed
    setOpenLoginModal(true); // Close the login modal
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[350px] text-center p-8 relative">
        {/* Check Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#0519CE] rounded-full p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Modal content */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Success</h2>
        <p className="text-gray-600 text-sm mb-6">Your account has been created. Please login to continue</p>

        {/* OK Button */}
        <button
          onClick={onClose}
          className="bg-[#0519CE] hover:bg-[#0212a0] text-white font-medium rounded-full px-6 py-2 w-full transition-all cursor-pointer"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Successmodal;

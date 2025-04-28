import React from "react";

const VerifyOtp = ({ visible, onClose }) => {
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="h-[90vh] md:h-[75vh] w-[90vw] md:w-[70vw] flex flex-col items-center justify-center mt-16 rounded-lg bg-white shadow-lg overflow-auto p-6">
        <div className="flex justify-center gap-4 mb-8">
          <input
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            maxLength="1"
            className="w-12 h-12 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <button className="px-6 py-2 bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-md shadow-md transition duration-300">
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;

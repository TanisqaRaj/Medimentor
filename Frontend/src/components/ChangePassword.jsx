import React, { useState } from "react";
import axios from "axios";

const ChangePassword = ({ visible, onClose }) => {
  const [password, setPassword] = useState("");
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const handleChangePassword = async () => {
    try {
      const response = await axios.put(" https://medimentorbackend.onrender.com/auth/update-password ");
      alert("Password changed successfully!");
      if (response.data.success) {
        alert("Password changed successfully!");
      } else {
        alert("Failed to change password: " + response.data.message);
      }
    } catch (error) {
      console.error("Failed to change password", error);
    }
  };

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="h-[90vh] md:h-[75vh] w-[90vw] md:w-[70vw] flex flex-col items-center justify-center mt-16 rounded-lg bg-white shadow-lg overflow-auto p-6">
        <label
          className="block text-gray-600 text-2xl font-semibold mb-2"
          htmlFor="password"
        >
          Enter new password
        </label>
        <input
          className=" text-sm shadow appearance-none border rounded  py-2 sm:py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className=" mt-4 px-6 py-2 bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-md shadow-md transition duration-300"
          onClick={handleChangePassword}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

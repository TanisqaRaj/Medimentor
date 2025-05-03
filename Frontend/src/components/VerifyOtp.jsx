import React, { useState, useRef } from "react";
import ChangePassword from "./ChangePassword";
import axios from "axios";

const VerifyOtp = ({ visible, onClose }) => {
  const [inputArr, setInputArr] = useState(new Array(4).fill(""));
  const [appVisible, setAppVisible] = useState(false);
  const [msg, setMsg] = useState("");

  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const handleInput = (event, index) => {
    const val = event.target.value;

    if (!/^\d$/.test(val)) return;

    const newArr = [...inputArr];
    newArr[index] = val;
    setInputArr(newArr);

    if (index < refs.length - 1) {
      refs[index + 1].current.focus();
    }
  };

  const handleKey = (event, index) => {
    if (event.key === "Backspace") {
      const newArr = [...inputArr];
      newArr[index] = "";
      setInputArr(newArr);

      if (index > 0) refs[index - 1].current.focus();
    } else if (event.key === "ArrowRight" && index < refs.length - 1) {
      refs[index + 1].current.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      refs[index - 1].current.focus();
    }
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text").slice(0, 4);
    const pasteArray = pasteData.split("").filter((char) => /^\d$/.test(char));

    const newArr = new Array(4).fill("");
    pasteArray.forEach((char, idx) => {
      newArr[idx] = char;
    });
    setInputArr(newArr);

    const nextIndex = pasteArray.length < 4 ? pasteArray.length : 3;
    refs[nextIndex].current.focus();
  };

  const VerifyOTP = async () => {
    const otp = inputArr.join("");

    try {
      const response = await axios.post("https://medimentorbackend.onrender.com/auth/verify-otp", { otp });
      if (response.data.success) {
        alert("OTP verified successfully!");
        return true;
      } else {
        alert("Failed to verify OTP: " + response.data.message);
        return false;
      }
    } catch (error) {
      console.error("Failed to verify OTP", error);
      alert("An error occurred while verifying OTP.");
      return false;
    }
  };

  const handleChangePassword = async () => {
    if (inputArr.includes("")) {
      setMsg("Please enter all OTP digits.");
      return;
    }

    // const result = await VerifyOTP();
    // if (result) {
      setAppVisible(true);
      setMsg("");
    // }
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
          {inputArr.map((value, index) => (
            <input
              key={index}
              className="border rounded w-16 h-16 text-center text-xl"
              maxLength="1"
              ref={refs[index]}
              value={value}
              type="text"
              onPaste={handlePaste}
              onKeyDown={(e) => handleKey(e, index)}
              onChange={(e) => handleInput(e, index)}
            />
          ))}
        </div>

        {msg && <p className="text-red-500 mb-4">{msg}</p>}

        <button
          className="px-6 py-2 bg-emerald-400 hover:bg-emerald-500 text-white font-semibold rounded-md shadow-md transition duration-300"
          onClick={handleChangePassword}
        >
          Verify OTP
        </button>
      </div>

      <ChangePassword onClose={() => setAppVisible(false)} visible={appVisible} />
    </div>
  );
};

export default VerifyOtp;

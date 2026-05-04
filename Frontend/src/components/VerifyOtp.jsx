import React, { useState, useRef } from "react";
import ChangePassword from "./ChangePassword";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const VerifyOtp = ({ visible, onClose, email }) => {
  const [inputArr, setInputArr] = useState(new Array(4).fill(""));
  const [appVisible, setAppVisible] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [msg, setMsg] = useState("");
  const refs = [useRef(), useRef(), useRef(), useRef()];

  const handleOnClose = (e) => { if (e.target.id === "container") onClose(); };

  const handleInput = (event, index) => {
    const val = event.target.value;
    if (!/^\d$/.test(val)) return;
    const newArr = [...inputArr];
    newArr[index] = val;
    setInputArr(newArr);
    if (index < refs.length - 1) refs[index + 1].current.focus();
  };

  const handleKey = (event, index) => {
    if (event.key === "Backspace") {
      const newArr = [...inputArr];
      newArr[index] = "";
      setInputArr(newArr);
      if (index > 0) refs[index - 1].current.focus();
    } else if (event.key === "ArrowRight" && index < refs.length - 1) refs[index + 1].current.focus();
    else if (event.key === "ArrowLeft" && index > 0) refs[index - 1].current.focus();
  };

  const handlePaste = (event) => {
    const pasteData = event.clipboardData.getData("text").slice(0, 4);
    const pasteArray = pasteData.split("").filter((c) => /^\d$/.test(c));
    const newArr = new Array(4).fill("");
    pasteArray.forEach((char, idx) => { newArr[idx] = char; });
    setInputArr(newArr);
    refs[Math.min(pasteArray.length, 3)].current.focus();
  };

  const handleChangePassword = async () => {
    if (inputArr.includes("")) { setMsg("Please enter all OTP digits."); return; }
    const otp = inputArr.join("");
    try {
      const response = await axios.post(`${BACKEND}/auth/verify-otp`, { email, otp });
      if (response.data.success) {
        setResetToken(response.data.resetToken);
        setAppVisible(true);
        setMsg("");
      } else {
        setMsg(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      setMsg(error.response?.data?.message || "Verification failed");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center" id="container" onClick={handleOnClose}>
      <div className="h-auto w-[90vw] md:w-[400px] flex flex-col items-center justify-center rounded-2xl bg-white shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-500 mb-6">Sent to {email}</p>
        <div className="flex justify-center gap-4 mb-6">
          {inputArr.map((value, index) => (
            <input
              key={index}
              className="border-2 rounded-lg w-14 h-14 text-center text-xl font-bold focus:border-emerald-500 outline-none"
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
        {msg && <p className="text-red-500 text-sm mb-4">{msg}</p>}
        <button
          className="px-8 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          onClick={handleChangePassword}
        >
          Verify OTP
        </button>
      </div>
      <ChangePassword onClose={() => setAppVisible(false)} visible={appVisible} resetToken={resetToken} />
    </div>
  );
};

export default VerifyOtp;

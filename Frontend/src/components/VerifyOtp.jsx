import { useState, useRef } from "react";
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-sm md:p-xl" id="container" onClick={handleOnClose}>
      <div className="w-full max-w-md flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xl p-lg">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-[32px]">lock_reset</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Enter OTP</h2>
        <p className="font-body-md text-body-md text-tertiary mb-lg text-center">We&apos;ve sent a 4-digit code to <br/><span className="font-medium text-on-surface">{email}</span></p>
        
        <div className="flex justify-center gap-4 mb-lg w-full">
          {inputArr.map((value, index) => (
            <input
              key={index}
              className="border border-outline-variant bg-surface text-on-surface rounded-lg w-14 h-14 text-center text-xl font-bold focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
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
        {msg && <p className="text-error font-caption text-caption mb-4 text-center">{msg}</p>}
        
        <button
          className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-container flex items-center justify-center gap-xs"
          onClick={handleChangePassword}
        >
          Verify OTP
          <span className="material-symbols-outlined">check_circle</span>
        </button>
      </div>
      <ChangePassword onClose={() => setAppVisible(false)} visible={appVisible} resetToken={resetToken} />
    </div>
  );
};

export default VerifyOtp;

import React, { useState } from "react";
import VerifyOtp from "./VerifyOtp";
import { useForm } from "react-hook-form";

const ForgotpasswordEmail = () => {
  const [appVisible, setAppVisible] = useState(false);
  const handleOnClose = () => setAppVisible(false);
  const {
    register,
    formState: { errors },
  } = useForm();

  const handleVerifyOtp = () => {
    setAppVisible(true);
  };
  
  return (
    <div className="w-full h-[100vh] overflow-auto">
      <div className="m-10">
        <label>Email</label>
        <input
          {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email address",
            },
          })}
          type="email"
          placeholder="Enter your email..."
          className="w-full px-3 mb-2 py-1 border border-gray-300 rounded-lg"
        />
        {errors.email && <p className="text-red-700">{errors.email.message}</p>}

        <button
          className="p-1 bg-emerald-200 rounded-lg"
          onClick={handleVerifyOtp}
        >
          Send OTP
        </button>
      </div>
      <VerifyOtp onClose={handleOnClose} visible={appVisible} />
    </div>
  );
};

export default ForgotpasswordEmail;

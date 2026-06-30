import React, { useState } from "react";
import VerifyOtp from "./VerifyOtp";
import { useForm } from "react-hook-form";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const ForgotpasswordEmail = () => {
  const [appVisible, setAppVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const handleOnClose = () => setAppVisible(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND}/auth/send-otp`, { email: data.email });
      if (response.data.success) {
        setEmail(data.email);
        setAppVisible(true);
      } else {
        alert("Failed to send OTP: " + response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface flex items-center justify-center p-sm md:p-xl">
      <div className="w-full max-w-md bg-surface-container-lowest p-lg rounded-xl border border-surface-container-highest shadow-sm">
        <div className="text-center mb-lg">
          <div className="flex items-center gap-xs text-primary mb-xl justify-center">
            <span className="material-symbols-outlined filled text-display-lg text-primary">health_and_safety</span>
            <span className="font-display-lg text-headline-lg tracking-tight text-on-surface">MediMentor</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Forgot Password</h2>
          <p className="font-body-md text-body-md text-tertiary">Enter your email to receive an OTP.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
          <div>
            <label className="block font-label-md text-label-md text-on-surface-variant mb-base">Email Address</label>
            <div className="relative">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-sm flex items-center pointer-events-none text-tertiary">
                <span className="material-symbols-outlined">mail</span>
              </div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
                type="email"
                placeholder="Enter your email..."
                className="block w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-tertiary-fixed-dim"
              />
            </div>
            {errors.email && <p className="text-error font-caption text-caption mt-1">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-container flex items-center justify-center gap-xs disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {loading ? "Sending..." : "Send OTP"}
            {!loading && <span className="material-symbols-outlined">send</span>}
          </button>
        </form>
      </div>
      <VerifyOtp onClose={handleOnClose} visible={appVisible} email={email} />
    </div>
  );
};

export default ForgotpasswordEmail;

import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import api from "../../../api";
import { useSelector } from "react-redux";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

export default function Appointment({ visible, onClose, doctorId }) {
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const userId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.accessToken);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  //API call
  async function onSubmit(data) {
    const appointmentData = { ...data, doctorId, userId };
    console.log("DoctorId", doctorId);
    console.log("userId", userId);

    try {
      const response = await api.post(
        `${BACKEND}/appointments/create`,
        appointmentData
      );
      if (response.data.success) {
        console.log(response.data);
        onClose();
        setTimeout(() => {
          alert("Appointment booked successfully!");
        }, 500);
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [age, setAge] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const birthdate = watch("birthdate");

  useEffect(() => {
    if (birthdate) {
      const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }
        return age;
      };
      const calculatedAge = calculateAge(birthdate);
      setAge(calculatedAge);
      setValue("age", calculatedAge);
    } else {
      setAge(""); // Reset age if no birthdate is selected
    }
  }, [birthdate, setValue]);

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start pt-16 z-[200] px-4"
      id="container"
      onClick={handleOnClose}
    >
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-auto max-h-[85vh] font-manrope border border-outline-variant/50">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant/30 sticky top-0 bg-surface-container-lowest z-10">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Book Appointment</h2>
            <p className="font-caption text-caption text-on-surface-variant mt-0.5">Fill in your details to confirm your visit</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          {/* Patient Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Patient Name</label>
            <input
              {...register("patientName", {
                required: true,
                maxLength: { value: 100, message: "Max length is 100 characters." },
                minLength: { value: 2, message: "Min length is 2 characters." },
              })}
              placeholder="Enter patient name..."
              type="text"
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
            />
            {errors.patientName && <p className="text-error text-xs font-label-md">{errors.patientName.message}</p>}
          </div>

          {/* DOB + Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Date of Birth</label>
              <input
                {...register("birthdate", { required: true })}
                type="date"
                max={today}
                defaultValue={today}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
              />
              {errors.birthdate && <p className="text-error text-xs font-label-md">{errors.birthdate.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Age</label>
              <input
                {...register("age", { required: true })}
                value={age}
                readOnly
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant/30 rounded-lg text-on-surface-variant font-body-md cursor-not-allowed"
              />
            </div>
          </div>

          {/* Gender + Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Gender</label>
              <div className="flex items-center gap-4 pt-2">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" {...register("gender")} value={g} id={g} className="w-4 h-4 accent-emerald-600" />
                    <span className="font-body-md text-sm text-on-surface capitalize">{g}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Contact</label>
              <input
                {...register("patientContact", {
                  required: true,
                  pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid 10-digit phone number." },
                })}
                type="text"
                placeholder="10-digit phone number..."
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
              />
              {errors.patientContact && <p className="text-error text-xs font-label-md">{errors.patientContact.message}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
            />
            {errors.email && <p className="text-error text-xs font-label-md">{errors.email.message}</p>}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface">Address</label>
            <input
              {...register("patientAddress", { required: true })}
              type="text"
              placeholder="Enter your address..."
              className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
            />
            {errors.patientAddress && <p className="text-error text-xs font-label-md">{errors.patientAddress.message}</p>}
          </div>

          {/* Title + Disease */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Title / Condition</label>
              <input
                {...register("title", { required: true })}
                type="text"
                placeholder="e.g. Chest pain, Headache..."
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
              />
              {errors.title && <p className="text-error text-xs font-label-md">{errors.title.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Description</label>
              <textarea
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface placeholder:text-outline font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all resize-none h-[46px]"
                placeholder="Describe your symptoms..."
                {...register("desc", { required: true })}
              />
              {errors.desc && <p className="text-error text-xs font-label-md">{errors.desc.message}</p>}
            </div>
          </div>

          {/* Mode + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Mode of Consultation</label>
              <div className="flex items-center gap-5 pt-2">
                {["offline", "online"].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" {...register("mode")} value={m} id={m} className="w-4 h-4 accent-emerald-600" />
                    <span className="font-body-md text-sm text-on-surface capitalize">{m}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface">Expected Date</label>
              <input
                {...register("expectedDate", { required: true })}
                type="date"
                min={today}
                defaultValue={today}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all"
              />
              {errors.expectedDate && <p className="text-error text-xs font-label-md">{errors.expectedDate.message}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md rounded-lg shadow-sm transition-colors disabled:opacity-60 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  Confirm Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
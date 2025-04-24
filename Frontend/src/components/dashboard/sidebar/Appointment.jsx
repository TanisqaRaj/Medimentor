import React from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Appointment({ visible, onClose, doctorId }) {
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const userId = useSelector((state) => state.auth.user._id);

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
      const response = await axios.post(
        "https://medimentorbackend.onrender.com/appointments/create",
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
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="h-[90vh] md:h-[75vh] w-[90vw] md:w-[70vw] flex mt-16  rounded-lg bg-white shadow-lg overflow-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full min-w-10 p-2 md:p-10 space-y-3 bg-white  rounded-lg"
        >
          {/* Patient name */}
          <div className="flex flex-col gap-1 md:w-fit">
            <label className="font-medium text-gray-800">Patient Name</label>
            <input
              {...register("patientName", {
                required: true,
                maxLength: {
                  value: 100,
                  message: "Max length is 100 characters.",
                },
                minLength: {
                  value: 2,
                  message: "Min length is 2 characters.",
                },
              })}
              placeholder="Enter patient name..."
              type="text"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg"
            />
            {errors.patientname && (
              <p className="text-red-700 text-sm">
                {errors.patientName.message}
              </p>
            )}
          </div>

          {/* DOB */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-800">Date of Birth</label>
              <input
                {...register("birthdate", { required: true })}
                type="date"
                max={today}
                defaultValue={today}
                className="w-full px-3 py-1 border border-gray-300 rounded-lg"
              />
              {errors.birthdate && (
                <p className="text-red-700 text-sm">
                  {errors.birthdate.message}
                </p>
              )}
            </div>
            {/* Age */}
            <div className="flex flex-col w-full">
              <label className="font-medium text-gray-800">Age</label>
              <input
                {...register("age", { required: true })}
                value={age}
                readOnly
                className="w-full px-3 py-1 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* contact and gender */}
          <div className="flex flex-col md:flex-row gap-x-3 justify-between items-center">
            {/* Gender */}
            <div className="flex gap-0.5 md:gap-2 items-center w-full">
              <label className="font-medium text-gray-800">Gender</label>
              <input
                type="radio"
                {...register("gender")}
                value="male"
                id="male"
              />
              <label
                htmlFor="male"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Male
              </label>
              <input
                type="radio"
                {...register("gender")}
                value="female"
                id="female"
              />
              <label
                htmlFor="female"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Female
              </label>
              <input
                type="radio"
                {...register("gender")}
                value="other"
                id="other"
              />
              <label
                htmlFor="other"
                className="text-sm text-gray-700 cursor-pointer"
              >
                Other
              </label>
            </div>

            {/* Contact */}
            <div className="flex flex-row gap-2 w-full">
              <label className="font-medium text-gray-800">Contact</label>
              <input
                {...register("patientContact", {
                  required: true,
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit phone number.",
                  },
                })}
                type="text"
                placeholder="Enter your contact no..."
                className="w-full px-3 py-1 border border-gray-300 rounded-lg"
              />
              {errors.contact && (
                <p className="text-red-700 text-sm">{errors.contact.message}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-row gap-2">
            <label className="font-medium text-gray-800">Email</label>
            <input
              {...register("email", {
                required: true,
              })}
              type="text"
              placeholder="Enter your email..."
              className="w-full px-3 py-1 border border-gray-300 rounded-lg"
            />
            {errors.email && (
              <p className="text-red-700 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-row gap-2">
            <label className="font-medium text-gray-800">Adress</label>
            <input
              {...register("patientAddress", {
                required: true,
              })}
              type="text"
              placeholder="Enter your address"
              className="w-full px-3 py-1 border border-gray-300 rounded-lg"
            />
            {errors.address && (
              <p className="text-red-700 text-sm">
                {errors.patientAddress.message}
              </p>
            )}
          </div>

          {/* Title and disease */}
          <div className="flex flex-col md:flex-row gap-y-2 md:gap-y-0 justify-between items-center gap-x-3">
            {/* title */}
            <div className="flex flex-row gap-2 w-full">
              <label className="font-medium text-gray-800">Title</label>
              <input
                {...register("title", {
                  required: true,
                })}
                type="text"
                placeholder="Enter your Disease name..."
                className="w-full px-3 py-1 border border-gray-300 rounded-lg"
              />
              {errors.title && (
                <p className="text-red-700 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Disease */}
            <div className="flex gap-1 w-full items-center">
              <label className="font-medium text-gray-800">Disease</label>
              <textarea
                className="w-full px-3 py-2 border h-10 rounded-lg"
                placeholder="Write about your disease..."
                {...register("desc", { required: true })}
              />
              {errors.disease && (
                <p className="text-red-700 text-sm">{errors.disease.message}</p>
              )}
            </div>
          </div>

          {/* Mode and Appointment date */}
          <div className="flex flex-col md:flex-row gap-6 justify-center md:items-center">
            {/* Mode */}
            <div className="flex flex-col w-fit md:w-1/2">
              <label className="font-medium text-gray-800">
                Mode of Consultation
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("mode")}
                    value="offline"
                    id="offline"
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="offline"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Offline
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("mode")}
                    value="online"
                    id="online"
                    className="w-4 h-4"
                  />
                  <label
                    htmlFor="online"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Online
                  </label>
                </div>
              </div>
            </div>

            {/* Appointment Date */}
            <div className="flex flex-col w-fit md:w-1/2">
              <label className="font-medium text-gray-800">
                Select expected Date of Appointment
              </label>
              <input
                {...register("expectedDate", { required: true })}
                type="date"
                min={today}
                defaultValue={today}
                className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              {errors.appodate && (
                <p className="mt-1 text-sm text-red-700">
                  {errors.expectedDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 mb-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

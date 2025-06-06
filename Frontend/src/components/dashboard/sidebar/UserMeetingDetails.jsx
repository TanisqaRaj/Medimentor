import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
const UserMeetingDetails = ({ visible, onClose, selectedAppointmentId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  console.log("id is ", selectedAppointmentId);
  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://medimentorbackend.onrender.com/appointments/veify",
        {
          appointmentID: selectedAppointmentId,
          meetingPassword: data.password,
        }
      );

      const { success, meetingUrl } = response?.data || {};
      if (success && meetingUrl) {
        const url = meetingUrl.startsWith("http")
          ? meetingUrl
          : `https://${meetingUrl}`;
        const popup = window.open(url, "_blank");

        if (!popup) {
          alert("Popup blocked! Please allow popups for this site.");
        }
      } else {
        alert("Incorrect password or meeting URL not available.");
      }
    } catch (error) {
      alert("Something went wrong.");
      console.error(error);
    } finally {
      onClose();
    }
  };

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div className="h-[70vh] w-[70vw] flex  rounded-lg bg-white shadow-lg overflow-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full min-w-10 p-10 space-y-3 bg-white  rounded-lg"
        >
          {/* password */}
          <div className="flex flex-col gap-1">
            <label className="font-medium text-gray-800">Password</label>
            <input
              {...register("password", {
                required: true,
              })}
              type="text"
              placeholder="Enter your password..."
              className="w-full px-3 py-1 border border-gray-300 rounded-lg"
            />
            {errors.password && (
              <p className="text-red-700 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 mb-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600"
              disabled={isSubmitting}
              // onClick={passwordVerify}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserMeetingDetails;

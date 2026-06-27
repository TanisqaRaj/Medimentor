import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import api from "../../../api";
import VideoCall from "../../VideoCall";
import { removeMeet } from "../../../reduxslice/ScheduleMeetSlice";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const UserMeetingDetails = ({ visible, onClose, selectedAppointmentId }) => {
  const dispatch = useDispatch();
  const [inCall, setInCall] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [roomId, setRoomId] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleOnClose = (e) => { if (e.target.id === "container") onClose(); };

  const onSubmit = async ({ password }) => {
    try {
      const response = await api.post(`${BACKEND}/appointments/veify`, {
        appointmentID: selectedAppointmentId,
        meetingPassword: password,
      });

      const { success, meetingUrl } = response?.data || {};
      if (success && meetingUrl) {
        setRoomId(meetingUrl); // meetingUrl is the appointmentId used as room name
        setInCall(true);
        onClose();
      } else {
        alert("Incorrect password or meeting not available.");
      }
    } catch {
      alert("Something went wrong.");
    }
  };

  const handleEndCall = () => {
    setInCall(false);
    setRoomId(null);
    setCallEnded(true);
    dispatch(removeMeet(selectedAppointmentId));
  };

  // Show video call if verified
  if (inCall && roomId) {
    return <VideoCall roomId={roomId} onEnd={handleEndCall} />;
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-[60] p-4" id="container" onClick={handleOnClose}>
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden font-manrope" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Join Video Call</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <p className="font-body-md text-body-md text-on-surface-variant">Enter the meeting password provided by your doctor.</p>

          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">lock</span>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Enter meeting password..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            {errors.password && <p className="text-error font-caption text-caption">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 text-on-surface-variant font-label-md hover:bg-surface-container rounded-xl transition-all">
              Cancel
            </button>
            {callEnded ? null : <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-white bg-emerald-600 rounded-xl font-label-md hover:bg-emerald-700 transition-all shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">videocam</span>
              {isSubmitting ? "Joining..." : "Join Call"}
            </button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserMeetingDetails;

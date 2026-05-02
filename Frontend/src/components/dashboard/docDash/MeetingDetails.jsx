import React from "react";
import { useForm } from "react-hook-form";


const MeetingDetails = ({ visible, onClose, appointmentId, appointmentState, updateAppointmentStatus }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  const onSubmit = async (data) => {
    const { link, password } = data;
    await updateAppointmentStatus(appointmentId, appointmentState, link, password);
    onClose();
  };

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4"
      id="container"
      onClick={handleOnClose}
    >
      <div 
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden font-manrope"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Meeting Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5"
        >
          {/* meeting link */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface">Meeting Link</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">link</span>
              <input
                {...register("link", {
                  required: "Meeting link is required",
                })}
                type="text"
                placeholder="https://zoom.us/j/..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            {errors.link && (
              <p className="text-error font-caption text-caption">{errors.link.message}</p>
            )}
          </div>

          {/* password */}
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">lock</span>
              <input
                {...register("password", {
                  required: "Password is required",
                })}
                type="text"
                placeholder="Enter password..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-error font-caption text-caption">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-on-surface-variant font-label-md hover:bg-surface-container rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-emerald-600 rounded-xl font-label-md hover:bg-emerald-700 transition-all shadow-sm hover:shadow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingDetails;

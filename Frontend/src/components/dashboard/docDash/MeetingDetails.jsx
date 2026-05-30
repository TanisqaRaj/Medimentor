import { useForm } from "react-hook-form";

const MeetingDetails = ({ visible, onClose, appointmentId, appointmentState, updateAppointmentStatus }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleOnClose = (e) => { if (e.target.id === "container") onClose(); };

  const onSubmit = async ({ password }) => {
    // Use appointmentId as the WebRTC room name — no external link needed
    await updateAppointmentStatus(appointmentId, appointmentState, appointmentId, password);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[60] p-4" id="container" onClick={handleOnClose}>
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden font-manrope" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md text-on-surface">Set Meeting Password</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Set a password for the video call. The patient will need this to join.
          </p>

          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">lock</span>
              <input
                {...register("password", { required: "Password is required" })}
                type="text"
                placeholder="Enter a password for the call..."
                className="w-full pl-10 pr-4 py-2 bg-surface-container border border-outline-variant/50 rounded-xl text-on-surface text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>
            {errors.password && <p className="text-error font-caption text-caption">{errors.password.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2 text-on-surface-variant font-label-md hover:bg-surface-container rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 text-white bg-emerald-600 rounded-xl font-label-md hover:bg-emerald-700 transition-all shadow-sm">
              {isSubmitting ? "Saving..." : "Approve & Set Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeetingDetails;

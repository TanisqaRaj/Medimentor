import React, { useState } from "react";
import UserMeetingDetails from "./UserMeetingDetails";
import { useNavigate } from "react-router-dom";

const DetailedAppoitmentList = ({ show, close, appointment }) => {
  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(false);
  const navigate = useNavigate ();
  const handleClose = (e) => {
    if (e.target.id === "detAppList") close();
  };

  const handleOpenMap = () => {
    //navigate("/map");
  };

  const handlePopup= () => {
    console.log("map.....");
  };

  const handleMeeting = () => {
    setMeetingDetailsVisible(true);
  };

  const handleMeetingDetailsClose = () => {
    setMeetingDetailsVisible(false);
  };

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      id="detAppList"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-3xl bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden font-manrope flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/40">
          <h2 className="font-headline-md text-headline-md text-on-surface">Appointment Details</h2>
          <button
            onClick={close}
            className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row overflow-auto flex-1">
          {/* Patient Panel */}
          <div className="flex-1 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-outline-variant/30">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container">person</span>
              </div>
              <h3 className="font-headline-md text-on-surface text-base font-semibold">Patient Details</h3>
            </div>

            {[
              { label: "Name", value: appointment?.patient?.name },
              { label: "Contact", value: appointment?.patient?.phone },
              { label: "Email", value: appointment?.patient?.email },
              { label: "Title", value: appointment?.appointment?.title },
              { label: "Description", value: appointment?.appointment?.description },
              { label: "Mode", value: appointment?.appointment?.mode },
              { label: "Date", value: appointment?.appointment?.date ? new Date(appointment.appointment.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—" },
              { label: "Status", value: appointment?.status },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-caption text-caption text-outline">{label}</div>
                <div className="font-label-md text-label-md text-on-surface capitalize">{value || "—"}</div>
              </div>
            ))}

            {/* Online approved → Join meeting */}
            {appointment?.appointment?.mode === "online" && appointment?.status === "approved" && (
              <div className="mt-2 pt-4 border-t border-surface-container-high">
                <p className="font-label-md text-label-md text-on-surface mb-2">Your session is ready</p>
                <button
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md px-5 py-2 rounded-lg transition-colors"
                  onClick={handleMeeting}
                >
                  <span className="material-symbols-outlined text-base">videocam</span>
                  Join Meeting
                </button>
              </div>
            )}

            {/* Offline approved → Location */}
            {appointment?.appointment?.mode === "offline" && appointment?.status === "approved" && (
              <div className="mt-2 pt-4 border-t border-surface-container-high">
                <p className="font-label-md text-label-md text-on-surface mb-2">In-person appointment confirmed</p>
                <button
                  className="flex items-center gap-2 bg-surface-container hover:bg-primary-container/10 border border-outline-variant/50 hover:border-primary-container/30 text-on-surface-variant hover:text-primary-container font-label-md px-5 py-2 rounded-lg transition-all"
                  onClick={handleOpenMap}
                >
                  <span className="material-symbols-outlined text-base">location_on</span>
                  View Location
                </button>
              </div>
            )}

            <button
              className="mt-2 flex items-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 font-label-md px-4 py-2 rounded-lg transition-colors w-fit"
              onClick={handlePopup}
            >
              <span className="material-symbols-outlined text-base">cancel</span>
              Cancel Appointment
            </button>
          </div>

          {/* Doctor Panel */}
          <div className="flex-1 p-6 flex flex-col gap-4 bg-primary-container/5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container">stethoscope</span>
              </div>
              <h3 className="font-headline-md text-on-surface text-base font-semibold">Doctor Details</h3>
            </div>

            {[
              { label: "Name", value: appointment?.doctor?.name },
              { label: "Username", value: appointment?.doctor?.username },
              { label: "Contact", value: appointment?.doctor?.phone },
              { label: "Gender", value: appointment?.doctor?.gender },
              { label: "Email", value: appointment?.doctor?.email },
              { label: "Bio", value: appointment?.doctor?.bio },
              { label: "Department", value: appointment?.doctor?.department },
              { label: "Experience", value: appointment?.doctor?.experience },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="font-caption text-caption text-outline">{label}</div>
                <div className="font-label-md text-label-md text-on-surface">{value || "—"}</div>
              </div>
            ))}

            {/* Specialties */}
            {appointment?.doctor?.profession?.length > 0 && (
              <div>
                <div className="font-caption text-caption text-outline mb-1.5">Specialties</div>
                <div className="flex flex-wrap gap-2">
                  {appointment.doctor.profession.map((p, i) => (
                    <span key={i} className="px-2.5 py-1 bg-surface-container text-on-surface-variant font-caption text-xs rounded-full border border-outline-variant/40">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <UserMeetingDetails visible={meetingDetailsVisible} onClose={handleMeetingDetailsClose} />
    </div>
  );
};

export default DetailedAppoitmentList;
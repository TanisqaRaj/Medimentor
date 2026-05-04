import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useSelector } from "react-redux";
import MeetingDetails from "./MeetingDetails";
import Map from "../../Map";
import VideoCall from "../../VideoCall";
import socket from "../../../socket";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const IncomingRequest = () => {
  const [appointments, setAppointments] = useState([]);
  const [appVisible, setAppVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [appointmentId, setAppointmentId] = useState("");
  const [action, setAction] = useState("");
  const [position, setPosition] = useState([51.505, -0.09]);
  const [activeCall, setActiveCall] = useState(null);
  const [endedCalls, setEndedCalls] = useState(new Set()); // appointmentId of active call

  const doctorId = useSelector((state) => state.auth.doctor._id);
  const token = useSelector((state) => state.auth.accessToken);

  const fetchAppointments = async () => {
    try {
      
      const response = await api.get(`${BACKEND}/appointments/docapp/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data?.success) {
        setAppointments([
          ...response.data.pendingAppointments,
          ...response.data.approvedAppointments,
        ]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const openPasswordPopup = (id) => { setAppointmentId(id); setAction("approved"); setAppVisible(true); };
  const openMap = (id) => { setAppointmentId(id); setAction("approved"); setMapVisible(true); };

  const rejectAction = async (id) => {
    setAppointmentId(id);
    setAction("rejected");
    await updateAppointmentStatus(id, "rejected");
  };

  const updateAppointmentStatus = (appointmentId, appointmentState, meetingUrl = null, meetingPassword = null, location = null) => {
    return new Promise((resolve) => {
      socket.emit("updateAppointmentStatus", { appointmentId, appointmentState, meetingUrl, meetingPassword, location }, async (response) => {
        if (response.success) {
          await fetchAppointments();
        } else {
          console.error("Failed:", response.message);
        }
        resolve(response);
      });
    });
  };

  if (activeCall) {
    return <VideoCall roomId={activeCall} onEnd={() => { setActiveCall(null); setEndedCalls((prev) => new Set(prev).add(activeCall)); }} />;
  }

  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Appointment Requests</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Review and manage incoming consultations.</p>
      </div>

      {appointments.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-surface-container-low rounded-2xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">inbox</span>
          <p className="font-headline-md text-on-surface-variant">No pending requests</p>
          <p className="font-body-md text-outline mt-1 text-sm">New requests will appear here as they arrive.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((item, index) => (
            <div key={index} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm hover:shadow-md transition-all p-6 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-xl">person</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface">{item.patient?.name}</h3>
                    <p className="font-caption text-caption text-outline">{item.patient?.age} yrs • {item.patient?.gender}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full font-label-md text-[10px] font-bold uppercase tracking-wider ${item.appointment?.mode === "online" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                  {item.appointment?.mode}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 py-2 border-y border-outline-variant/30">
                <div>
                  <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-0.5">Concern</div>
                  <div className="font-body-md text-sm text-on-surface font-medium">{item.appointment?.title}</div>
                  <p className="font-caption text-xs text-on-surface-variant line-clamp-2 mt-1">{item.appointment?.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-0.5">Date</div>
                    <div className="font-label-md text-sm text-on-surface">{item.appointment?.date ? new Date(item.appointment.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-0.5">Contact</div>
                    <div className="font-label-md text-sm text-on-surface">{item.patient?.phone}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                {item.status !== "approved" ? (
                  <button
                    className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-label-md py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    onClick={() => item.appointment?.mode === "offline" ? openMap(item.appointmentID) : openPasswordPopup(item.appointmentID)}
                  >
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    Accept
                  </button>
                ) : (
                  // Approved online → show Join Call button
                  item.appointment?.mode === "online" && (
                    <button
                      className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-label-md py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                      onClick={() => setActiveCall(item.appointmentID)}
                      disabled={endedCalls.has(item.appointmentID)}
                    >
                      <span className="material-symbols-outlined text-base">videocam</span>
                      Join Call
                    </button>
                  )
                )}
                <button
                  onClick={() => rejectAction(item.appointmentID)}
                  className="bg-surface-container-high hover:bg-red-50 text-on-surface-variant hover:text-red-600 border border-outline-variant/50 hover:border-red-200 font-label-md px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">cancel</span>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <MeetingDetails
        onClose={() => setAppVisible(false)}
        visible={appVisible}
        appointmentState={action}
        appointmentId={appointmentId}
        updateAppointmentStatus={updateAppointmentStatus}
      />
      {mapVisible && (
        <Map
          onclose={() => setMapVisible(false)}
          position={position}
          setPosition={setPosition}
          appointmentState={action}
          appointmentId={appointmentId}
          updateAppointmentStatus={updateAppointmentStatus}
        />
      )}
    </div>
  );
};

export default IncomingRequest;

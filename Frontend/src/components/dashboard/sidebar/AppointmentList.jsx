import React, { useEffect, useState } from "react";
import DetailedAppoitmentList from "./DetailedAppoitmentList";
import { useSelector } from "react-redux";
import api from "../../../api";
import { useDispatch} from "react-redux";
import { appointmentDetails } from "../../../reduxslice/ScheduleMeetSlice";

import socket from "../../../socket";
import { CardSkeleton } from "../../Skeleton";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const AppointmentList = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentState, setAppointmentState] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.auth.user._id);
  const token = useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };

  // API call to fetch appointments
  const fetchAppointmentlist = async () => {
    try {
      const response = await api.get(`${BACKEND}/appointments/current/${userId}`);
      console.log("userId is", userId);
      const success = response?.data?.success;

      if (success) {
        setAppointmentState(response.data.appointments || []);
        setLoading(false);
        
        const meetDetailsArray = response.data.appointments.map((appointmentData) => ({
          patient: appointmentData.patient,
          doctor: appointmentData.doctor,
          appointment: appointmentData.appointment,
          appointmentID: appointmentData.customAppointmentID,
          status: appointmentData.status,
        }));
  
        dispatch(appointmentDetails(meetDetailsArray));
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointmentlist();
  }, []);

  useEffect(() => {
    const eventName = `updateAppointmentStatus/${userId}`;
    socket.on(eventName, () => fetchAppointmentlist());
    return () => socket.off(eventName);
  }, [userId]); // Remove `appointmentState` from dependencies

  const handleClose = () => setPopupVisible(false);

  const statusColor = (s) => {
    const st = (s || "").toLowerCase().trim();
    if (st === "pending")  return "bg-amber-100 text-amber-700";
    if (st === "approved") return "bg-emerald-100 text-emerald-700";
    if (st === "rejected") return "bg-red-100 text-red-700";
    return "bg-surface-variant text-on-surface-variant";
  };
  const statusIcon = (s) => {
    const st = (s || "").toLowerCase().trim();
    if (st === "pending")  return "schedule";
    if (st === "approved") return "check_circle";
    if (st === "rejected") return "cancel";
    return "info";
  };

  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Appointments</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Your upcoming and active appointments.
          </p>
        </div>
        <span className="font-caption text-caption text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/30">
          {appointmentState.length} total
        </span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : appointmentState.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">event_busy</span>
          <p className="font-headline-md text-on-surface-variant">No active appointments</p>
          <p className="font-body-md text-outline mt-1 text-sm">Book an appointment to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointmentState.map((item, index) => (
            <div
              key={index}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 items-start md:items-center"
            >
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary-container">event_upcoming</span>
              </div>

              {/* Info Grid */}
              <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-4">
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Patient</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.patient?.name}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Contact</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.patient?.phone}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Title</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.appointment?.title}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Mode</div>
                  <div className="font-label-md text-label-md text-on-surface capitalize">{item.appointment?.mode}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Date</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.appointment?.date ? new Date(item.appointment.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Doctor</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.doctor?.name}</div>
                </div>
                <div>
                  <div className="font-caption text-caption text-outline mb-0.5">Dr. Contact</div>
                  <div className="font-label-md text-label-md text-on-surface">{item.doctor?.phone}</div>
                </div>
              </div>

              {/* Actions: Status + Details */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label-md font-semibold ${statusColor(item.status)}`}>
                  <span className="material-symbols-outlined text-[14px]">{statusIcon(item.status)}</span>
                  {item.status}
                </span>
                <button
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-surface-container hover:bg-primary-container/10 border border-outline-variant/50 hover:border-primary-container/30 text-on-surface-variant hover:text-primary-container text-xs font-label-md rounded-lg transition-all"
                  onClick={() => handleShowDetails(item)}
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DetailedAppoitmentList
        close={handleClose}
        show={popupVisible}
        appointment={selectedAppointment}`n        onCancel={fetchAppointmentlist}
      />
    </div>
  );
};

export default AppointmentList;


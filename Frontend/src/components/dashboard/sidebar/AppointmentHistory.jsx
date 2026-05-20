import api from "../../../api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../../socket";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const AppointmentHistory = () => {
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const userId = useSelector((state) => state.auth.user._id);

  const fetchAppointmentHistory = async () => {
    try {
      const response = await api.get(`${BACKEND}/appointments/history/${userId}`);
      if (response?.data?.success) {
        setAppointmentHistory(response.data.appointments || []);
      }
    } catch (error) {
      if (error?.response?.status !== 404) console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentHistory();
    const eventName = `updateAppointmentStatus/${userId}`;
    socket.on(eventName, fetchAppointmentHistory);
    return () => socket.off(eventName, fetchAppointmentHistory);
  }, [userId]);

  const statusConfig = {
    pending:   { color: "bg-amber-100 text-amber-700",   icon: "schedule" },
    approved:  { color: "bg-emerald-100 text-emerald-700", icon: "check_circle" },
    rejected:  { color: "bg-red-100 text-red-700",       icon: "cancel" },
    completed: { color: "bg-blue-100 text-blue-700",     icon: "task_alt" },
  };

  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Appointment History</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Review all your past and completed visits.
        </p>
      </div>

      {appointmentHistory.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">history</span>
          <p className="font-headline-md text-on-surface-variant">No appointment history found</p>
          <p className="font-body-md text-outline mt-1 text-sm">Your completed appointments will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointmentHistory.map((item, index) => {
            const status = (item.status || "pending").toLowerCase();
            const cfg = statusConfig[status] || { color: "bg-surface-variant text-on-surface-variant", icon: "info" };
            return (
              <div
                key={index}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                <div className="shrink-0 w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary-container text-2xl">event_note</span>
                </div>

                <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-2 sm:gap-x-3 min-w-0">
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Patient</div>
                    <div className="font-label-md text-label-md text-on-surface">{item.patient?.name}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Doctor</div>
                    <div className="font-label-md text-label-md text-on-surface">{item.doctor?.name}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Title</div>
                    <div className="font-label-md text-label-md text-on-surface">{item.appointment?.title}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Date</div>
                    <div className="font-label-md text-label-md text-on-surface">{item.appointment?.date ? new Date(item.appointment.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Mode</div>
                    <div className="font-label-md text-label-md text-on-surface capitalize">{item.appointment?.mode}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Contact</div>
                    <div className="font-label-md text-label-md text-on-surface">{item.patient?.phone}</div>
                  </div>
                  <div>
                    <div className="font-caption text-caption text-outline mb-0.5">Appt. ID</div>
                    <div className="font-caption text-xs text-outline font-mono">{item.customAppointmentID}</div>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-label-md font-semibold ${cfg.color}`}>
                    <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;


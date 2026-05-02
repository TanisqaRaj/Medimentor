import  { useEffect, useState } from "react";
import PopupDetailedAppointment from "./PopupDetailedAppointment";
import axios from "axios"; // Import axios for API calls

const TotalAppointmentList = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentState, setAppointmentState] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("https://healthcare-platform-server.vercel.app/appointments/all");
        setAppointmentState(response.data.appointments); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments(); // Call the API on component mount
  }, []);

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };

  const handleClose = () => setPopupVisible(false);

  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">All Appointments</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Complete history of platform consultations.</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/50">
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Consultation</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-label-md text-label-md text-on-surface uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {appointmentState.map((item, index) => (
                <tr key={index} className="hover:bg-surface-container-lowest/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.patient.name}</div>
                    <div className="font-caption text-outline text-xs">{item.patient.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-sm ${item.appointment.mode === 'online' ? 'text-emerald-600' : 'text-blue-600'}`}>
                        {item.appointment.mode === 'online' ? 'videocam' : 'location_on'}
                      </span>
                      <div className="font-body-md text-sm text-on-surface font-medium">{item.appointment.title}</div>
                    </div>
                    <div className="font-caption text-outline text-xs mt-0.5">{item.appointment.date}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-label-md text-on-surface">{item.doctor.name}</div>
                    <div className="font-caption text-outline text-xs">{item.doctor.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      item.status === "Pending" ? "bg-amber-100 text-amber-700" :
                      item.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
                      item.status === "Rejected" ? "bg-red-100 text-red-700" :
                      "bg-surface-container text-on-surface-variant"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        item.status === "Pending" ? "bg-amber-500" :
                        item.status === "Accepted" ? "bg-emerald-500" :
                        item.status === "Rejected" ? "bg-red-500" :
                        "bg-outline"
                      }`} />
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="inline-flex items-center gap-2 bg-surface-container hover:bg-primary-container/10 border border-outline-variant/50 hover:border-primary-container/30 text-on-surface-variant hover:text-primary-container px-4 py-2 rounded-xl transition-all font-label-md text-sm"
                      onClick={() => handleShowDetails(item)}
                    >
                      <span className="material-symbols-outlined text-base">visibility</span>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PopupDetailedAppointment
        close={handleClose}
        show={popupVisible}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default TotalAppointmentList;

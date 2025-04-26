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
    <div className="w-full overflow-scroll">
      <div className="pb-5">
        <p className="px-4 pt-10 lg:px-10 pb-6 text-2xl font-bold text-gray-700">
          Appointments
        </p>
        <div className="overflow-x-auto px-4 lg:px-10">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            {/* table column name */}
            <thead className="bg-emerald-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Contact</th>
                <th className="px-4 py-3 border">Title</th>
                <th className="px-4 py-3 border">Mode</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Dr. Name</th>
                <th className="px-4 py-3 border">Dr. Contact</th>
                <th className="px-4 py-3 border">State</th>
                <th className="px-4 py-3 border">Details</th>
              </tr>
            </thead>

            {/* table body */}
            <tbody>
              {appointmentState.map((item, index) => (
                <tr
                  key={index}
                  className="text-gray-800 text-center border hover:bg-gray-100"
                >
                  <td className="px-4 py-3 border">{item.patient.name}</td>
                  <td className="px-4 py-3 border">{item.patient.phone}</td>
                  <td className="px-4 py-3 border">{item.appointment.title}</td>
                  <td className="px-4 py-3 border">{item.appointment.mode}</td>
                  <td className="px-4 py-3 border">{item.appointment.date}</td>
                  <td className="px-4 py-3 border">{item.doctor.name}</td>
                  <td className="px-4 py-3 border">{item.doctor.phone}</td>

                  {/* appointment state */}
                  <td
                    className={`px-4 py-3 border ${
                      item.status === "Pending"
                        ? "text-yellow-500"
                        : item.status === "Accepted"
                        ? "text-green-500"
                        : item.status === "Rejected"
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {item.status}
                  </td>

                  {/* get details button */}
                  <td>
                    <button
                      className="mt-2 mb-2 text-sm bg-emerald-400 text-white items-center py-1 px-3 rounded-lg hover:bg-emerald-700 duration-300"
                      onClick={() => handleShowDetails(item)}
                    >
                      get details
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

import React, { useEffect, useState } from "react";
import DetailedAppoitmentList from "./DetailedAppoitmentList";
import { useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import { useDispatch} from "react-redux";
import { appointmentDetails } from "../../../reduxslice/ScheduleMeetSlice";

const socket = io("https://medimentorbackend.onrender.com"); // Replace with your backend URL

const AppointmentList = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [appointmentState, setAppointmentState] = useState([]);
  const userId = useSelector((state) => state.auth.user._id);
  const dispatch = useDispatch();

  const handleShowDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setPopupVisible(true);
  };

  // API call to fetch appointments
  const fetchAppointmentlist = async () => {
    try {
      const response = await axios.get(
        `https://healthcare-platform-server.vercel.app/appointments/current/${userId}`
      );
      console.log("userId is", userId);
      console.log("appointment list ", response.data);
      const success = response?.data?.success;

      if (success) {
        setAppointmentState(response.data.appointments || []);

        // dispatch(appointmentDetails({
        //   patient: response.data.patient,
        //   doctor: response.data.doctor,
        //   appointment: response.data.appointment
        // }));

        response.data.appointments.forEach((appointmentData) => {
          dispatch(appointmentDetails({
            patient: appointmentData.patient, 
            doctor: appointmentData.doctor,
            appointment: appointmentData.appointment,
          }));
        });
  

      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentlist();
  }, []);

  useEffect(() => {
    const eventName = `updateAppointmentStatus/${userId}`;

    socket.on(eventName, (updatedAppointment) => {
      console.log("Previous appointments:", appointmentState);
      console.log("Received updated appointment:", updatedAppointment);

      setAppointmentState((prevAppointments) => {
        let updatedIndex = prevAppointments.findIndex(
          (appointment) =>
            appointment.appointmentID === updatedAppointment.appointmentId
        );

        console.log("updatedIndex", updatedIndex);

        if (updatedIndex !== -1) {
          let updatedAppointments = [...prevAppointments];
          updatedAppointments[updatedIndex] = updatedAppointment.appointment;
          return updatedAppointments;
        }

        return prevAppointments;
      });
    });

    return () => {
      socket.off(eventName);
    };
  }, [userId]); // Remove `appointmentState` from dependencies

  const handleClose = () => setPopupVisible(false);

  return (
    <div className="w-full overflow-auto">
      <div className="pb-5">
        <p className="px-4 pt-10 lg:px-10 pb-6 text-2xl font-bold text-gray-700">
          Appointments
        </p>
        <div className="overflow-x-auto px-4 lg:px-10">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            {/* Table Header */}
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

            {/* Table Body */}
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

                  {/* Appointment State */}
                  <td
                    className={`px-4 py-3 border ${
                      item.status === "Pending".toLocaleLowerCase().trim()
                        ? "text-yellow-500"
                        : item.status === "Approved".toLocaleLowerCase().trim()
                        ? "text-green-500"
                        : item.status === "Rejected".toLocaleLowerCase().trim()
                        ? "text-red-500"
                        : "text-gray-800"
                    }`}
                  >
                    {item.status}
                  </td>

                  {/* Get Details Button */}
                  <td className="p-2"> 
                    <button
                      className="text-sm bg-emerald-400 text-white items-center py-1 px-3 rounded-lg hover:bg-emerald-700 duration-300"
                      onClick={() => handleShowDetails(item)}
                    >
                      Get Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <DetailedAppoitmentList
        close={handleClose}
        show={popupVisible}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentList;

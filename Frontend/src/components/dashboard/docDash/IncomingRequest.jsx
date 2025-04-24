import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import MeetingDetails from "./MeetingDetails";
import { io } from "socket.io-client";
import Map from "../../Map";

const socket = io("https://medimentorbackend.onrender.com");

const IncomingRequest = () => {
  const [appVisible, setAppVisible] = useState(false);
  const [appointmens, setAppointments] = useState([]);
  const [appointmentId, setAppointmentId] = useState("");
  const doctorId = useSelector((state) => state.auth.doctor._id);
  const [action, setAction] = useState("");
  const [mapVisible, setMapVisible] = useState(false);
  const [position, setPosition] = useState([51.505, -0.09]); // Default position (London)

  function openPasswordPopup(id) {
    setAppointmentId(id);
    setAction("approved");
    setAppVisible(true);
  }

  function openMap(id) {
    setAppointmentId(id);
    setAction("approved");
    setMapVisible(true);
  }

  async function rejectAction(id) {
    setAppointmentId(id);
    setAction("rejected");
    await updateAppointmentStatus(id, "rejected");
  }

  async function updateAppointmentStatus(
    appointmentId,
    appointmentState,
    meetingUrl = null,
    meetingPassword = null,
    location = null
  ) {

    console.log("Sending to server:", {
      appointmentId,
      appointmentState,
      meetingUrl,
      meetingPassword,
      location,
    });
    
    socket.emit(
      "updateAppointmentStatus",
      {
        appointmentId,
        appointmentState,
        meetingUrl,
        meetingPassword,
        location,
      },
      async (response) => {
        if (response.success) {
          console.log("Appointment status updated successfully");
          await fetchAppointmentlist();
        } else {
          console.error(
            "Failed to update appointment status:",
            response.message
          );
        }
      }
    );
  }

  //Api call
  const fetchAppointmentlist = async () => {
    console.log("doctorId", doctorId);
    try {
      const response = await axios.get(
        `https://medimentorbackend.onrender.com/appointments/docapp/${doctorId}`
      );
      const success = response?.data?.success;
      console.log("response data is", response.data);
      if (success) {
        console.log(response.data);
        const list = [
          ...response.data.pendingAppointments,
          ...response.data.approvedAppointments,
        ];
        console.log("appointment list :", list);
        setAppointments(list || []);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    console.log("state is", appointmens);
    fetchAppointmentlist();
  }, []);

  const handleOnClose = () => setAppVisible(false);
  const handleMap = () => setMapVisible(false);

  return (
    <div className="w-full overflow-auto">
      <div className="pb-5 ">
        <p className="px-4 pt-10 lg:px-10 pb-6 text-2xl font-bold text-gray-700">
          Appointments requests
        </p>
        <div className="overflow-x-auto px-4 lg:px-10 ">
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
            {/* table column name */}
            <thead className="bg-emerald-200 text-gray-700 font-semibold">
              <tr>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Age</th>
                <th className="px-4 py-3 border">Gender</th>
                <th className="px-4 py-3 border">Contact</th>
                <th className="px-4 py-3 border">Email</th>
                <th className="px-4 py-3 border">Address</th>
                <th className="px-4 py-3 border">Disease</th>
                <th className="px-4 py-3 border">Description</th>
                <th className="px-4 py-3 border">Mode</th>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">State</th>
              </tr>
            </thead>

            {/* table body */}
            <tbody className="shadow-2xl">
              {appointmens.map((item, index) => (
                <tr
                  key={index}
                  className="text-gray-800 text-center border hover:bg-gray-100"
                >
                  <td className="px-4 py-3 border">{item.patient.name}</td>
                  <td className="px-4 py-3 border">{item.patient.age}</td>
                  <td className="px-4 py-3 border">{item.patient.gender}</td>
                  <td className="px-4 py-3 border">{item.patient.phone}</td>
                  <td className="px-4 py-3 border">{item.patient.email}</td>
                  <td className="px-4 py-3 border">{item.patient.address}</td>
                  <td className="px-4 py-3 border">{item.appointment.title}</td>
                  <td className="px-4 py-3 border">
                    {item.appointment.description}
                  </td>
                  <td className="px-4 py-3 border">{item.appointment.mode}</td>
                  <td className="px-4 py-3 border">{item.appointment.date}</td>

                  <td className="px-4 py-3 border">
                    {item.status !== "approved" && (
                      <button
                        className="borde bg-emerald-600 rounded-2xl p-1 space-y-1 shadow-xl"
                        // onClick={() => openPasswordPopup(item.appointmentID)}
                        onClick={() => {
                          if (item.appointment.mode === "offline") {
                            openMap(item.appointmentID);
                          } else if (item.appointment.mode === "online") {
                            openPasswordPopup(item.appointmentID);
                          }
                        }}
                      >
                        Accept
                      </button>
                    )}
                    <button
                      onClick={async () => rejectAction(item.appointmentID)}
                      className="border bg-red-400 rounded-2xl p-1 space-y-1 px-2 shadow-xl"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MeetingDetails
        onClose={handleOnClose}
        visible={appVisible}
        appointmentState={action}
        appointmentId={appointmentId}
        updateAppointmentStatus={updateAppointmentStatus}
      />
      {mapVisible === true && (
        <Map
          onclose={handleMap}
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

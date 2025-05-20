import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserMeetingDetails from "./UserMeetingDetails";

const ScheduledMeet = () => {
  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [online, setOnline] = useState(false);
  const [offline, setOffline] = useState(false);
  const meetDetails = useSelector((state) => state.schedule.meetDetails);
  const today = new Date().toISOString().split("T")[0];
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleMeeting = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setMeetingDetailsVisible(true);
  };

  const handleMeetingDetailsClose = () => {
    setMeetingDetailsVisible(false);
    setSelectedAppointmentId(null);
  };

  const handleOnline = () => {
    setOnline(!online);
  };

  const handleOffline = () => {
    setOffline(!offline);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter function
  const filteredMeetDetails = meetDetails.filter((item) => {
    const isOnline = item.appointment?.mode === "online";
    const isOffline = item.appointment?.mode === "offline";

    let matchMode = true;
    if (online || offline) {
      matchMode = (online && isOnline) || (offline && isOffline);
    }

    const itemDate = new Date(item.appointment?.date)
      .toISOString()
      .split("T")[0];
    let matchDate = true;
    if (selectedDate) {
      matchDate = itemDate === selectedDate;
    }

    return matchMode && matchDate;
  });

  return (
    <div className="w-full overflow-auto m-0 p-0">
      <div className="flex flex-col sm:flex-row justify-center">
        {/* Filter options */}
        <div className="m-2 sm:m-6">
          <div className="m-4 p-4">
            <h2 className="font-semibold text-2xl mb-3">Filter</h2>
            <p className="font-medium text-xl mb-2">Mode</p>
            <div className="flex gap-3">
              <input
                type="checkbox"
                name="online"
                id="online"
                checked={online}
                onChange={handleOnline}
              />
              <label>Online</label>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                name="offline"
                id="offline"
                checked={offline}
                onChange={handleOffline}
              />
              <label>Offline</label>
            </div>

            <div className=" mb-2 mt-2">
              <p className="font-medium text-xl mb-2">Date</p>
              <input
                type="date"
                min={today}
                defaultValue={today}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </div>

        {/* Appointment list */}
        <div className="m-2 sm:m-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {filteredMeetDetails.map((item, index) => {
            return (
              <div className="p-4 border m-4 bg-emerald-200 rounded-2xl shadow-2xl">
                <p>
                  <strong>Patient: </strong>
                  {item.patient?.name}
                </p>
                <p>
                  <strong>Disease:</strong> {item.appointment?.title}
                </p>
                <p>
                  <strong>Time:</strong> {item.appointment.date}
                </p>
                <p>
                  <strong>Doctor:</strong> {item.doctor?.name}
                </p>
                <button
                  className="border bg-white p-1 m-2 shadow-md rounded-md text-sm font-medium text-emerald-700"
                  onClick={() => handleMeeting(item.appointmentID)}
                >
                  Join meet
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <UserMeetingDetails
        visible={meetingDetailsVisible}
        onClose={handleMeetingDetailsClose}
        selectedAppointmentId={selectedAppointmentId}
      />
    </div>
  );
};

export default ScheduledMeet;

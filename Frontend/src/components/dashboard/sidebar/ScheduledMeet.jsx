import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserMeetingDetails from "./UserMeetingDetails";

const ScheduledMeet = () => {
  const patients = useSelector((state) => state.schedule.patient);
  const doctors = useSelector((state) => state.schedule.doctor);
  const appointment = useSelector((state) => state.schedule.appointment);
  const [meetingDetailsVisible, setMeetingDetailsVisible] = useState(false);

  const handleMeeting = () => {
    setMeetingDetailsVisible(true);
  };

  const handleMeetingDetailsClose = () => {
    setMeetingDetailsVisible(false);
  };
  
  return (
    <div className="w-full overflow-auto m-0 p-0">
      <div className="m-2 sm:m-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {appointment.map((item, index) => {
          const patient = patients.find((p) => p.id === item.patientId);
          const doctor = doctors.find((d) => d.id === item.doctorId);

          console.log("Patients:", patients);
          console.log("Doctors:", doctors);
          console.log("Appointments:", appointment);
          return (
            <div className="  p-4 border m-4 bg-emerald-200 rounded-2xl shadow-2xl">
              <p>
                <strong>Patient: </strong>
                {patient?.name}
              </p>
              <p>
                <strong>Disease:</strong> {appointment?.title}
              </p>
              <p>
                <strong>Time:</strong> {appointment.date}
              </p>
              <p>
                <strong>Doctor:</strong> {doctor?.name}
              </p>
              <button className="border bg-white p-1 m-2 shadow-md rounded-md text-sm font-medium text-emerald-700"
               onClick={handleMeeting}>
                Join meet
              </button>
            </div>
          );
        })}
      </div>

      <UserMeetingDetails visible={meetingDetailsVisible} onClose={handleMeetingDetailsClose} />
    </div>
  );
};

export default ScheduledMeet;

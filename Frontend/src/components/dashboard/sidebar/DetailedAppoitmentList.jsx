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
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="detAppList"
      onClick={handleClose}
    >
      <div className="h-[70vh] w-[90vw] md:w-[70vw] flex rounded-lg bg-white shadow-lg overflow-auto">
        {/* cross button */}
        <div
          className="p-2 mb-6 border h-10 rounded-r-lg p-1 hover:cursor-pointer"
          onClick={close}
        >
          X
        </div>

        {/* patient details */}
        <div className="w-[50%] px-1 py-4 m:p-6">
          <div className="font-semibold px-6 mb-4 text-2xl text-gray-800">
            Patient Details
          </div>
          <p className="flex flex-col sm-flex-row"> 
            <strong>Patient Name:</strong> {appointment.patient?.name}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Contact:</strong> {appointment.patient?.phone}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Email:</strong> {appointment.patient?.email}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Title:</strong> {appointment.appointment?.title}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Description:</strong> {appointment.appointment?.description}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Mode:</strong> {appointment.appointment?.mode}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Date:</strong> {appointment.appointment?.date}
          </p>
          <p className="flex flex-col sm-flex-row">
            <strong>Status:</strong> {appointment.status}
          </p>

          {/* When request is accepted and mode is online */}
          {appointment.appointment?.mode === "online" &&
            appointment.status === "approved" && (
              <div className="mt-6">
                <div className="font-semibold text-sm">
                  Click here to join meeting
                </div>
                <button
                  className="border p-1 text-sm bg-emerald-200 rounded-2xl px-2"
                  onClick={handleMeeting}
                >
                  join now
                </button>
              </div>
            )}

          {/* When request is accepted and mode is offline */}
          {appointment.appointment?.mode === "offline" &&
            appointment.status === "approved" && (
              <div className="mt-6">
                <div className="font-semibold text-sm">
                  Click here to see location
                </div>
                <button
                  className="border p-1 text-sm bg-emerald-200 rounded-2xl px-2"
                  onClick={handleOpenMap}
                >
                  Location
                </button>
              </div>
            )}

          {/* cancle button */}
          <button className="mt-6 m:mt-10  rounded-2xl border bg-emerald-500 text-sm p-1 "
          onClick={handlePopup}
          >
            cancle appointment
          </button>
        </div>

        {/* doctor details */}
        <div className="w-[50%] px-0.5 py-4 m:p-6 bg-emerald-400 ">
          <div className="px-6 font-semibold text-2xl text-emerald-900">
            Doctor Details
          </div>
          <div className="p-6 text-gray-800">
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-2  text-emerald-900">Name:</strong>{" "}
              {appointment.doctor?.name}
            </div>
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-0.5 m:mr-2 text-emerald-900">Username:</strong>
              {appointment.doctor.username}
            </div>
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-2  text-emerald-900">Contact:</strong>
              {appointment.doctor?.phone}
            </div>

            {/* gender */}
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-2  text-emerald-900">Gender:</strong>
              {appointment.doctor.gender}
            </div>

            <div className="flex flex-col sm-flex-row ">
              <strong className="mr-2  text-emerald-900">Email:</strong>
              {appointment.doctor?.email}
            </div>
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-2  text-emerald-900">Bio:</strong>
              {appointment.doctor?.bio}
            </div>

            {/* profession */}
            <div className="flex flex-col sm:flex-row gap-1 flex-wrap max-w-full">
              <strong className="mr-2  text-emerald-900">Profession:</strong>
              {appointment.doctor.profession.map((profession, index) => (
                <p
                  className="bg-emerald-200 p-1 rounded-lg text-sm"
                  key={index}
                >
                  {profession}
                </p>
              ))}
            </div>
            <div className="flex flex-col sm-flex-row">
              <strong className="mr-2  text-emerald-900">Department:</strong>
              {appointment.doctor?.department}
            </div>
            <div>
              <strong className="mr-2  text-emerald-900">Experience:</strong>
              {appointment.doctor?.experience}
            </div>
          </div>
        </div>
      </div>
      <UserMeetingDetails visible={meetingDetailsVisible} onClose={handleMeetingDetailsClose} />
    </div>
  );
};

export default DetailedAppoitmentList;

import React from "react";
import { useSelector } from "react-redux";

const DoctorProfile = () => {
  const user = useSelector((state) => state.auth.doctor);

  return (
    <div className="w-full px-10 py-16 flex ">
      <div className="w-full shadow-lg rounded-lg p-16 items-center justify-center border">
        <div className="h-24 w-24 border shadow-lg rounded-full overflow-hidden">
          <img
            src={`data:image/png;base64,${user?.image}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>Name{user?.name}</div>
        <div>Username{user?.username}</div>
        <div>Contact{user?.phone}</div>
        <div>Email{user?.email}</div>
        <div>Gender{user?.gender}</div>
        <div>Department{user?.department}</div>
        <div>Experience{user?.experience}</div>
        <div>Bio{user?.bio}</div>
        <div>Skills{user?.skills}</div>
        <div>Certificates{user?.certificate}</div>
      </div>
    </div>
  );
};

export default DoctorProfile;

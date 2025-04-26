import PropTypes from "prop-types";

const PopupDetailedAppointment = ({ show, close, appointment }) => {

  const handleClose = (e) => {
    if (e.target.id === "detAppList") close();
  };

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="detAppList"
      onClick={handleClose}
    >
      <div className="w-[90vw] h-[70vh] sm:w-[75vw] flex rounded-lg bg-white shadow-lg overflow-auto">
        {/* cross button */}
        <div
          className="p-0.5 sm:p-2 mb-6 border h-10 rounded-r-lg p-1 hover:cursor-pointer"
          onClick={close}
        >
          X
        </div>

        {/* patient details */}
        <div className="w-[50%] px-2 py-6 sm:p-6 overflow-auto">
          <div className="font-semibold px-2 sm:px-6 mb-4 text-sm sm:text-2xl text-gray-800">
            Patient Details
          </div>
          <p className="text-sm sm:text-xl">
            <strong>Patient Name:</strong> {appointment.patient?.name}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Contact:</strong> {appointment.patient?.phone}
          </p>
          <p className="text-sm sm:text-xl ">
            <strong>Email:</strong> {appointment.patient?.email}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Title:</strong> {appointment.appointment?.title}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Description:</strong> {appointment.appointment?.description}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Mode:</strong> {appointment.appointment?.mode}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Date:</strong> {appointment.appointment?.date}
          </p>
          <p className="text-sm sm:text-xl">
            <strong>Status:</strong> {appointment.status}
          </p>
        </div>

        {/* doctor details */}
        <div className="w-[50%] px-2 py-6 sm:p-6 bg-emerald-400 overflow-auto">
          <div className="px-2 sm:px-6 font-semibold text-sm sm:text-2xl text-emerald-900">
            Doctor Details
          </div>
          <div className="p-3 sm:p-6 text-gray-800 ">
            <p className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900 text-sm sm:text-xl">Name:</strong>{" "}
              {appointment.doctor?.name}
            </p>
            <p className="text-sm sm:text-xl">
              <strong className="mr-2 text-emerald-900 ">Username:</strong>
              {appointment.doctor.username}
            </p>
            <div className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900 ">Contact:</strong>
              {appointment.doctor?.phone}
            </div>

            {/* gender */}
            <div className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900 ">Gender:</strong>
              {appointment.doctor.gender}
            </div>

            <p className="text-sm sm:text-xl ">
              <strong className="mr-2  text-emerald-900 ">Email:</strong>
              {appointment.doctor?.email}
            </p>
            <div className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900 ">Bio:</strong>
              {appointment.doctor?.bio}
            </div>

            {/* profession */}
            <div className="flex gap-1 flex-wrap max-w-full">
              <strong className="mr-2  text-emerald-900">Profession:</strong>
              {appointment.doctor.profession.map((profession, index) => (
                <p
                  className="bg-emerald-200 p-1 rounded-lg text-sm flex-col sm:flex-row"
                  key={index}
                >
                  {profession}
                </p>
              ))}
            </div>
            <div className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900">Department:</strong>
              {appointment.doctor?.department}
            </div>
            <div className="text-sm sm:text-xl">
              <strong className="mr-2  text-emerald-900">Experience:</strong>
              {appointment.doctor?.experience}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// PopupDetailedAppointment.propTypes = {
//   show: PropTypes.bool.isRequired,
//   close: PropTypes.func.isRequired,
//   appointment: PropTypes.shape({
//     patient: PropTypes.shape({
//       name: PropTypes.string,
//       phone: PropTypes.string,
//       email: PropTypes.string,
//     }),
//     appointment: PropTypes.shape({
//       title: PropTypes.string,
//       description: PropTypes.string,
//       mode: PropTypes.string,
//       date: PropTypes.string,
//     }),
//     status: PropTypes.string,
//     doctor: PropTypes.shape({
//       name: PropTypes.string,
//       username: PropTypes.string,
//       phone: PropTypes.string,
//       gender: PropTypes.string,
//       email: PropTypes.string,
//       bio: PropTypes.string,
//       profession: PropTypes.arrayOf(PropTypes.string),
//       department: PropTypes.string,
//       experience: PropTypes.string,
//     }),
//   }).isRequired,
// };

export default PopupDetailedAppointment;

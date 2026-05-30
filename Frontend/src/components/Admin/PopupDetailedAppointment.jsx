
const PopupDetailedAppointment = ({ show, close, appointment }) => {

  const handleClose = (e) => {
    if (e.target.id === "detAppList") close();
  };

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[70] p-4 sm:p-6"
      id="detAppList"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh] font-manrope"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Panel: Patient Details */}
        <div className="flex-1 overflow-y-auto p-8 border-b md:border-b-0 md:border-r border-outline-variant/30">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Patient Profile</h2>
              <p className="font-body-md text-on-surface-variant">Appointment & Consultation details</p>
            </div>
            <div className={`px-4 py-1.5 rounded-full font-label-md text-xs font-bold uppercase tracking-wider ${
              appointment.status === "Pending" ? "bg-amber-100 text-amber-700" :
              appointment.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
              "bg-red-100 text-red-700"
            }`}>
              {appointment.status}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Patient Name</div>
                <div className="font-label-md text-on-surface">{appointment.patient?.name}</div>
              </div>
              <div>
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Contact No.</div>
                <div className="font-label-md text-on-surface">{appointment.patient?.phone}</div>
              </div>
              <div className="sm:col-span-2">
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Email Address</div>
                <div className="font-label-md text-on-surface">{appointment.patient?.email}</div>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">medical_information</span>
                </div>
                <h3 className="font-label-md text-on-surface">Consultation Request</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Concern</div>
                  <div className="font-body-md text-on-surface font-semibold">{appointment.appointment?.title}</div>
                </div>
                <div>
                  <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Description</div>
                  <div className="font-body-md text-sm text-on-surface-variant leading-relaxed">{appointment.appointment?.description}</div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30">
                  <div>
                    <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Mode</div>
                    <div className="flex items-center gap-1.5 font-label-md text-sm text-on-surface">
                      <span className="material-symbols-outlined text-base text-primary">
                        {appointment.appointment?.mode === 'online' ? 'videocam' : 'location_on'}
                      </span>
                      {appointment.appointment?.mode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Schedule</div>
                    <div className="font-label-md text-sm text-on-surface">{appointment.appointment?.date}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Doctor Details */}
        <div className="w-full md:w-[400px] bg-primary-container/5 overflow-y-auto p-8 relative">
          <button 
            onClick={close}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 text-on-surface-variant transition-all"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 rounded-full bg-emerald-100 border-4 border-white shadow-lg overflow-hidden mb-4">
              {/* Placeholder if image is missing */}
              <div className="w-full h-full flex items-center justify-center bg-emerald-600 text-white">
                <span className="material-symbols-outlined text-4xl">doctor</span>
              </div>
            </div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-1">{appointment.doctor?.name}</h2>
            <p className="font-label-md text-primary font-bold uppercase tracking-wider text-xs">{appointment.doctor?.department}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur rounded-2xl p-5 border border-white shadow-sm">
              <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Bio</div>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed italic">{`"`}{appointment.doctor?.bio}{`"`}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white shadow-sm">
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Experience</div>
                <div className="font-label-md text-on-surface">{appointment.doctor?.experience} Years</div>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-2xl p-4 border border-white shadow-sm">
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-1">Gender</div>
                <div className="font-label-md text-on-surface capitalize">{appointment.doctor.gender}</div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="font-caption text-[10px] uppercase tracking-wider text-outline mb-2 px-1">Specialties</div>
                <div className="flex flex-wrap gap-2">
                  {appointment.doctor.profession.map((prof, index) => (
                    <span key={index} className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-label-md shadow-sm">
                      {prof}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">alternate_email</span>
                  <span className="font-body-md text-sm text-on-surface truncate">{appointment.doctor?.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">call</span>
                  <span className="font-body-md text-sm text-on-surface">{appointment.doctor?.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600 text-lg">badge</span>
                  <span className="font-body-md text-sm text-on-surface">@{appointment.doctor.username}</span>
                </div>
              </div>
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

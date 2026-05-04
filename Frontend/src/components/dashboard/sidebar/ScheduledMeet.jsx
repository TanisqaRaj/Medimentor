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
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Scheduled Meets</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Your upcoming online and offline sessions.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 p-5 shadow-sm sticky top-24">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-[20px]">tune</span>
              Filters
            </h2>

            {/* Mode Filter */}
            <div className="mb-5">
              <p className="font-label-md text-label-md text-on-surface mb-3">Mode</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="online"
                      id="online"
                      checked={online}
                      onChange={handleOnline}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${online ? "bg-emerald-600 border-emerald-600" : "border-outline-variant group-hover:border-primary"}`}>
                      {online && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">videocam</span>
                    <span className="font-body-md text-body-md text-on-surface">Online</span>
                  </div>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="offline"
                      id="offline"
                      checked={offline}
                      onChange={handleOffline}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${offline ? "bg-emerald-600 border-emerald-600" : "border-outline-variant group-hover:border-primary"}`}>
                      {offline && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">location_on</span>
                    <span className="font-body-md text-body-md text-on-surface">In-Person</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <p className="font-label-md text-label-md text-on-surface mb-3">Date</p>
              <input
                type="date"
                min={today}
                defaultValue={today}
                onChange={handleDateChange}
                className="w-full rounded-lg border border-outline-variant bg-surface-container text-on-surface px-3 py-2 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
          </div>
        </aside>

        {/* Meeting Cards */}
        <div className="flex-grow">
          {filteredMeetDetails.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-outline-variant/30">
              <span className="material-symbols-outlined text-5xl text-outline mb-3">event_busy</span>
              <p className="font-headline-md text-on-surface-variant">No meets scheduled</p>
              <p className="font-body-md text-outline mt-1 text-sm">Adjust the filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMeetDetails.map((item, index) => {
                const isOnline = item.appointment?.mode === "online";
                return (
                  <div
                    key={index}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col gap-4"
                  >
                    {/* Mode Badge */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label-md font-semibold ${isOnline ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}>
                        <span className="material-symbols-outlined text-[14px]">{isOnline ? "videocam" : "location_on"}</span>
                        {isOnline ? "Online" : "In-Person"}
                      </span>
                      <span className="font-caption text-caption text-outline">#{item.appointmentID?.slice(-6) || "—"}</span>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <div className="font-caption text-caption text-outline">Patient</div>
                        <div className="font-label-md text-label-md text-on-surface">{item.patient?.name || "—"}</div>
                      </div>
                      <div>
                        <div className="font-caption text-caption text-outline">Concern</div>
                        <div className="font-label-md text-label-md text-on-surface">{item.appointment?.title || "—"}</div>
                      </div>
                      <div>
                        <div className="font-caption text-caption text-outline">Doctor</div>
                        <div className="font-label-md text-label-md text-on-surface">{item.doctor?.name || "—"}</div>
                      </div>
                      <div>
                        <div className="font-caption text-caption text-outline">Scheduled</div>
                        <div className="font-label-md text-label-md text-on-surface">{item.appointment?.date ? new Date(item.appointment.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—"}</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      className={`mt-auto w-full flex items-center justify-center gap-2 font-label-md text-label-md py-2.5 rounded-lg transition-all ${
                        isOnline
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "bg-surface-container hover:bg-primary-container/10 border border-outline-variant/50 hover:border-primary-container/30 text-on-surface-variant hover:text-primary-container"
                      }`}
                      onClick={() => handleMeeting(item.appointmentID)}
                    >
                      <span className="material-symbols-outlined text-base">{isOnline ? "videocam" : "location_on"}</span>
                      {isOnline ? "Join Meet" : "View Location"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
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
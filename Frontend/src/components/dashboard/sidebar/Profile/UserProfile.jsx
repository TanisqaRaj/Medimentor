import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="w-full flex-grow mx-auto max-w-[1280px] px-6 pb-xl pt-8 font-manrope">
      {/* Header */}
      <section className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
          Good morning, {user?.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Here is your comprehensive health overview.
        </p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Card 1: Profile Info (col-span-4) */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-surface-variant shadow-sm flex-shrink-0 bg-surface-container">
              <img
                src={user?.image ? `data:image/png;base64,${user.image}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuASSKJZJgJLr8en3R82KBAYDbzfLRGXJ-xIWY-l_hJmea9R1jw8Tpw0Jo4FSlshByp3X4-6cjtV97U_RJ9V_aThPd5S7HPu-rM9AiCd7NYMHR0224j7ZPehnC3v0zIMb1ns9hCFlev1ADtbqayR4SrccvHEEqpTZ61Ullbw5soFljZvYYa2eRDYNRtwW41o4oB6pGkkgRQdNJAg3BV1juE8fi0SR3CWk849K7Jk3xgFLqqgPXbq-bwjZtAo-aJpWX3gaDFxPx4ZYBm7"}
                className="h-full w-full object-cover"
                alt="Profile"
              />
            </div>
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{user?.name || "Patient"}</h2>
              <p className="font-caption text-caption text-on-surface-variant">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-emerald-700 text-xs font-label-md rounded-full">User Account</span>
            </div>
          </div>

          <div className="divide-y divide-outline-variant/30">
            {[
              { label: "Username", value: user?.username, icon: "person" },
              { label: "Contact", value: user?.phone, icon: "call" },
              { label: "Gender", value: user?.gender, icon: "wc" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex items-center gap-3 py-3">
                <span className="material-symbols-outlined text-base text-primary-container">{icon}</span>
                <div>
                  <div className="font-caption text-caption text-on-surface-variant">{label}</div>
                  <div className="font-label-md text-label-md text-on-surface">{value || "—"}</div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">edit</span>
            Edit Profile
          </button>
        </div>

        {/* Card 2: Vitals Summary (col-span-8) */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">monitor_heart</span>
              Current Vitals
            </h2>
            <span className="font-caption text-caption text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-full border border-surface-variant">
              Last updated: 2h ago
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
            {[
              { icon: "favorite", label: "Blood Pressure", value: "118/76", unit: "mmHg", status: "Normal", statusColor: "text-emerald-700" },
              { icon: "vital_signs", label: "Heart Rate", value: "68", unit: "bpm", status: "Steady", statusColor: "text-on-surface-variant" },
              { icon: "air", label: "Oxygen SpO2", value: "99", unit: "%", status: "Optimal", statusColor: "text-emerald-700" },
              { icon: "scale", label: "Weight", value: "142", unit: "lbs", status: "+1.2 lbs", statusColor: "text-tertiary" },
            ].map(({ icon, label, value, unit, status, statusColor }) => (
              <div key={label} className="p-4 rounded-lg bg-surface-container-low border border-surface-container-highest flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-base">{icon}</span>
                  <span className="font-label-md text-label-md text-on-surface-variant text-xs">{label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-headline-lg font-bold text-on-surface">{value}</span>
                  <span className="font-caption text-caption text-on-surface-variant">{unit}</span>
                </div>
                <div className={`mt-2 font-label-md text-xs ${statusColor}`}>{status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Active Prescriptions (col-span-7) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">medication</span>
              Active Prescriptions
            </h2>
          </div>
          <div className="space-y-3">
            {[
              { name: "Lisinopril 10mg", dosage: "Take 1 tablet daily", badge: "Refill Available", badgeColor: "bg-secondary-fixed text-on-secondary-fixed" },
              { name: "Atorvastatin 20mg", dosage: "Take 1 tablet at bedtime", badge: "Expires in 6mo", badgeColor: "bg-surface-container-high text-on-surface-variant" },
            ].map(({ name, dosage, badge, badgeColor }) => (
              <div key={name} className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg border border-transparent hover:border-outline-variant/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                    <span className="material-symbols-outlined text-base">pill</span>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface font-semibold">{name}</h3>
                    <p className="font-caption text-caption text-on-surface-variant">{dosage}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 ${badgeColor} rounded-full font-caption text-caption text-xs`}>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Quick Access (col-span-5) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "description", label: "Medical Records" },
              { icon: "science", label: "Lab Results" },
              { icon: "chat", label: "Messages" },
              { icon: "payments", label: "Billing & Info" },
            ].map(({ icon, label }) => (
              <button key={label} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-surface-container-low hover:bg-primary-fixed/20 border border-transparent hover:border-primary-fixed transition-all group">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm text-primary-container group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface text-center text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;


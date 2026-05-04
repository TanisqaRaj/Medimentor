import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../../../reduxslice/AuthSlice";
import api from "../../../../api";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const UserProfile = () => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const fileRef = useRef();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true); setMsg(null);
    try {
      const payload = {};
      if (name !== user?.name) payload.name = name;
      if (imageBase64) payload.image = imageBase64;
      if (newPassword) { payload.currentPassword = currentPassword; payload.newPassword = newPassword; }
      if (!Object.keys(payload).length) { setEditing(false); setSaving(false); return; }

      const { data } = await api.put(`${BACKEND}/auth/update-profile`, payload);
      if (data.success) {
        dispatch(login({ accessToken, user: { ...user, ...data.user } }));
        setMsg({ type: "success", text: "Profile updated!" });
        setEditing(false);
        setCurrentPassword(""); setNewPassword(""); setImageBase64(null); setImagePreview(null);
      }
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally { setSaving(false); }
  };

  const avatar = imagePreview || user?.image || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "U");

  return (
    <div className="w-full flex-grow mx-auto max-w-[1280px] px-6 pb-xl pt-8 font-manrope">
      <section className="mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">
          Good morning, {user?.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Here is your comprehensive health overview.</p>
      </section>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-label-md ${msg.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0">
              <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-surface-variant shadow-sm bg-surface-container">
                <img src={avatar} className="h-full w-full object-cover" alt="Profile" />
              </div>
              {editing && (
                <>
                  <button onClick={() => fileRef.current.click()} className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </>
              )}
            </div>
            <div>
              {editing ? (
                <input value={name} onChange={(e) => setName(e.target.value)} className="font-headline-md text-on-surface border-b border-outline-variant bg-transparent outline-none w-full" />
              ) : (
                <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">{user?.name}</h2>
              )}
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

          {/* Password change (only in edit mode) */}
          {editing && (
            <div className="space-y-3 pt-2 border-t border-outline-variant/30">
              <p className="font-label-md text-sm text-on-surface-variant">Change Password (optional)</p>
              <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-outline-variant/50 rounded-lg bg-surface-container outline-none focus:border-primary" />
              <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-outline-variant/50 rounded-lg bg-surface-container outline-none focus:border-primary" />
            </div>
          )}

          <div className="flex gap-2">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md rounded-lg transition-colors shadow-sm disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={() => { setEditing(false); setName(user?.name); setMsg(null); setImagePreview(null); }} className="px-4 py-2.5 border border-outline-variant/50 text-on-surface-variant font-label-md rounded-lg hover:bg-surface-container transition-colors">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-label-md rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">edit</span>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Vitals Card */}
        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary-container">monitor_heart</span>
            Current Vitals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "favorite", label: "Blood Pressure", value: "118/76", unit: "mmHg" },
              { icon: "vital_signs", label: "Heart Rate", value: "68", unit: "bpm" },
              { icon: "air", label: "Oxygen SpO2", value: "99", unit: "%" },
              { icon: "scale", label: "Weight", value: "142", unit: "lbs" },
            ].map(({ icon, label, value, unit }) => (
              <div key={label} className="p-4 rounded-lg bg-surface-container-low border border-surface-container-highest flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-base">{icon}</span>
                  <span className="font-label-md text-on-surface-variant text-xs">{label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-on-surface">{value}</span>
                  <span className="font-caption text-on-surface-variant">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

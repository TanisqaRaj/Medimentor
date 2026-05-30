import { useState } from "react";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const ChangePassword = ({ visible, onClose, resetToken }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOnClose = (e) => { if (e.target.id === "container") onClose(); };

  const handleChangePassword = async () => {
    if (!password || password.length < 6) { alert("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const response = await axios.put(`${BACKEND}/auth/update-password`, { resetToken, newPassword: password });
      if (response.data.success) {
        alert("Password changed successfully!");
        onClose();
      } else {
        alert("Failed: " + response.data.message);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-sm md:p-xl" id="container" onClick={handleOnClose}>
      <div className="w-full max-w-md flex flex-col items-center justify-center rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-xl p-lg">
        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-[32px]">password</span>
        </div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Set New Password</h2>
        <p className="font-body-md text-body-md text-tertiary mb-lg text-center">Your new password must be at least 6 characters.</p>

        <div className="w-full mb-lg">
            <label className="block font-label-md text-label-md text-on-surface-variant mb-base">New Password</label>
            <div className="relative w-full">
              <div className="absolute top-1/2 -translate-y-1/2 left-0 pl-sm flex items-center pointer-events-none text-tertiary">
                <span className="material-symbols-outlined">lock</span>
              </div>
              <input
                className="block w-full pl-xl pr-sm py-sm font-body-md text-body-md text-on-surface bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors placeholder:text-tertiary-fixed-dim"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
        </div>

        <button
          className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-container/20 transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-primary-container flex items-center justify-center gap-xs disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Password"}
          {!loading && <span className="material-symbols-outlined">save</span>}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

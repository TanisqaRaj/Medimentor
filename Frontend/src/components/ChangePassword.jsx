import React, { useState } from "react";
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
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center" id="container" onClick={handleOnClose}>
      <div className="w-[90vw] md:w-[400px] flex flex-col items-center rounded-2xl bg-white shadow-lg p-8 gap-4">
        <h2 className="text-xl font-semibold text-gray-800">Set New Password</h2>
        <input
          className="w-full border-2 rounded-lg py-2 px-3 text-gray-700 focus:border-emerald-500 outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min 6 chars)"
        />
        <button
          className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-60"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Saving..." : "Update Password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;

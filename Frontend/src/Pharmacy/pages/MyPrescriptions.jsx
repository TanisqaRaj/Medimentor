import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import pharmacyApi from "../api/pharmacyApi";
import { uploadPrescription } from "../store/pharmacySlice";
import toast from "react-hot-toast";
import { FiUpload, FiFileText } from "react-icons/fi";
import { motion } from "framer-motion";

const STATUS_STYLE = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MyPrescriptions() {
  const dispatch = useDispatch();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => {
    setLoading(true);
    pharmacyApi.get("/prescriptions/my")
      .then(({ data }) => setPrescriptions(data.data))
      .catch(() => toast.error("Failed to load prescriptions"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const result = await dispatch(uploadPrescription(file));
    setUploading(false);
    if (uploadPrescription.fulfilled.match(result)) {
      toast.success("Prescription uploaded");
      setFile(null);
      load();
    } else {
      toast.error(result.payload || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

        {/* Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-700 mb-3">Upload New Prescription</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-teal-400 transition mb-3">
            <FiUpload className="text-3xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              {file ? file.name : "Click to select (JPG, PNG, PDF)"}
            </span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
          {file && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FiFileText className="text-6xl mx-auto mb-3 text-teal-200" />
            <p>No prescriptions uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FiFileText className="text-teal-500 text-xl shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">Prescription #{p.id}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLE[p.status]}`}>
                    {p.status}
                  </span>
                  <a
                    href={p.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-teal-600 hover:underline"
                  >
                    View
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import pharmacyApi from "../../api/pharmacyApi";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import toast from "react-hot-toast";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function AdminPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const load = (status = statusFilter) => {
    setLoading(true);
    pharmacyApi.get("/prescriptions/admin", { params: { status } })
      .then(({ data }) => setPrescriptions(data.data))
      .catch(() => toast.error("Failed to load prescriptions"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleReview = async (id, status) => {
    try {
      await pharmacyApi.patch(`/prescriptions/admin/${id}`, { status });
      toast.success(`Prescription ${status.toLowerCase()}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-3">📋</p>
            <p>No {statusFilter.toLowerCase()} prescriptions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">Prescription #{rx.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    User: {rx.userId?.slice(-8)} · {new Date(rx.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <a
                  href={rx.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-500 hover:underline shrink-0"
                >
                  View File
                </a>
                {rx.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReview(rx.id, "APPROVED")}
                      className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      <FiCheckCircle /> Approve
                    </button>
                    <button
                      onClick={() => handleReview(rx.id, "REJECTED")}
                      className="flex items-center gap-1 bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      <FiXCircle /> Reject
                    </button>
                  </div>
                )}
                {rx.status !== "PENDING" && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    rx.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {rx.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

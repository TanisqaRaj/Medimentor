import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import pharmacyApi from "../../api/pharmacyApi";
import AdminSidebar from "../../Components/admin/AdminSidebar";
import StatCard from "../../Components/admin/StatCard";
import { FiPackage, FiShoppingBag, FiAlertCircle, FiDollarSign } from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pharmacyApi.get("/admin/dashboard/stats")
      .then(({ data }) => setStats(data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Pharmacy Dashboard</h1>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<FiPackage />} label="Total Medicines" value={stats?.totalMedicines} color="teal" delay={0} />
            <StatCard icon={<FiAlertCircle />} label="Low Stock" value={stats?.lowStockCount} color="orange" delay={0.05} />
            <StatCard icon={<FiShoppingBag />} label="Total Orders" value={stats?.totalOrders} color="blue" delay={0.1} />
            <StatCard icon={<MdPendingActions />} label="Pending Orders" value={stats?.pendingOrders} color="yellow" delay={0.15} />
            <StatCard icon={<FiShoppingBag />} label="Processing" value={stats?.processingOrders} color="purple" delay={0.2} />
            <StatCard icon={<FiShoppingBag />} label="Delivered" value={stats?.deliveredOrders} color="green" delay={0.25} />
            <StatCard icon={<FiDollarSign />} label="Revenue (₹)" value={stats?.totalRevenue?.toFixed(0)} color="emerald" delay={0.3} />
            <StatCard icon={<MdPendingActions />} label="Pending Rx" value={stats?.pendingPrescriptions} color="red" delay={0.35} />
          </div>
        )}
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import api from "../../api";
import { useSelector } from "react-redux";
import { StatCardSkeleton } from "../Skeleton";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const AdminContent = () => {
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
    const token = useSelector((state) => state.auth.accessToken);
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [usersRes, doctorsRes, statsRes] = await Promise.all([
                    api.get(`${BACKEND}/doctors/totalusers`, { headers }),
                    api.get(`${BACKEND}/doctors/totaldoctors`, { headers }),
                    api.get(`${BACKEND}/appointments/stats`, { headers }),
                ]);
                if (usersRes.data.success) setTotalUsers(usersRes.data.totalUsers);
                if (doctorsRes.data.success) setTotalDoctors(doctorsRes.data.totalDoctors);
                setLoading(false);
                if (statsRes.data.success) setStats({
                    total: statsRes.data.totalAppointments,
                    pending: statsRes.data.pendingAppointments,
                    approved: statsRes.data.approvedAppointments,
                    rejected: statsRes.data.rejectedAppointments,
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
            <div className="mb-8">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Admin Dashboard</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Platform overview and statistics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {[
                    { label: "Total Appointments", value: stats.total, icon: "event_note", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Approved", value: stats.approved, icon: "check_circle", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Pending", value: stats.pending, icon: "schedule", color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Rejected", value: stats.rejected, icon: "cancel", color: "text-red-600", bg: "bg-red-50" },
                    { label: "Total Doctors", value: totalDoctors, icon: "stethoscope", color: "text-primary", bg: "bg-primary-container/10" },
                    { label: "Total Users", value: totalUsers, icon: "group", color: "text-purple-600", bg: "bg-purple-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                        </div>
                        <div className="font-headline-lg text-headline-lg text-on-surface mb-1">
                            <CountUp end={stat.value} duration={2.5} />
                        </div>
                        <div className="font-label-md text-label-md text-on-surface-variant">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminContent;

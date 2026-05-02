import { useEffect, useState } from "react";
import CountUp from "react-countup";
import axios from "axios";

const AdminContent = () => {
    const [totalDoctors, setTotalDoctors] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [pendingAppointments, setPendingAppointments] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);

    const fetchTotalUsers = async () => {
        try {
            const response = await axios.get("https://medimentorbackend.onrender.com/doctors/totalusers");
            const success = response?.data?.success;

            if (success) {
                setTotalUsers(response.data.totalUsers);
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error("❌ Error fetching total users:", error);
        }
    };

    const fetchTotalDoctors = async () => {
        try {
            const response = await axios.get("https://medimentorbackend.onrender.com/doctors/totaldoctors");
            const success = response?.data?.success;

            if (success) {
                setTotalDoctors(response.data.totalDoctors);
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error("❌ Error fetching total doctors:", error);
        }
    };

    const fetchAppointmentsData = async () => {
        try {
            const response = await axios.get("https://healthcare-platform-server.vercel.app/appointments/stats");
            const success = response?.data?.success;

            if (success) {
                setTotalAppointments(response.data.totalAppointments);
                setPendingAppointments(response.data.pendingAppointments);
                setCompletedAppointments(response.data.completedAppointments);
            } else {
                alert("Something went wrong");
            }
        } catch (error) {
            console.error("❌ Error fetching appointments data:", error);
        }
    };

    useEffect(() => {
        fetchTotalUsers();
        fetchTotalDoctors();
        fetchAppointmentsData();
    }, []);

    return (
        <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope">
            <div className="mb-8">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Admin Dashboard</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Platform overview and statistics.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {[
                    { label: "Total Appointments", value: totalAppointments, icon: "event_note", color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Completed", value: completedAppointments, icon: "check_circle", color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Pending", value: pendingAppointments, icon: "schedule", color: "text-amber-600", bg: "bg-amber-50" },
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
                        <div className="font-label-md text-label-md text-on-surface-variant">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminContent;

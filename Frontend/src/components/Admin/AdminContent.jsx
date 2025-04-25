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
        <div className="w-full">
            <div className="pt-20 px-2 sm:px-4 lg:px-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pb-4">
                    <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
                        <div className="text-4xl font-bold text-emerald-700 mb-4">
                            <CountUp end={totalAppointments} duration={4} />
                        </div>
                        <div className="bg-emerald-200 text-emerald-700 w-full text-center py-2 rounded-md font-medium">
                            Number of Appointments
                        </div>
                    </div>

                    <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
                        <div className="text-4xl font-bold text-emerald-700 mb-4">
                            <CountUp end={completedAppointments} duration={4} />
                        </div>
                        <div className="bg-emerald-200 text-emerald-700 w-full text-center py-2 rounded-md font-medium">
                            Completed Appointments
                        </div>
                    </div>

                    <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
                        <div className="font-bold text-4xl text-emerald-700">
                            <CountUp end={totalDoctors} duration={4} />
                        </div>
                        <div className="bg-emerald-200 text-emerald-700 w-full text-center py-2 rounded-md font-medium">
                            Total Doctors
                        </div>
                    </div>

                    <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
                        <div className="font-bold text-4xl text-emerald-700">
                            <CountUp end={totalUsers} duration={4} />
                        </div>
                        <div className="bg-emerald-200 text-emerald-700 w-full text-center py-2 rounded-md font-medium">
                            Total Users
                        </div>
                    </div>

                    <div className="border shadow-lg rounded-lg p-6 flex flex-col items-center justify-center bg-white hover:shadow-2xl duration-300">
                        <div className="text-4xl font-bold text-emerald-700 mb-4">
                            <CountUp end={pendingAppointments} duration={4} />
                        </div>
                        <div className="bg-emerald-200 text-emerald-700 w-full text-center py-2 rounded-md font-medium">
                            Pending Appointments
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContent;

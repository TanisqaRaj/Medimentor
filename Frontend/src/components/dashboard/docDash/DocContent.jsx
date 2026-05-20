import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import api from '../../../api';

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const DocContent = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const doctorId = useSelector((state) => state.auth.doctor?._id);

  useEffect(() => {
    const fetchStats = async () => {
      if (!doctorId) return;
      try {
        const response = await api.get(`${BACKEND}/appointments/docapp/${doctorId}`);
        
        if (response?.data?.success) {
          const pending = response.data.pendingAppointments || [];
          const approvedAndCompleted = response.data.approvedAppointments || [];
          
          const completedCount = approvedAndCompleted.filter(app => app.status === "completed").length;
          
          setStats({
            total: response.data.totalAppointments || 0,
            completed: completedCount,
            pending: pending.length,
          });
        }
      } catch (error) {
        console.error("Error fetching doctor stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [doctorId]);

  return (
    <div className='w-full max-w-[1280px] mx-auto py-8 font-manrope'>
      <div className="px-4 lg:px-10 w-full mb-8">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Doctor Dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">Your appointment overview and statistics.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant/50 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 group">
            <div className="text-4xl font-headline-lg font-bold text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              {loading ? "..." : stats.total}
            </div>
            <div className="bg-emerald-50 text-emerald-700 w-full text-center py-2.5 rounded-lg font-label-md">
              Total Appointments
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 group">
            <div className="text-4xl font-headline-lg font-bold text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              {loading ? "..." : stats.completed}
            </div>
            <div className="bg-blue-50 text-blue-700 w-full text-center py-2.5 rounded-lg font-label-md">
              Completed Appointments
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant/50 shadow-sm rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-all duration-300 group">
            <div className="text-4xl font-headline-lg font-bold text-amber-600 mb-4 group-hover:scale-110 transition-transform">
              {loading ? "..." : stats.pending}
            </div>
            <div className="bg-amber-50 text-amber-700 w-full text-center py-2.5 rounded-lg font-label-md">
              Pending Appointments
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocContent;

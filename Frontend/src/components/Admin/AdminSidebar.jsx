import  { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { FaBookMedical } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaUserCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate=useNavigate();
    const user = useSelector((state) => state.auth.user);
     const sidebarItems = [
        { title: "Total appointment", icon: <FaBookMedical /> ,path:"/totalappointmentlist"},
        { title: "Registered Doctor", icon: <FaUserDoctor />, path:"/doctorlist" },
        { title: "registered User", icon: <FaUser />, path:"/userlist" },
        { title: "Verify Doctor", icon: <FaUserCheck />, path: "https://www.nmc.org.in/information-desk/indian-medical-register/" },
        { title: "Dashboard", icon: <FaBookMedical /> ,path:"/admindashboard"},
      ];

  return (
    <div
      className={`${open ? "w-[240px]" : "w-[64px]"} duration-300 flex flex-col h-screen bg-white border-r border-outline-variant/40 shadow-sm sticky top-0 font-manrope`}
    >
      {/* Toggle */}
      <div
        className={`flex ${!open ? "justify-center" : "justify-end pr-4"} pt-4 pb-3 cursor-pointer text-on-surface-variant hover:text-primary transition-colors`}
        onClick={() => setOpen(!open)}
      >
        <BsLayoutSidebarInset className={`text-lg transition-transform ${!open ? "rotate-180" : ""}`} />
      </div>

      {/* Profile */}
      {open && (
        <div className="flex flex-col items-center px-4 pb-5 border-b border-outline-variant/30 mb-4">
          <div className="w-16 h-16 rounded-full bg-primary-container/20 border-2 border-primary-container/40 overflow-hidden shadow-sm mb-2">
            <img
              src={`data:image/png;base64,${user?.image}`}
              className="h-full w-full object-cover"
              alt="Admin"
            />
          </div>
          <h2 className="font-label-md text-label-md text-on-surface text-center truncate w-full">{user?.name}</h2>
          <span className="font-caption text-caption text-outline">Admin</span>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-grow px-2 space-y-1">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all ${!open ? "justify-center" : ""}`}
            onClick={() => navigate(item.path)}
            title={!open ? item.title : ""}
          >
            <div className="text-lg shrink-0">{item.icon}</div>
            {open && (
              <span className="font-body-md text-body-md truncate">{item.title}</span>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}

export default AdminSidebar;
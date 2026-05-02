import  { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { FaNotesMedical } from "react-icons/fa";
import { TbHistoryToggle } from "react-icons/tb";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { FaBookMedical } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DocSidebar = () => {
    const [open, setOpen] = useState(false);
    const navigate=useNavigate();
    const doctor = useSelector((state) => state.auth.doctor);
     const sidebarItems = [
        { title: "Incoming Request", icon: <FaBookMedical /> ,path:"/incomingrequest"},
        // { title: "Appointments", icon: <FaNotesMedical />,  },
        // { title: "Previous Appointment", icon: <TbHistoryToggle /> },
        { title: "Buy Medicine", icon: <AiTwotoneMedicineBox />, path:"/pharmacy" },
      ];

      const openProfile=()=>{
        navigate("/doctorprofile");
      }

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
        <div className="flex flex-col items-center px-4 pb-5 border-b border-outline-variant/30 mb-4 cursor-pointer" onClick={openProfile}>
          <div className="w-16 h-16 rounded-full bg-primary-container/20 border-2 border-primary-container/40 overflow-hidden shadow-sm mb-2 hover:ring-2 hover:ring-primary transition-all">
            <img
              src={`data:image/png;base64,${doctor?.image}`}
              className="h-full w-full object-cover"
              alt="Doctor"
            />
          </div>
          <h2 className="font-label-md text-label-md text-on-surface text-center truncate w-full">{doctor?.name}</h2>
          <span className="font-caption text-caption text-outline">Doctor</span>
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

export default DocSidebar;
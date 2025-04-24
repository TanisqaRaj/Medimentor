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
        { title: "Appointments", icon: <FaNotesMedical />,  },
        { title: "Previous Appointment", icon: <TbHistoryToggle /> },
        { title: "Buy Medicine", icon: <AiTwotoneMedicineBox />, path:"/pharmacy" },
      ];

      const openProfile=()=>{
        navigate("/doctorprofile");
      }

  return (
      <div
        className={`${
          open ? "w-[250px]" : "w-[60px]"
        } duration-400 p-4 flex flex-col h-[100vh] bg-emerald-500 text-black rounded-r-xl  justify-start sticky top-0`}
      >
        {/* Toggle Icon */}
        <div
          className={`${
            !open && "rotate-180 justify-center"
          } flex justify-end mb-6 cursor-pointer`}
          onClick={() => setOpen(!open)}
        >
          <BsLayoutSidebarInset />
        </div>
  
        {/* Profile Picture */}
        {open && (
          <div className="flex flex-col items-center mb-12">
            <div className="h-24 w-24 border shadow-lg rounded-full overflow-hidden"
            onClick={openProfile}>
              <img
                src={`data:image/png;base64,${doctor?.image}`}
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="mt-4 text-sm  text-gray-800 font-semibold">
              {doctor?.name}
            </h2>
          </div>
        )}
  
        {/* Sidebar Items */}
        <div className="space-y-6">
          {sidebarItems.map((item, index) => (          
            <div
              key={index}
              className={`flex items-center gap-4 cursor-pointer hover:bg-emerald-600 px-4 py-2 rounded-md ${
                !open && "justify-center"
              }`}
              onClick={() => navigate(item.path)} 
            >
              <div className="text-xl">{item.icon}</div>
              {open && (
                <span className="text-lg  text-gray-800 font-medium"
                >
                  {item.title}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
}

export default DocSidebar
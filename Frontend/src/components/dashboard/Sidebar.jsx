import { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { FaNotesMedical} from "react-icons/fa";
import { TbHistoryToggle } from "react-icons/tb";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { FaBookMedical } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiCalendarScheduleLine } from "react-icons/ri";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const sidebarItems = [
    { title: "Book Appointment", icon: <FaBookMedical />, path: "/bookappointment" },
    { title: "Appointment List", icon: <FaNotesMedical />, path: "/appointmentlist" },
    { title: "Scheduled meet", icon: <RiCalendarScheduleLine />, path: "/scheduledmeet" },
    { title: "Appointment History", icon: <TbHistoryToggle /> , path: "/appointmenthistory" },
    { title: "Buy Medicine", icon: <AiTwotoneMedicineBox />, path: "/pharmacy" },
  ];

  return (
    <div
      className={`${open ? "w-[250px]" : "w-[72px]"
        } duration-300 px-2 py-6 flex flex-col bg-surface-container-lowest border-r border-outline-variant/30 text-on-surface h-screen sticky top-0 font-manrope z-40 shadow-sm`}
    >
      {/* Toggle Icon */}
      <div
        className={`flex justify-end mb-8 cursor-pointer text-outline hover:text-primary-container transition-colors ${!open && "justify-center"}`}
        onClick={() => setOpen(!open)}
      >
        <BsLayoutSidebarInset className="text-2xl" />
      </div>

      {/* Profile Picture */}
      {open && (
        <div className="flex flex-col items-center mb-10 fade-in">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-surface-variant shadow-sm bg-surface-container">
            <img
              src={user?.image ? `data:image/png;base64,${user.image}` : "https://lh3.googleusercontent.com/aida-public/AB6AXuCI5Do1Pm2eJcPZL-GTT40jlo-1JJiqsgGSvyxeoAcu17qkWeFrInVSfPgjESLnHfYeS3XEikm37EGyeqC4nmmVWIJ5l47qLcDbt2dy2chL4BN20N-t_w2TH6Elh6AcekwjQgr02tMwihBw03YuW8VQWy01ifuCUHxrScQeTOEuolPT5Aj-CmIviyLTTq437v-UHHrS5YBz2aeDGwx_yn-_8OVPxHgP-GS1tyThYBhq9ELXYmX8UGxvvFg9WqDfrOyq16_aUpTQbKSa"}
              className="h-full w-full object-cover"
              alt="Profile"
            />
          </div>
          <h2 className="mt-3 text-label-md font-headline-md text-on-surface tracking-tight">
            {user?.name || "Patient"}
          </h2>
          <span className="text-caption font-body-md text-primary mt-0.5 bg-primary/10 px-2 py-0.5 rounded-full">User Account</span>
        </div>
      )}

      {/* Sidebar Items */}
      <div className="space-y-2 mt-2">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 cursor-pointer px-3 py-3 rounded-lg transition-all duration-200 hover:bg-primary-container/10 hover:text-primary-container text-on-surface-variant group ${!open && "justify-center"
              }`}
            onClick={() => navigate(item.path)}
            title={!open ? item.title : ""}
          >
            <div className="text-[20px] group-hover:scale-110 transition-transform">{item.icon}</div>
            {open && (
              <span className="text-label-md font-label-md whitespace-nowrap">
                {item.title}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

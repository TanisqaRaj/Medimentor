import { useState } from "react";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { FaUserDoctor, FaUserCheck, FaBookMedical } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import { AiTwotoneMedicineBox } from "react-icons/ai";
import { FiGrid, FiPackage, FiShoppingBag, FiFileText, FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const PHARMACY_PATHS = [
  "/pharmacy/admin",
  "/pharmacy/admin/medicines",
  "/pharmacy/admin/orders",
  "/pharmacy/admin/prescriptions",
];

const AdminSidebar = () => {
  const [open, setOpen] = useState(false);
  const [pharmacyOpen, setPharmacyOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const isActive = (path) => location.pathname === path;
  const isPharmacySection = PHARMACY_PATHS.some((p) => location.pathname.startsWith(p));

  const mainItems = [
    { title: "Dashboard",          icon: <FaBookMedical />,      path: "/admindashboard" },
    { title: "Appointments",       icon: <FaBookMedical />,      path: "/totalappointmentlist" },
    { title: "Doctors",            icon: <FaUserDoctor />,       path: "/doctorlist" },
    { title: "Users",              icon: <FaUser />,             path: "/userlist" },
    { title: "Monitor",            icon: <AiTwotoneMedicineBox />, path: "/monitor" },
  ];

  const pharmacyItems = [
    { title: "Pharmacy Dashboard", icon: <FiGrid />,        path: "/pharmacy/admin" },
    { title: "Medicines",          icon: <FiPackage />,     path: "/pharmacy/admin/medicines" },
    { title: "Orders",             icon: <FiShoppingBag />, path: "/pharmacy/admin/orders" },
    { title: "Prescriptions",      icon: <FiFileText />,    path: "/pharmacy/admin/prescriptions" },
  ];

  const NavItem = ({ item }) => (
    <div
      onClick={() => navigate(item.path)}
      title={!open ? item.title : ""}
      className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg transition-all
        ${!open ? "justify-center" : ""}
        ${isActive(item.path)
          ? "bg-emerald-50 text-emerald-700 font-semibold"
          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
        }`}
    >
      <div className="text-lg shrink-0">{item.icon}</div>
      {open && <span className="font-body-md text-body-md truncate">{item.title}</span>}
    </div>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`${open
          ? "w-[240px] shadow-2xl md:shadow-sm max-md:fixed max-md:left-0 max-md:top-[64px] max-md:h-[calc(100vh-64px)]"
          : "w-0 md:w-[64px] overflow-hidden md:overflow-visible"
        } duration-300 flex flex-col h-screen bg-white border-r border-outline-variant/40 shadow-sm sticky top-0 font-manrope z-50`}
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
              <img src={user?.image} className="h-full w-full object-cover" alt="Admin" />
            </div>
            <h2 className="font-label-md text-label-md text-on-surface text-center truncate w-full">{user?.name}</h2>
            <span className="font-caption text-caption text-outline">Admin</span>
          </div>
        )}

        {/* Nav Items */}
        <nav className="flex-grow px-2 space-y-1 overflow-y-auto">
          {mainItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}

          {/* Verify Doctor — external link */}
          <a
            href="https://www.nmc.org.in/information-desk/indian-medical-register/"
            target="_blank"
            rel="noopener noreferrer"
            title={!open ? "Verify Doctor" : ""}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container hover:text-primary ${!open ? "justify-center" : ""}`}
          >
            <div className="text-lg shrink-0"><FaUserCheck /></div>
            {open && <span className="font-body-md text-body-md truncate">Verify Doctor</span>}
          </a>

          {/* Pharmacy Section */}
          <div className="pt-1">
            {open && (
              <p className="px-3 py-1 text-[10px] uppercase tracking-widest text-outline font-semibold">
                Pharmacy
              </p>
            )}
            {/* Pharmacy toggle (collapsed sidebar: show first icon, navigate to /pharmacy/admin) */}
            <div
              onClick={() => open ? setPharmacyOpen(!pharmacyOpen) : navigate("/pharmacy/admin")}
              title={!open ? "Pharmacy" : ""}
              className={`flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg transition-all
                ${!open ? "justify-center" : "justify-between"}
                ${isPharmacySection
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                }`}
            >
              <div className="flex items-center gap-3">
                <FiGrid className="text-lg shrink-0" />
                {open && <span className="font-body-md text-body-md">Pharmacy</span>}
              </div>
              {open && (
                pharmacyOpen || isPharmacySection
                  ? <FiChevronDown className="text-sm" />
                  : <FiChevronRight className="text-sm" />
              )}
            </div>

            {/* Pharmacy sub-items */}
            {open && (pharmacyOpen || isPharmacySection) && (
              <div className="ml-3 mt-1 space-y-1 border-l-2 border-teal-100 pl-3">
                {pharmacyItems.map((item) => (
                  <div
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg transition-all text-sm
                      ${isActive(item.path)
                        ? "bg-teal-50 text-teal-700 font-semibold"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                      }`}
                  >
                    <div className="shrink-0">{item.icon}</div>
                    <span className="truncate">{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile open button */}
      {!open && (
        <button
          className="md:hidden fixed bottom-6 left-4 z-50 bg-emerald-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <BsLayoutSidebarInset className="text-xl rotate-180" />
        </button>
      )}
    </>
  );
};

export default AdminSidebar;

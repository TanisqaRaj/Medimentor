import { NavLink, Link } from "react-router-dom";
import { FiGrid, FiPackage, FiShoppingBag, FiFileText, FiArrowLeft, FiTag } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";

const links = [
  { to: "/pharmacy/admin", icon: <FiGrid />, label: "Dashboard" },
  { to: "/pharmacy/admin/medicines", icon: <FiPackage />, label: "Medicines" },
  { to: "/pharmacy/admin/categories", icon: <FiTag />, label: "Categories" },
  { to: "/pharmacy/admin/orders", icon: <FiShoppingBag />, label: "Orders" },
  { to: "/pharmacy/admin/prescriptions", icon: <FiFileText />, label: "Prescriptions" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-56 bg-white border-r border-gray-100 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-teal-600 font-bold">
          <MdLocalPharmacy className="text-xl" />
          <span className="text-sm">Pharmacy Admin</span>
        </div>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/pharmacy/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                isActive
                  ? "bg-teal-50 text-teal-700 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            {icon} {label}
          </NavLink>
        ))}
      </nav>
      {/* Back to main admin dashboard */}
      <div className="p-3 border-t border-gray-100">
        <Link
          to="/admindashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
        >
          <FiArrowLeft /> Back to Dashboard
        </Link>
      </div>
    </aside>
  );
}

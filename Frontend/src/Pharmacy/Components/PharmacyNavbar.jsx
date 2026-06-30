import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiShoppingCart, FiPackage, FiGrid } from "react-icons/fi";
import { MdLocalPharmacy } from "react-icons/md";

const DASHBOARD_MAP = {
  user:   "/dashboard",
  doctor: "/doctordashboard",
  admin:  "/admindashboard",
};

export default function PharmacyNavbar() {
  const { cart } = useSelector((s) => s.pharmacy);
  const user   = useSelector((s) => s.auth.user);
  const doctor = useSelector((s) => s.auth.doctor);
  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const role = user?.role || doctor?.role;
  const dashboardPath = DASHBOARD_MAP[role] || "/";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/pharmacy" className="flex items-center gap-2 text-teal-600 font-bold text-lg">
          <MdLocalPharmacy className="text-2xl" />
          <span>MediMentor Pharmacy</span>
        </Link>

        <div className="flex items-center gap-4">
          {/* Role-aware dashboard link */}
          <Link
            to={dashboardPath}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 transition"
            title="Go to Dashboard"
          >
            <FiGrid />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          {/* Hide cart/orders for admin */}
          {role !== "admin" && (
            <>
              <Link to="/pharmacy/orders" className="text-gray-500 hover:text-teal-600 transition flex items-center gap-1 text-sm">
                <FiPackage />
                <span className="hidden sm:inline">Orders</span>
              </Link>
              <Link to="/pharmacy/cart" className="relative text-gray-500 hover:text-teal-600 transition">
                <FiShoppingCart className="text-xl" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

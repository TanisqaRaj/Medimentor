import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user, doctor, accessToken } = useSelector((state) => state.auth);

  if (!accessToken) return <Navigate to="/login" replace />;

  // doctor role stored in state.auth.doctor, user/admin in state.auth.user
  const role = doctor?.role ?? user?.role;

  if (!allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admindashboard" replace />;
    if (role === "doctor") return <Navigate to="/doctordashboard" replace />;
    if (role === "user") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

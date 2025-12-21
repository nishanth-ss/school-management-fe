import { Navigate, Outlet } from "react-router-dom";

const normalizeRole = (role) =>
  role?.replace(/\s+/g, "").toUpperCase();

const ProtectedRoute = ({ allowedRoles }) => {
  const storedRole = localStorage.getItem("role");

  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  const userRole = normalizeRole(storedRole);
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole);

  const isAllowed = normalizedAllowedRoles.includes(userRole);

  if (!isAllowed) {
    console.log("Not authorized:", {
      userRole,
      allowedRoles: normalizedAllowedRoles,
    });
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

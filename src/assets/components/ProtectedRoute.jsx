import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRoleFromToken } from "../../utils/jwt";
import { clearSession, getAccessToken, getDefaultRouteByRole } from "../../utils/session";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const role = getRoleFromToken(token);

  if (!role) {
    clearSession();
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={getDefaultRouteByRole(role)} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;

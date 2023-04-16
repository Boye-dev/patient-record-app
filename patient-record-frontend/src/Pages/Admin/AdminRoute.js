import { Navigate, useLocation, Outlet } from "react-router-dom";
import AuthService from "../../auth_service";
const { getCurrentAdmin } = AuthService;
const AdminRoute = () => {
  const location = useLocation();

  return getCurrentAdmin()?.role === "Staff" ? (
    <Outlet />
  ) : (
    <Navigate to="/login-staff" state={{ from: location }} replace />
  );
};

export default AdminRoute;

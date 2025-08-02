import { Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContex";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuth, role } = useAuth();

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;

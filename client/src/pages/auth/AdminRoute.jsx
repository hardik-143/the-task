import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Layout from "../Layout";

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (user.type !== "admin") {
    console.log("Not authorized, redirecting to dashboard...");
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth);

  // If user is authenticated, redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the public route
  return <Outlet />;
};

export default PublicRoute;

import { useDispatch } from "react-redux";
import { handleLogout } from "../../reducers/authSlice";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(handleLogout());
  }, [dispatch, navigate]);

  let previousLocation = useLocation();
  return <Navigate to="/login" state={{ from: previousLocation }} />;
}

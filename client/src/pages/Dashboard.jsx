import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../reducers/authSlice";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
      </div>
    </>
  );
}

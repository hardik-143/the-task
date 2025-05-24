import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { handleLogout } from "../../reducers/authSlice";
const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <header className="bg-white shadow-sm">
      <div className="custom-container !py-4">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="text-2xl font-bold text-gray-800">
            The Task
          </Link>
          <div className="flex items-center gap-4">
            <h3 className="text-gray-600">
              Welcome, <span className="capitalize">{user.username}</span>
            </h3>
            <Link
              to="#"
              onClick={() => dispatch(handleLogout())}
              className=" hover:text-gray-900 font-bold text-blue-700 underline underline-offset-4"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

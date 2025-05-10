import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import { handleLogout } from "../reducers/authSlice";
import Navbar from "../components/common/Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="custom-container mx-auto !py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

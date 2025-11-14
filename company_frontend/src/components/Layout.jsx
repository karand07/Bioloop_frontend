// src/components/Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  // Go to profile page
  const handleProfile = () => {
    navigate("/profile");
  };

  // Logout logic
  const handleLogout = () => {
    localStorage.removeItem("farmerToken"); // remove token
    alert("Logged out successfully!");
    navigate("/"); // redirect to login
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div style={{ width: "250px", height: "100vh", backgroundColor: "#e9f7ef" }}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1">
        <Navbar onProfile={handleProfile} onLogout={handleLogout} />
        <div className="p-4" style={{ backgroundColor: "#fdfdfd", minHeight: "100vh" }}>
          <Outlet /> {/* Page content will render here */}
        </div>
      </div>
    </div>
  );
};

export default Layout;

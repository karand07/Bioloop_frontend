// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaSeedling,
  FaPlusCircle,
  FaListAlt,
  FaShoppingBag,
  FaUserCircle,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-white bg-success vh-100"
      style={{ width: "250px", position: "fixed", left: 0,top: "0" }}
    >
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/dashboard"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaSeedling className="me-2" />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/createWaste"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaPlusCircle className="me-2" />
            Create Waste
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/wasteList"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaListAlt className="me-2" />
            Waste List
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/orders"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaShoppingBag className="me-2" />
            Orders
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/profile"
            className="nav-link text-white d-flex align-items-center"
          >
            <FaUserCircle className="me-2" />
            Profile
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

// src/components/Navbar.jsx
import React from "react";

const Navbar = ({ onProfile = () => {}, onLogout = () => {} }) => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-success shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold d-flex align-items-center gap-2" href="/">
          <span role="img" aria-label="leaf">🌱</span>
          Bioloop
        </a>

        {/* Right actions */}
        <div className="d-flex ms-auto align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={onProfile}
          >
            Profile
          </button>
          <button
            type="button"
            className="btn btn-light btn-sm text-success fw-semibold"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

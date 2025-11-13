import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const FarmerLogin = () => {
  const [farmerEmail, setFarmerEmail] = useState("");
  const [farmerPassword, setFarmerPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/farmer/login", {
        farmerEmail,
        farmerPassword,
      });

      if (res.data.token) {
        localStorage.setItem("FarmerToken", res.data.token);
        alert("Login successful!");
        navigate("/dashboard"); // redirect after login
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login failed. Please check credentials or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4">👨‍🌾 Farmer Login</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              value={farmerEmail}
              onChange={(e) => setFarmerEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={farmerPassword}
              onChange={(e) => setFarmerPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-decoration-none text-success fw-semibold"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default FarmerLogin;

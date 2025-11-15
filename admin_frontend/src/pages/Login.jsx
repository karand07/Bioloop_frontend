import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/admin/login", {
        adminEmail,
        adminPassword,
      });

      if (res.data.token) {
        localStorage.setItem("AdminToken", res.data.token);
        alert("✅ Login successful!");
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e9f7ef, #ffffff)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "420px",
          borderRadius: "16px",
          border: "1px solid #b7e4c7",
        }}
      >
        <h3 className="text-center text-success fw-bold mb-3">
          🛠️ Bioloop Admin Login
        </h3>
        <p className="text-center text-muted mb-4">
          Access your Bioloop admin dashboard
        </p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-success">Email</label>
            <input
              type="email"
              className="form-control border-success"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{ borderRadius: "8px", backgroundColor: "#f9fff9" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-success">
              Password
            </label>
            <input
              type="password"
              className="form-control border-success"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              required
              placeholder="Enter your password"
              style={{ borderRadius: "8px", backgroundColor: "#f9fff9" }}
            />
          </div>

          <button
            type="submit"
            className="btn text-white w-100 fw-semibold"
            style={{
              background: "linear-gradient(90deg, #2d6a4f, #52b788)",
              borderRadius: "10px",
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Don’t have an account?{" "}
          <a href="/signup" className="text-success fw-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

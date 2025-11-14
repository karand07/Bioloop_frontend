import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPassword, setCompanyPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/company/login", {
        companyEmail,
        companyPassword,
      });

      if (res.data.token) {
        localStorage.setItem("CompanyToken", res.data.token);
        alert("Login successful!");
        navigate("/dashboard"); // redirect after login
      } else {
        alert(res.data.messagage || "Login failed");
      }
    } catch (err) {
      console.error("Company Login Error:", err);
      alert("Login failed. Please check credentials or try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4 text-success fw-bold">
          🏭 Company Login - Bioloop
        </h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={companyPassword}
              onChange={(e) => setCompanyPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
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

export default Login;

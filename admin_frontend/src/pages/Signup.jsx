import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminAdhar: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/admin/signup", formData);

      if (res.data.message === "Farmer already exists") {
        setError("Admin already exists. Please login instead.");
      } else if (res.data.message === "registration completed succesfully") {
        setMessage("✅ Registration completed successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Something went wrong. Please try again later.");
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
          width: "450px",
          borderRadius: "16px",
          border: "1px solid #b7e4c7",
        }}
      >
        <h3 className="text-center text-success fw-bold mb-3">
          🛠️ Bioloop Admin Signup
        </h3>
        <p className="text-center text-muted mb-4">
          Create your admin account to manage Bioloop operations
        </p>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-success">Name</label>
            <input
              type="text"
              className="form-control border-success"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              style={{ borderRadius: "8px", backgroundColor: "#f9fff9" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-success">Email</label>
            <input
              type="email"
              className="form-control border-success"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              required
              placeholder="Enter email address"
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
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              required
              placeholder="Create password"
              style={{ borderRadius: "8px", backgroundColor: "#f9fff9" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-success">
              Aadhaar Number
            </label>
            <input
              type="text"
              className="form-control border-success"
              name="adminAdhar"
              value={formData.adminAdhar}
              onChange={handleChange}
              required
              placeholder="Enter Aadhaar number"
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-3 mb-0">
          Already have an account?{" "}
          <a href="/" className="text-success fw-semibold">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

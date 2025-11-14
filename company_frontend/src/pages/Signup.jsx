import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanySignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyPassword: "",
    companyStreet: "",
    companyVillage: "",
    companyPincode: "",
    companyBio: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/company/signup", formData);

      if (res.data === "company Already Exists") {
        setError("Company already exists. Please login instead.");
      } else if (res.data.messagage === "Company registered Succcessfully") {
        setMessage("Registration completed successfully!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#eaf5ea" }}
    >
      <div
        className="card shadow p-4"
        style={{ width: "450px", borderRadius: "12px" }}
      >
        <h3 className="text-center text-success fw-bold mb-3">
          🏭 Bioloop Company Signup
        </h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Company Name</label>
            <input
              type="text"
              className="form-control"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Phone</label>
            <input
              type="text"
              className="form-control"
              name="companyPhone"
              value={formData.companyPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              name="companyPassword"
              value={formData.companyPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Street</label>
            <input
              type="text"
              className="form-control"
              name="companyStreet"
              value={formData.companyStreet}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Village</label>
            <input
              type="text"
              className="form-control"
              name="companyVillage"
              value={formData.companyVillage}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Pincode</label>
            <input
              type="text"
              className="form-control"
              name="companyPincode"
              value={formData.companyPincode}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Bio</label>
            <textarea
              className="form-control"
              name="companyBio"
              value={formData.companyBio}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
          >
            Register
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

export default CompanySignup;

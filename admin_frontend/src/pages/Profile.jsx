import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("AdminToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/company/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompany(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching company profile:", err);
        alert("Failed to load company profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:3000/company/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompany(res.data.company);
      setEditMode(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌱 Loading company profile...
      </div>
    );

  return (
    <div
      className="d-flex justify-content-center align-items-start py-5"
      style={{
        background: "linear-gradient(135deg, #e9f7ef, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <div
        className="shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "850px",
          backgroundColor: "#fff",
          borderRadius: "20px",
          border: "1px solid #d8f3dc",
        }}
      >
        {/* Header */}
        <div
          className="text-center py-4 mb-3 text-white rounded"
          style={{
            background: "linear-gradient(90deg, #2d6a4f, #52b788)",
            borderRadius: "16px",
          }}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/906/906175.png"
            alt="Company Logo"
            width="100"
            className="rounded-circle border border-light shadow-sm mb-3"
          />
          <h3 className="fw-bold">{company.companyName}</h3>
          <p className="mb-0 small">
            <i className="bi bi-envelope-fill"></i> {company.companyEmail}
          </p>
          <small className="text-light">📞 {company.companyPhone}</small>
        </div>

        {/* Profile Section */}
        <div className="p-3">
          {!editMode ? (
            <>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light">
                    <strong>🏢 Street:</strong>
                    <p className="mb-0 text-muted">{company.companyStreet}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light">
                    <strong>📍 Village:</strong>
                    <p className="mb-0 text-muted">{company.companyVillage}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-3 bg-light">
                    <strong>📮 Pincode:</strong>
                    <p className="mb-0 text-muted">{company.companyPincode}</p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="border rounded p-3 bg-light">
                    <strong>🪴 Bio:</strong>
                    <p className="mb-0 text-muted">
                      {company.companyBio || "No bio added yet."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn px-5 py-2 text-white fw-semibold"
                  style={{
                    background: "linear-gradient(90deg, #52b788, #2d6a4f)",
                    borderRadius: "12px",
                  }}
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleUpdate} className="mt-3">
              <div className="row">
                {[
                  { label: "Name", name: "companyName" },
                  { label: "Email", name: "companyEmail", type: "email" },
                  { label: "Phone", name: "companyPhone" },
                  { label: "Street", name: "companyStreet" },
                  { label: "Village", name: "companyVillage" },
                  { label: "Pincode", name: "companyPincode" },
                ].map(({ label, name, type }) => (
                  <div className="col-md-6 mb-3" key={name}>
                    <label className="form-label text-success fw-semibold">
                      {label}
                    </label>
                    <input
                      type={type || "text"}
                      name={name}
                      value={formData[name] || ""}
                      onChange={handleChange}
                      className="form-control border-success"
                      style={{
                        borderRadius: "10px",
                        backgroundColor: "#f8fff8",
                      }}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <label className="form-label text-success fw-semibold">
                  Bio
                </label>
                <textarea
                  name="companyBio"
                  value={formData.companyBio || ""}
                  onChange={handleChange}
                  rows="3"
                  className="form-control border-success"
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#f8fff8",
                  }}
                ></textarea>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2"
                  style={{ borderRadius: "10px" }}
                  onClick={() => setEditMode(false)}
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white px-4 py-2 fw-semibold"
                  style={{
                    background: "linear-gradient(90deg, #2d6a4f, #40916c)",
                    borderRadius: "10px",
                  }}
                >
                  💾 Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("FarmerToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/farmer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmer(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        alert("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:3000/farmer/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFarmer(res.data.farmer);
      setEditMode(false);
      alert("✅ Profile updated successfully");
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating profile");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌱 Loading your Bioloop profile...
      </div>
    );

  return (
    <div
      className="container mt-5 d-flex justify-content-center"
      style={{
        minHeight: "80vh",
        background: "linear-gradient(to bottom right, #e9f7ef, #ffffff)",
        borderRadius: "20px",
        padding: "2rem",
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
        }}
      >
        <div
          className="card-header text-center text-white fw-bold py-3"
          style={{
            background: "linear-gradient(90deg, #2d6a4f, #40916c)",
            borderTopLeftRadius: "20px",
            borderTopRightRadius: "20px",
            fontSize: "1.4rem",
            letterSpacing: "1px",
          }}
        >
          👨‍🌾 Farmer Profile
        </div>

        <div className="card-body p-4">
          {!editMode ? (
            <div>
              <div className="text-center mb-4">
                <img
                  src="https://media.assettype.com/pudhari%2Fimport%2Fwp-content%2Fuploads%2F2023%2F09%2FPM-Kisan.png?w=1200&ar=40%3A21&auto=format%2Ccompress&ogImage=true&mode=crop&enlarge=true&overlay=false&overlay_position=bottom&overlay_width=100"
                  alt="Farmer Avatar"
                  width="100"
                  className="rounded-circle border border-success shadow-sm mb-3"
                />
                <h5 className="text-success fw-bold">{farmer.farmerName}</h5>
                <p className="text-muted mb-0">{farmer.farmerEmail}</p>
                <small className="text-secondary">📞 {farmer.farmerPhone}</small>
              </div>

              <hr />
              <div className="row">
                <div className="col-md-6 mb-3">
                  <strong>🏡 Street:</strong>
                  <p className="text-muted">{farmer.farmerStreet}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>🌾 Village:</strong>
                  <p className="text-muted">{farmer.farmerVillage}</p>
                </div>
                <div className="col-md-6 mb-3">
                  <strong>📮 Pincode:</strong>
                  <p className="text-muted">{farmer.farmerPincode}</p>
                </div>
                <div className="col-md-12 mb-3">
                  <strong>🪴 Bio:</strong>
                  <p className="text-muted">
                    {farmer.farmerBio || "No bio added yet."}
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  className="btn px-4 py-2 text-white"
                  style={{
                    background: "linear-gradient(90deg, #52b788, #2d6a4f)",
                    borderRadius: "10px",
                  }}
                  onClick={() => setEditMode(true)}
                >
                  ✏️ Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate}>
              {[
                { label: "Name", name: "farmerName" },
                { label: "Email", name: "farmerEmail", type: "email" },
                { label: "Phone", name: "farmerPhone" },
                { label: "Street", name: "farmerStreet" },
                { label: "Village", name: "farmerVillage" },
                { label: "Pincode", name: "farmerPincode" },
              ].map(({ label, name, type }) => (
                <div className="mb-3" key={name}>
                  <label className="form-label fw-semibold text-success">
                    {label}
                  </label>
                  <input
                    type={type || "text"}
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="form-control border-success"
                    required
                    style={{
                      borderRadius: "8px",
                      backgroundColor: "#f9fff9",
                    }}
                  />
                </div>
              ))}

              <div className="mb-3">
                <label className="form-label fw-semibold text-success">Bio</label>
                <textarea
                  name="farmerBio"
                  value={formData.farmerBio || ""}
                  onChange={handleChange}
                  className="form-control border-success"
                  rows="3"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#f9fff9",
                  }}
                ></textarea>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setEditMode(false)}
                  style={{ borderRadius: "10px" }}
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-white px-4"
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

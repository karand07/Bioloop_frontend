import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("AdminToken");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/allFarmers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmers(res.data || []);
      } catch (err) {
        console.error("Error fetching farmers:", err);
        alert("Failed to load farmers.");
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, [token]);

  const filteredFarmers = farmers.filter(
    (f) =>
      f.farmerName?.toLowerCase().includes(search.toLowerCase()) ||
      f.farmerVillage?.toLowerCase().includes(search.toLowerCase()) ||
      f.farmerEmail?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading farmers...
      </div>
    );

  return (
    <div
      className="container mt-5 p-4 shadow-lg"
      style={{ backgroundColor: "#f4fff4", borderRadius: "16px" }}
    >
      <h3 className="text-center mb-4 fw-bold text-success">👨‍🌾 View Farmers</h3>

      <div className="mb-3 text-end">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by name, email, or village"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px", marginLeft: "auto" }}
        />
      </div>

      {filteredFarmers.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No farmers found 🌱
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#d8f3dc", color: "#1b4332" }}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Village</th>
                <th>Street</th>
                <th>Pincode</th>
                <th>Bio</th>
              </tr>
            </thead>
            <tbody>
              {filteredFarmers.map((farmer) => (
                <tr key={farmer._id}>
                  <td>{farmer.farmerName}</td>
                  <td>{farmer.farmerEmail}</td>
                  <td>{farmer.farmerPhone}</td>
                  <td>{farmer.farmerVillage}</td>
                  <td>{farmer.farmerStreet}</td>
                  <td>{farmer.farmerPincode}</td>
                  <td>{farmer.farmerBio || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFarmers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("AdminToken");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/allCompanies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCompanies(res.data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        alert("Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, [token]);

  const filteredCompanies = companies.filter(
    (c) =>
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyEmail?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyVillage?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading companies...
      </div>
    );

  return (
    <div
      className="container mt-5 p-4 shadow-lg"
      style={{ backgroundColor: "#f4fff4", borderRadius: "16px" }}
    >
      <h3 className="text-center mb-4 fw-bold text-success">🏢 View Companies</h3>

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

      {filteredCompanies.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No companies found 🌱
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
              {filteredCompanies.map((company) => (
                <tr key={company._id}>
                  <td>{company.companyName}</td>
                  <td>{company.companyEmail}</td>
                  <td>{company.companyPhone}</td>
                  <td>{company.companyVillage}</td>
                  <td>{company.companyStreet}</td>
                  <td>{company.companyPincode}</td>
                  <td>{company.companyBio || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewCompanies;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const WasteList = () => {
  const [wasteList, setWasteList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  const token = localStorage.getItem("CompanyToken");

  // Fetch waste list
  useEffect(() => {
    const fetchWasteList = async () => {
      try {
        const res = await axios.get("http://localhost:3000/company/wasteList", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWasteList(res.data.wasteList || []);
        setFilteredList(res.data.wasteList || []);
      } catch (err) {
        console.error("Error fetching waste list:", err);
        alert("Failed to load waste list.");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteList();
  }, [token]);

  // Accept waste
  const handleAccept = async (id) => {
    if (!window.confirm("Are you sure you want to accept this waste?")) return;
    setProcessing(id);
    try {
      const res = await axios.put(
        `http://localhost:3000/company/acceptWaste/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.message === "Waste allocated successfully") {
        alert("Waste accepted successfully!");
        setWasteList((prev) => prev.filter((w) => w._id !== id));
        setFilteredList((prev) => prev.filter((w) => w._id !== id));
      }
    } catch (err) {
      console.error("Error accepting waste:", err);
      alert("Failed to accept waste.");
    } finally {
      setProcessing(null);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = [...wasteList];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          w.wasteType.toLowerCase().includes(term) ||
          w.wasteDescription?.toLowerCase().includes(term) ||
          w.farmer?.farmerVillage?.toLowerCase().includes(term)
      );
    }

    // Apply filter by waste type
    if (filterType) {
      filtered = filtered.filter((w) => w.wasteType === filterType);
    }

    setFilteredList(filtered);
  }, [searchTerm, filterType, wasteList]);

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading available waste...
      </div>
    );

  return (
    <div
      className="container mt-5 p-4 shadow-lg"
      style={{
        backgroundColor: "#f4fff4",
        borderRadius: "16px",
        border: "1px solid #cce5cc",
      }}
    >
      <h3 className="text-center mb-4 fw-bold" style={{ color: "#2d6a4f" }}>
        ♻️ Available Waste List
      </h3>

      {/* Search and Filter Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by type, description, or village"
          style={{ width: "280px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select"
          style={{ width: "220px" }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Waste Types</option>
          <option value="Crop Waste">Crop Waste</option>
          <option value="Animal Waste">Animal Waste</option>
          <option value="Chemical Waste">Chemical Waste</option>
          <option value="Domestic and Miscellaneous Farm Waste">
            Domestic and Miscellaneous Farm Waste
          </option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredList.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No waste matches your filters 🌱
        </div>
      ) : (
        <div className="table-responsive">
          <table
            className="table table-hover align-middle"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#d8f3dc", color: "#1b4332" }}>
              <tr>
                <th>Type</th>
                <th>Quantity (kg)</th>
                <th>Description</th>
                <th>Village</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((waste) => (
                <tr key={waste._id}>
                  <td>{waste.wasteType}</td>
                  <td>{waste.wasteQuantity}</td>
                  <td>{waste.wasteDescription || "—"}</td>
                  <td>{waste.farmer?.farmerVillage || "—"}</td>
                  <td>
                    {waste.wasteImage ? (
                      <img
                        src={waste.wasteImage}
                        alt="Waste"
                        width="60"
                        height="60"
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #b7e4c7",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-success btn-sm fw-semibold"
                      disabled={processing === waste._id}
                      onClick={() => handleAccept(waste._id)}
                    >
                      {processing === waste._id
                        ? "Accepting..."
                        : "Accept Waste"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WasteList;

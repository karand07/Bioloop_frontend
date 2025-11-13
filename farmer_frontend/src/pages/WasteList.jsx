import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const WasteList = () => {
  const [wasteList, setWasteList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWasteList = async () => {
      try {
        const token = localStorage.getItem("FarmerToken");
        const res = await axios.get("http://localhost:3000/farmer/wasteList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setWasteList(res.data.wasteList || []);
      } catch (err) {
        console.error("Error fetching waste list:", err);
        alert("Failed to fetch waste list");
      } finally {
        setLoading(false);
      }
    };

    fetchWasteList();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading your waste data...
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
        ♻️ My Waste List
      </h3>

      {wasteList.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No waste entries yet. Start by creating one! 🌱
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
                <th>Status</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {wasteList.map((waste) => (
                <tr key={waste._id}>
                  <td>{waste.wasteType}</td>
                  <td>{waste.wasteQuantity}</td>
                  <td>{waste.wasteDescription || "—"}</td>
                  <td>
                    {waste.isAllocated ? (
                      waste.isAccepted ? (
                        <span className="badge bg-success">Accepted ✅</span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Allocated 📦
                        </span>
                      )
                    ) : (
                      <span className="badge bg-secondary">Pending ⏳</span>
                    )}
                  </td>
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

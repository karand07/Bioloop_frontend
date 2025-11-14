import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AllocatedWasteList = () => {
  const [allocatedWaste, setAllocatedWaste] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("CompanyToken");

  useEffect(() => {
    const fetchAllocatedWaste = async () => {
      try {
        const res = await axios.get("http://localhost:3000/company/allocatedWasteList", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.allocatedWasteList) {
          setAllocatedWaste(res.data.allocatedWasteList);
        } else {
          setAllocatedWaste([]);
        }
      } catch (err) {
        console.error("Error fetching allocated waste:", err);
        alert("Failed to load allocated waste list.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllocatedWaste();
  }, [token]);

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading your allocated wastes...
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
        🏭 My Allocated Wastes
      </h3>

      {allocatedWaste.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No waste has been allocated to your company yet 🌱
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
                <th>Farmer Village</th>
                <th>Image</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {allocatedWaste.map((waste) => (
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
                    <span className="badge bg-success">Allocated</span>
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

export default AllocatedWasteList;

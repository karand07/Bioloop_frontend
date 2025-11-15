import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateOrder = () => {
  const [wastes, setWastes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [price, setPrice] = useState("");
  const token = localStorage.getItem("AdminToken");

  // Fetch accepted wastes
  useEffect(() => {
    const fetchWastes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/acceptedWastes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWastes(res.data || []);
      } catch (err) {
        console.error("Error fetching accepted wastes:", err);
        alert("Failed to load accepted wastes.");
      } finally {
        setLoading(false);
      }
    };

    fetchWastes();
  }, [token]);

  // Create order for selected waste
  const handleCreateOrder = async (wasteId) => {
    if (!price || price <= 0) return alert("Please enter a valid price.");
    try {
      const res = await axios.post(
        `http://localhost:3000/admin/createOrder/${wasteId}`,
        { price },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order created successfully!");
      setWastes((prev) => prev.filter((w) => w._id !== wasteId));
      setSelectedWaste(null);
      setPrice("");
    } catch (err) {
      console.error("Error creating order:", err);
      alert("Failed to create order.");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading accepted wastes...
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
        ✅ Accepted Wastes - Create Orders
      </h3>

      {wastes.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No accepted wastes available 🌱
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
                <th>Farmer</th>
                <th>Company</th>
                <th>Village</th>
                <th>Description</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wastes.map((waste) => (
                <tr key={waste._id}>
                  <td>{waste.wasteType}</td>
                  <td>{waste.wasteQuantity}</td>
                  <td>{waste.farmer?.farmerName || "—"}</td>
                  <td>{waste.companyId?.companyName || "—"}</td>
                  <td>{waste.farmer?.farmerVillage || "—"}</td>
                  <td>{waste.wasteDescription || "—"}</td>
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
                    {selectedWaste === waste._id ? (
                      <div className="d-flex flex-column align-items-start gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder="Enter price"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          style={{ width: "120px" }}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleCreateOrder(waste._id)}
                          >
                            💾 Confirm
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setSelectedWaste(null)}
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => setSelectedWaste(waste._id)}
                      >
                        🧾 Create Order
                      </button>
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

export default CreateOrder;

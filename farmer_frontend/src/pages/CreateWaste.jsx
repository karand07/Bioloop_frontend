import React, { useState } from "react";
import axios from "axios";

const CreateWaste = () => {
  const [formData, setFormData] = useState({
    wasteType: "",
    wasteQuantity: "",
    wasteDescription: "",
    wasteImage: "",
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
      // Assuming JWT token stored in localStorage
      const token = localStorage.getItem("FarmerToken");

      const res = await axios.post(
        "http://localhost:3000/farmer/createWaste",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.message === "waste created successfully") {
        setMessage("Waste created successfully!");
        setFormData({
          wasteType: "",
          wasteQuantity: "",
          wasteDescription: "",
          wasteImage: "",
        });
      } else {
        setError(res.data.message || "Error creating waste");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#eaf5ea" }}
    >
      <div className="card shadow p-4" style={{ width: "500px", borderRadius: "12px" }}>
        <h3 className="text-center text-success fw-bold mb-3">
          Create Waste - Bioloop
        </h3>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Waste Type</label>
            <select
              className="form-select"
              name="wasteType"
              value={formData.wasteType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Crop Waste">Crop Waste</option>
              <option value="Animal Waste">Animal Waste</option>
              <option value="Chemical Waste">Chemical Waste</option>
              <option value="Domestic and Miscellaneous Farm Waste">
                Domestic and Miscellaneous Farm Waste
              </option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Quantity (kg)</label>
            <input
              type="number"
              className="form-control"
              name="wasteQuantity"
              value={formData.wasteQuantity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              name="wasteDescription"
              rows="3"
              value={formData.wasteDescription}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Waste Image (URL)</label>
            <input
              type="text"
              className="form-control"
              name="wasteImage"
              value={formData.wasteImage}
              onChange={handleChange}
              placeholder="https://example.com/waste.jpg"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 fw-semibold">
            Submit Waste
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWaste;

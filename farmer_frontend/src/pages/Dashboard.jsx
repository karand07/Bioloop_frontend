import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWastes: 0,
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("FarmerToken");
        const [wasteRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/farmer/wasteList", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/farmer/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const wastes = wasteRes.data.wasteList || [];
        const orders = ordersRes.data.orders || [];

        const completedOrders = orders.filter(
          (o) => o.orderStatus === "Completed"
        ).length;
        const pendingOrders = orders.filter(
          (o) => o.orderStatus === "Pending" || o.orderStatus === "In Progress"
        ).length;

        setStats({
          totalWastes: wastes.length,
          totalOrders: orders.length,
          completedOrders,
          pendingOrders,
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
        alert("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌱 Loading your dashboard...
      </div>
    );

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#f4fff4", minHeight: "90vh" }}
    >
      <h3 className="fw-bold text-success mb-4 text-center">
        👨‍🌾 Welcome to Your Dashboard
      </h3>

      <div className="row g-4 justify-content-center">
        {/* Total Wastes */}
        <div className="col-md-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#d8f3dc", borderRadius: "14px" }}
          >
            <div className="card-body text-center">
              <h5 className="text-success fw-bold">♻️ Total Wastes</h5>
              <h2 className="fw-bolder text-dark">{stats.totalWastes}</h2>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="col-md-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#b7e4c7", borderRadius: "14px" }}
          >
            <div className="card-body text-center">
              <h5 className="text-success fw-bold">📦 Total Orders</h5>
              <h2 className="fw-bolder text-dark">{stats.totalOrders}</h2>
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="col-md-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#95d5b2", borderRadius: "14px" }}
          >
            <div className="card-body text-center">
              <h5 className="text-success fw-bold">✅ Completed Orders</h5>
              <h2 className="fw-bolder text-dark">{stats.completedOrders}</h2>
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="col-md-3">
          <div
            className="card shadow-sm border-0"
            style={{ backgroundColor: "#ffd6a5", borderRadius: "14px" }}
          >
            <div className="card-body text-center">
              <h5 className="text-warning fw-bold">🕓 Pending Orders</h5>
              <h2 className="fw-bolder text-dark">{stats.pendingOrders}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-5 text-center">
        <a
          href="/createWaste"
          className="btn btn-success mx-2 fw-semibold"
        >
          ➕ Create Waste
        </a>
        <a
          href="/orders"
          className="btn btn-outline-success mx-2 fw-semibold"
        >
          📜 View Orders
        </a>
      </div>
    </div>
  );
};

export default Dashboard;

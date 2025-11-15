import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWastes: 0,
    acceptedWastes: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalCompanies: 0,
    totalFarmers: 0,
  });

  const token = localStorage.getItem("AdminToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wasteRes, orderRes, companyRes, farmerRes] = await Promise.all([
          axios.get("http://localhost:3000/admin/allWastes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/admin/allOrders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/admin/allCompanies", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/admin/allFarmers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const totalOrders = orderRes.data.length;
        const completedOrders = orderRes.data.filter(
          (o) => o.orderStatus === "Completed"
        ).length;
        const acceptedWastes = wasteRes.data.filter(
          (w) => w.isAccepted
        ).length;

        setStats({
          totalWastes: wasteRes.data.length,
          acceptedWastes,
          totalOrders,
          completedOrders,
          totalCompanies: companyRes.data.length,
          totalFarmers: farmerRes.data.length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div
      className="container mt-4 p-4"
      style={{ backgroundColor: "#f6fff8", borderRadius: "16px" }}
    >
      <h2 className="text-success fw-bold text-center mb-4">
        🌿 Bioloop Admin Dashboard
      </h2>

      {/* Stats Grid */}
      <div className="row g-4">
        <DashboardCard
          color="#74c69d"
          title="Total Wastes"
          value={stats.totalWastes}
          icon="♻️"
        />
        <DashboardCard
          color="#52b788"
          title="Accepted Wastes"
          value={stats.acceptedWastes}
          icon="✅"
        />
        <DashboardCard
          color="#40916c"
          title="Total Orders"
          value={stats.totalOrders}
          icon="📦"
        />
        <DashboardCard
          color="#2d6a4f"
          title="Completed Orders"
          value={stats.completedOrders}
          icon="🏁"
        />
        <DashboardCard
          color="#95d5b2"
          title="Registered Companies"
          value={stats.totalCompanies}
          icon="🏢"
        />
        <DashboardCard
          color="#b7e4c7"
          title="Registered Farmers"
          value={stats.totalFarmers}
          icon="👨‍🌾"
        />
      </div>

      {/* Quick Navigation */}
      <div className="mt-5 text-center">
        <h4 className="fw-bold text-success mb-3">Quick Actions</h4>
        <div className="d-flex flex-wrap justify-content-center gap-3">
          <a href="/createorders" className="btn btn-outline-success">
            create orders
          </a>
          <a href="/orders" className="btn btn-outline-success">
            View Orders
          </a>
          <a href="/companies" className="btn btn-outline-success">
            View Companies
          </a>
          <a href="/farmers" className="btn btn-outline-success">
            View Farmers
          </a>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, color, icon }) => (
  <div className="col-md-4 col-sm-6">
    <div
      className="card shadow-sm border-0 text-center p-3"
      style={{
        backgroundColor: color,
        color: "#fff",
        borderRadius: "16px",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <h3 className="display-6">{icon}</h3>
      <h5 className="fw-bold">{title}</h5>
      <h2 className="fw-bold">{value}</h2>
    </div>
  </div>
);

export default Dashboard;

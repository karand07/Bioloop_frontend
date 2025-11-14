import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalWastes: 0,
    allocatedWastes: 0,
    totalOrders: 0,
    completedOrders: 0,
  });
  const [company, setCompany] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("CompanyToken");

        // Parallel requests for speed
        const [profileRes, wasteRes, allocatedRes, ordersRes] = await Promise.all([
          axios.get("http://localhost:3000/company/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/company/wasteList", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/company/allocatedWasteList", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/company/orders", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const orders = ordersRes.data || [];
        const completedOrders = orders.filter(o => o.orderStatus === "Completed");

        setStats({
          totalWastes: wasteRes.data?.wasteList?.length || 0,
          allocatedWastes: allocatedRes.data?.allocatedWasteList?.length || 0,
          totalOrders: orders.length,
          completedOrders: completedOrders.length,
        });

        setCompany(profileRes.data || {});
      } catch (err) {
        console.error("Dashboard load error:", err);
        alert("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading your company dashboard...
      </div>
    );
  }

  return (
    <div className="container py-5" style={{ backgroundColor: "#f4fff4", minHeight: "100vh" }}>
      <h2 className="text-center text-success fw-bold mb-4">
        🏭 Welcome, {company.companyName || "Company"}
      </h2>
      <p className="text-center text-muted mb-5">
        Managing farm waste sustainably — powered by <strong>Bioloop</strong> 🌱
      </p>

      <div className="row g-4 justify-content-center">
        <DashboardCard title="Total Wastes" value={stats.totalWastes} color="success" icon="♻️" />
        <DashboardCard title="Allocated Wastes" value={stats.allocatedWastes} color="primary" icon="🚜" />
        <DashboardCard title="Orders Received" value={stats.totalOrders} color="warning" icon="📦" />
        <DashboardCard title="Completed Orders" value={stats.completedOrders} color="success" icon="✅" />
      </div>

      <div className="text-center mt-5">
        <p className="text-muted">
          Keep collaborating with farmers and track your order lifecycle efficiently. 🌾
        </p>
      </div>
    </div>
  );
};

// 🧱 Small reusable card component
const DashboardCard = ({ title, value, color, icon }) => (
  <div className="col-md-5 col-lg-3">
    <div className={`card text-center shadow border-0 p-4 border-${color}`}>
      <div className="fs-1 mb-2">{icon}</div>
      <h6 className="text-muted">{title}</h6>
      <h2 className={`fw-bold text-${color}`}>{value}</h2>
    </div>
  </div>
);

export default Dashboard;

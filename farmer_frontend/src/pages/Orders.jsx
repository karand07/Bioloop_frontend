import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("FarmerToken");
        const res = await axios.get("http://localhost:3000/farmer/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        alert("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const csvHeaders = [
    { label: "Waste Type", key: "wasteType" },
    { label: "Quantity (kg)", key: "quantity" },
    { label: "Company", key: "company" },
    { label: "Price (₹)", key: "price" },
    { label: "Order Status", key: "orderStatus" },
    { label: "Payment Status", key: "paymentStatus" },
    { label: "Created At", key: "createdAt" },
  ];

  const csvData = orders.map((order) => ({
    wasteType: order.wasteId?.wasteType || "-",
    quantity: order.wasteId?.wasteQuantity || "-",
    company: order.companyId?.companyName || "-",
    price: order.price || "-",
    orderStatus: order.orderStatus || "-",
    paymentStatus: order.paymentStatus || "-",
    createdAt: new Date(order.createdAt).toLocaleDateString("en-IN"),
  }));

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading your orders...
      </div>
    );

  return (
    <div
      className="container mt-4 p-4 shadow-lg"
      style={{
        backgroundColor: "#f4fff4",
        borderRadius: "16px",
        border: "1px solid #cce5cc",
        minHeight: "80vh",
      }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-success">📦 My Orders</h3>

        {orders.length > 0 && (
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={`bioloop_orders_${new Date()
              .toISOString()
              .slice(0, 10)}.csv`}
            className="btn btn-outline-success btn-sm fw-semibold"
          >
            ⬇️ Export CSV
          </CSVLink>
        )}
      </div>

      {orders.length === 0 ? (
        <div
          className="alert alert-light border-success text-center"
          style={{ fontSize: "1rem" }}
        >
          No orders found yet. 🌱  
          Once your waste is allocated and processed, it will appear here.
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
                <th>Waste Type</th>
                <th>Quantity (kg)</th>
                <th>Company</th>
                <th>Price (₹)</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.wasteId?.wasteType || "—"}</td>
                  <td>{order.wasteId?.wasteQuantity || "—"}</td>
                  <td>{order.companyId?.companyName || "—"}</td>
                  <td>{order.price ?? "—"}</td>
                  <td>
                    <span
                      className={`badge ${
                        order.orderStatus === "Completed"
                          ? "bg-success"
                          : order.orderStatus === "In Progress"
                          ? "bg-warning text-dark"
                          : order.orderStatus === "Cancelled"
                          ? "bg-danger"
                          : "bg-secondary"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    {order.paymentStatus === "Paid" ? (
                      <span className="badge bg-success">💰 Paid</span>
                    ) : (
                      <span className="badge bg-secondary">Unpaid</span>
                    )}
                  </td>
                  <td>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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

export default Orders;

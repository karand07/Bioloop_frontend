import React, { useEffect, useState } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import "bootstrap/dist/css/bootstrap.min.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editData, setEditData] = useState({
    price: "",
    orderStatus: "",
    paymentStatus: "",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const token = localStorage.getItem("AdminToken");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:3000/admin/allOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data || []);
        setFilteredOrders(res.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        alert("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Filter and search
  useEffect(() => {
    let data = [...orders];

    if (statusFilter) data = data.filter((o) => o.orderStatus === statusFilter);
    if (paymentFilter)
      data = data.filter((o) => o.paymentStatus === paymentFilter);
    if (search.trim() !== "") {
      const term = search.toLowerCase();
      data = data.filter(
        (o) =>
          o.companyId?.companyName?.toLowerCase().includes(term) ||
          o.farmerId?.farmerName?.toLowerCase().includes(term) ||
          o.wasteId?.wasteType?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortOption === "latest")
      data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    else if (sortOption === "oldest")
      data.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    else if (sortOption === "priceHigh") data.sort((a, b) => b.price - a.price);
    else if (sortOption === "priceLow") data.sort((a, b) => a.price - b.price);

    setFilteredOrders(data);
    setCurrentPage(1); // reset pagination when filters change
  }, [orders, search, statusFilter, paymentFilter, sortOption]);

  // Handle updating an order
  const handleUpdate = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/admin/updateOrder/${orderId}`,
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Order updated successfully!");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? res.data.updatedOrder : o))
      );
      setEditingOrder(null);
      setEditData({ price: "", orderStatus: "", paymentStatus: "" });
    } catch (err) {
      console.error("Error updating order:", err);
      alert("Failed to update order.");
    }
  };

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredOrders.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  if (loading)
    return (
      <div className="text-center mt-5 text-success fw-semibold">
        🌿 Loading orders...
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h3 className="fw-bold text-success m-0">📦 Manage Orders</h3>
        <CSVLink
          filename="bioloop_orders.csv"
          data={filteredOrders.map((o) => ({
            Waste_Type: o.wasteId?.wasteType || "",
            Quantity: o.wasteId?.wasteQuantity || "",
            Farmer: o.farmerId?.farmerName || "",
            Company: o.companyId?.companyName || "",
            Price: o.price,
            Order_Status: o.orderStatus,
            Payment_Status: o.paymentStatus,
            Created_At: new Date(o.createdAt).toLocaleString(),
          }))}
          className="btn btn-success btn-sm fw-semibold"
        >
          ⬇️ Download CSV
        </CSVLink>
      </div>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search by company, farmer, or waste type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: "300px", borderRadius: "10px" }}
        />

        <div className="d-flex flex-wrap gap-2">
          <select
            className="form-select"
            style={{ width: "150px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            className="form-select"
            style={{ width: "120px" }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>

          <select
            className="form-select"
            style={{ width: "160px" }}
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="latest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="priceLow">Price: Low → High</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="alert alert-light border-success text-center">
          No matching orders found 🌱
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead style={{ backgroundColor: "#d8f3dc", color: "#1b4332" }}>
                <tr>
                  <th>Waste Type</th>
                  <th>Quantity</th>
                  <th>Farmer</th>
                  <th>Company</th>
                  <th>Price (₹)</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((order) => (
                  <tr key={order._id}>
                    <td>{order.wasteId?.wasteType || "—"}</td>
                    <td>{order.wasteId?.wasteQuantity || "—"}</td>
                    <td>{order.farmerId?.farmerName || "—"}</td>
                    <td>{order.companyId?.companyName || "—"}</td>
                    <td>{order.price}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.orderStatus === "Completed"
                            ? "bg-success"
                            : order.orderStatus === "Cancelled"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          order.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      {editingOrder === order._id ? (
                        <div className="d-flex flex-column gap-2">
                          <input
                            type="number"
                            className="form-control form-control-sm"
                            value={editData.price}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: e.target.value,
                              })
                            }
                          />
                          <select
                            className="form-select form-select-sm"
                            value={editData.orderStatus}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                orderStatus: e.target.value,
                              })
                            }
                          >
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <select
                            className="form-select form-select-sm"
                            value={editData.paymentStatus}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                paymentStatus: e.target.value,
                              })
                            }
                          >
                            <option value="">Payment</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                          </select>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleUpdate(order._id)}
                            >
                              💾 Save
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => setEditingOrder(null)}
                            >
                              ❌ Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-success btn-sm"
                          onClick={() => {
                            setEditingOrder(order._id);
                            setEditData({
                              price: order.price,
                              orderStatus: order.orderStatus,
                              paymentStatus: order.paymentStatus,
                            });
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p className="text-success fw-semibold mb-0">
              Page {currentPage} of {totalPages}
            </p>
            <div>
              <button
                className="btn btn-outline-success btn-sm me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ⬅️ Prev
              </button>
              <button
                className="btn btn-outline-success btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next ➡️
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrders;

// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminOrders from "./pages/AdminOrders";
import Dashboard from "./pages/Dashboard";
import CreateOrder from "./pages/CreateOrders";
import ViewCompanies from "./pages/ViewCompanies";
import ViewFarmers from "./pages/ViewFarmers";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Farmer Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createorders" element={<CreateOrder/>} />
          <Route path="/orders" element={<AdminOrders/>} /> 
          <Route path="/companies" element={<ViewCompanies/>} />
          <Route path="/farmers" element={<ViewFarmers/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

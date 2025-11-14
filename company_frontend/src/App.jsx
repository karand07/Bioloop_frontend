// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WasteList from "./pages/WasteList";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import AllocatedWasteList from "./pages/AllocatedWasteList";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Farmer Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/AllocatedWasteList" element={<AllocatedWasteList/>} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wasteList" element={<WasteList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import MyComplaints from "./pages/MyComplaints.jsx";
import ComplaintDetails from "./pages/ComplaintDetails.jsx";
import AdminSetup from "./pages/AdminSetup.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ResolvedComplaints from "./pages/ResolvedComplaints.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complaints" element={<MyComplaints />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="/resolved" element={<ResolvedComplaints />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
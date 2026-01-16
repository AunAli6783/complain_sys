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
import Auth from "./pages/Auth.jsx";

function isUserAuthed() {
  return localStorage.getItem("userAuthed") === "1";
}
function isAdminAuthed() {
  return localStorage.getItem("adminAuthed") === "1";
}

function UserProtectedRoute({ children }) {
  if (!isUserAuthed()) return <Navigate to="/auth?role=user&mode=login" replace />;
  return children;
}

function AdminProtectedRoute({ children }) {
  if (!isAdminAuthed()) return <Navigate to="/auth?role=admin&mode=login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Login page - accessible to all */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* User routes - protected */}
          <Route
            path="/home"
            element={
              <UserProtectedRoute>
                <Home />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/complaints"
            element={
              <UserProtectedRoute>
                <MyComplaints />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/complaints/:id"
            element={
              <UserProtectedRoute>
                <ComplaintDetails />
              </UserProtectedRoute>
            }
          />
          <Route
            path="/resolved"
            element={
              <UserProtectedRoute>
                <ResolvedComplaints />
              </UserProtectedRoute>
            }
          />

          {/* Admin routes - protected */}
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />

          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
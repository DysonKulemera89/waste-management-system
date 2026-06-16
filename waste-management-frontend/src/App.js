import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Complaints from "./pages/Complaints";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";

import QRScanner from "./pages/QRScanner";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageUsers from "./pages/ManageUsers";
import ManageComplaints from "./pages/ManageComplaints";
import Schedule from "./pages/Schedule";
import Reports from "./pages/Reports";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  return role === "admin"
    ? children
    : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <ToastContainer />

      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/scanner" element={<QRScanner />} />
        <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/manage-complaints" element={<ManageComplaints />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/reports" element={<Reports />} />

        {/* USER */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Complaints />
            </PrivateRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          }
        />

        {/* TEMPORARY PAGES */}
        <Route
          path="/manage-users"
          element={<h2>Manage Users Page</h2>}
        />

        <Route
          path="/manage-complaints"
          element={<h2>Manage Complaints Page</h2>}
        />

        <Route
          path="/schedule"
          element={<h2>Schedule Management Page</h2>}
        />

        <Route
          path="/reports"
          element={<h2>Reports Page</h2>}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<h2>404 - Page Not Found</h2>}
        />

      </Routes>
    </Router>

    
  );
}

export default App;
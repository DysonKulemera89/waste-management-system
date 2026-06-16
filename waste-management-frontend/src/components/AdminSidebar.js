// src/components/AdminSidebar.js

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const username =
    localStorage.getItem("username") || "Admin";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: "📊",
    },
    {
      name: "Manage Users",
      path: "/manage-users",
      icon: "👥",
    },
    {
      name: "Manage Complaints",
      path: "/manage-complaints",
      icon: "📝",
    },
    {
      name: "Manage Schedule",
      path: "/schedule",
      icon: "🗓️",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📈",
    },
  ];

  return (
    <div style={sidebarStyle}>
      <div>
        <h2 style={titleStyle}>
          ♻️ Waste Admin
        </h2>

        <div style={userCard}>
          <p style={{ margin: 0 }}>
            Logged in as
          </p>

          <strong>{username}</strong>
        </div>

        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() =>
              navigate(item.path)
            }
            style={{
              ...buttonStyle,
              background:
                location.pathname === item.path
                  ? "#2563eb"
                  : "#1e293b",
            }}
          >
            <span>
              {item.icon} {item.name}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={logout}
        style={logoutButton}
      >
        🚪 Logout
      </button>
    </div>
  );
}

const sidebarStyle = {
  width: "260px",
  minHeight: "100vh",
  background: "#0f172a",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxSizing: "border-box",
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "20px",
};

const userCard = {
  background: "#1e293b",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
  textAlign: "center",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "15px",
};

const logoutButton = {
  width: "100%",
  padding: "12px",
  border: "none",
  borderRadius: "8px",
  background: "#dc2626",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AdminSidebar;
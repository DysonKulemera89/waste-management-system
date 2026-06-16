import React from "react";
import { useNavigate } from "react-router-dom";

function UserSidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={sidebar}>
      <h2>User Panel</h2>

      <button onClick={() => navigate("/dashboard")} style={btn}>Dashboard</button>
      <button onClick={() => navigate("/complaints")} style={btn}>Complaints</button>
      <button onClick={() => navigate("/payments")} style={btn}>Payments</button>
      <button onClick={() => navigate("/notifications")} style={btn}>Notifications</button>
      <button onClick={() => navigate("/schedule")} style={btn}>Schedule</button>

      <button onClick={logout} style={{ ...btn, background: "red" }}>
        Logout
      </button>
    </div>
  );
}

const sidebar = {
  width: "220px",
  background: "#1e293b",
  color: "white",
  padding: "20px",
  height: "100vh"
};

const btn = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  background: "#334155",
  color: "white",
  border: "none",
  cursor: "pointer"
};

export default UserSidebar;
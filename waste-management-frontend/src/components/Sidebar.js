import React from "react";
import { Link, useNavigate } from "react-router-dom";

// ICONS
import { FaTachometerAlt, FaMapMarkedAlt, FaBell, FaSignOutAlt } from "react-icons/fa";
import { MdReport, MdOutlineAnalytics } from "react-icons/md";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={sidebar}>
      <h2 style={title}>Waste System</h2>

      <nav style={{ marginTop: "30px" }}>
        
        <Link to="/dashboard" style={link}>
          <FaTachometerAlt style={icon} /> Dashboard
        </Link>

        <Link to="/complaint" style={link}>
          <MdReport style={icon} /> Report Waste
        </Link>

        <Link to="/predict" style={link}>
          <MdOutlineAnalytics style={icon} /> Predict
        </Link>

        <Link to="/map" style={link}>
          <FaMapMarkedAlt style={icon} /> Hotspots
        </Link>

        <Link to="/notifications" style={link}>
          <FaBell style={icon} /> Notifications
        </Link>

        <button onClick={logout} style={logoutBtn}>
          <FaSignOutAlt style={icon} /> Logout
        </button>

      </nav>
    </div>
  );
}

//  STYLES
const sidebar = {
  width: "230px",
  height: "100vh",
  background: "#0f172a",
  padding: "20px",
  position: "fixed",
};

const title = {
  color: "#38bdf8",
};

const link = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#fff",
  textDecoration: "none",
  marginBottom: "18px",
  fontSize: "16px",
};

const icon = {
  fontSize: "18px",
};

const logoutBtn = {
  marginTop: "20px",
  padding: "10px",
  width: "100%",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
  borderRadius: "5px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

export default Sidebar;
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Residents() {
  const navigate = useNavigate();
  const [residents, setResidents] = useState([]);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await API.get("residents/");
      setResidents(res.data);
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* SIDEBAR */}
      <div style={{
        width: "250px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2>Waste System</h2>

        <button onClick={() => navigate("/dashboard")} style={btnStyle}>Dashboard</button>
        <button onClick={() => navigate("/complaints")} style={btnStyle}>Complaints</button>
        <button onClick={() => navigate("/payments")} style={btnStyle}>Payments</button>
        <button onClick={() => navigate("/notifications")} style={btnStyle}>Notifications</button>
        <button onClick={() => navigate("/residents")} style={btnStyle}>Residents</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: "20px", background: "#f1f5f9" }}>
        <h2>Residents</h2>

        {residents.length === 0 ? (
          <p>No residents found</p>
        ) : (
          residents.map((r, index) => (
            <div key={index} style={cardStyle}>
              <p><strong>Name:</strong> {r.username}</p>
              <p><strong>Email:</strong> {r.email}</p>
              <p><strong>Phone:</strong> {r.phone || "N/A"}</p>
              <p><strong>Role:</strong> {r.role}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* STYLES */
const btnStyle = {
  display: "block",
  width: "100%",
  margin: "10px 0",
  padding: "10px",
  background: "#334155",
  color: "white",
  border: "none",
  cursor: "pointer"
};

const cardStyle = {
  background: "white",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
};

export default Residents;
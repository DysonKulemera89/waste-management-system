import React from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #dbeafe, #dcfce7)"
      }}
    >
      <div
        style={{
          background: "white",
          padding: "50px",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          textAlign: "center",
          width: "500px"
        }}
      >
        <div style={{ fontSize: "90px" }}>
          🗑️
        </div>

        <h1>WASTE MANAGEMENT SYSTEM</h1>

        <p>
          Improving communication between residents and waste authorities.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "30px"
          }}
        >
          <button
            onClick={() => navigate("/login")}
            style={{
              width: "45%",
              padding: "14px"
            }}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={{
              width: "45%",
              padding: "14px"
            }}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
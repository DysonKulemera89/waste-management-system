// src/pages/Dashboard.js

import React, { useEffect, useState } from "react";
import API from "../services/api";
import UserSidebar from "../components/UserSidebar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const [stats, setStats] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [payments, setPayments] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleString("en-US", {
    weekday: "long",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchDashboard();
    fetchPayments();
    fetchSchedule();

    fetchNotifications();
  }, [role]);
  
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }
}, [navigate]);

  // FETCH DASHBOARD STATS
  const fetchDashboard = async () => {
  try {
    const res = await API.get("dashboard/");
    setStats(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH PAYMENTS
  const fetchPayments = async () => {
    try {
      const res = await API.get("payments/");
      setPayments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // FETCH SCHEDULE
  const fetchSchedule = async () => {
    try {
      const res = await API.get("schedule/");
      setSchedule(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // STATUS COLORS
  const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
    case "paid":
      return "green";

    case "pending":
      return "orange";

    case "failed":
      return "red";

    default:
      return "gray";
  }
};

  // TODAY'S COLLECTION
  const todaySchedule = schedule.find(
    (s) => s.day?.toLowerCase() === today.toLowerCase()
  );
  
  if (loading) {
  return (
    <div style={{ padding: "30px" }}>
      <h2>Loading Dashboard...</h2>
    </div>
  );
}
  return (
    <div
      style={{
        display: "flex",
        background: darkMode ? "#0f172a" : "#f1f5f9",
        minHeight: "100vh",
        color: darkMode ? "white" : "black",
      }}
    >
      {/* SIDEBAR */}
      <UserSidebar />

      {/* MAIN CONTENT */}
      <div style={mainStyle}>
        
        {/* HEADER */}
        <div style={headerStyle}>
          <div>
             <h2>Dashboard Overview</h2>
             <p>Welcome, {username}</p>
        </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={darkButton}
          >
            {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
             onClick={() => {localStorage.clear();
             navigate("/login");
          }}
            style={{
               padding: "10px 15px",
               border: "none",
               borderRadius: "5px",
               background: "#dc2626",
               color: "white",
               cursor: "pointer",
               marginLeft: "10px",
           }}
           >
             Logout
            </button>
        </div>

        {/* TODAY ALERT */}
        {todaySchedule && (
          <div style={alertStyle}>
             Waste collection is scheduled TODAY in{" "}
            <strong>{todaySchedule.area}</strong>
          </div>
        )}

        {/* DASHBOARD CARDS */}
        <div style={rowStyle}>
          
          <Card
            title="Residents"
            value={stats.total_residents}
            onClick={() => navigate("/residents")}
            darkMode={darkMode}
          />

          <Card
            title="Complaints"
            value={stats.total_complaints}
            onClick={() => navigate("/complaints")}
            darkMode={darkMode}
          />

          <Card
            title="Payments"
            value={stats.total_payments}
            onClick={() => navigate("/payments")}
            darkMode={darkMode}
          />

          <Card
            title="Notifications"
            value={stats.total_notifications}
            onClick={() => navigate("/notifications")}
            darkMode={darkMode}
          />
        </div>

        {/* WEEKLY SCHEDULE */}
        <div
          style={{
            ...sectionStyle,
            background: darkMode ? "#1e293b" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <h3>Weekly Collection Schedule</h3>

          <div style={rowStyle}>
            {days.map((day) => {
              const item = schedule.find(
                (s) => s.day?.toLowerCase() === day.toLowerCase()
              );

              const isToday = day === today;

              return (
                <div
                  key={day}
                  style={{
                    ...dayCard,
                    border: isToday
                      ? "3px solid green"
                      : "1px solid #ddd",
                    background: isToday
                      ? "#dcfce7"
                      : darkMode
                      ? "#334155"
                      : "#fff",
                    color: darkMode ? "white" : "black",
                  }}
                >
                  <h4>
                    {day} {isToday && "⭐"}
                  </h4>

                  {item ? (
                    <>
                      <p>
                        <strong>Area:</strong> {item.area}
                      </p>

                      <p
                        style={{
                          color: getStatusColor(item.status),
                        }}
                      >
                        {item.status}
                      </p>

                      {isToday && (
                        <p
                          style={{
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          Collection is TODAY
                        </p>
                      )}
                    </>
                  ) : (
                    <p style={{ color: "gray" }}>
                      No schedule
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
  style={{
    ...sectionStyle,
    background: darkMode ? "#1e293b" : "white",
    color: darkMode ? "white" : "black",
  }}
>
  <h3>Quick Actions</h3>

  <div style={rowStyle}>
    <button onClick={() => navigate("/complaints")}>
      Submit Complaint
    </button>

    <button onClick={() => navigate("/payments")}>
      Make Payment
    </button>

    <button onClick={() => navigate("/notifications")}>
      View Notifications
    </button>
  </div>
</div>

        {/* NOTIFICATIONS */}
        <div
          style={{
            ...sectionStyle,
            background: darkMode ? "#1e293b" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <h3>Notifications</h3>

          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n, index) => (
              <div
                key={index}
                style={{
                  ...notificationStyle,
                  background: darkMode ? "#334155" : "#e0f2fe",
                  color: darkMode ? "white" : "black",
                }}
              >
                {n.message}
              </div>
            ))
          )}
        </div>

        {/* PAYMENTS */}
        <div
          style={{
            ...sectionStyle,
            background: darkMode ? "#1e293b" : "white",
            color: darkMode ? "white" : "black",
          }}
        >
          <h3>Recent Payments</h3>

          {payments.length === 0 ? (
            <p>No payments found</p>
          ) : (
            payments.map((p, index) => (
              <div
                key={index}
                style={{
                  ...paymentStyle,
                  background: darkMode ? "#334155" : "#f8fafc",
                  color: darkMode ? "white" : "black",
                }}
              >
                <p>
                  <strong>Amount:</strong> {p.amount}
                </p>

                <p>
                  <strong>Method:</strong>{" "}
                  {p.method === "airtel"
                    ? "Airtel Money"
                    : p.method === "tnm"
                    ? "TNM Mpamba"
                    : "Bank"}
                </p>

                <p>
                  <strong>Bank:</strong>{" "}
                  {p.bank_name || "N/A"}
                </p>

                <p>
                  <strong>Status:</strong>

                  <span
                    style={{
                      color: getStatusColor(p.status),
                      marginLeft: "5px",
                    }}
                  >
                    {p.status}
                  </span>
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* CARD COMPONENT */
const Card = ({ title, value, onClick, darkMode }) => (
  <div
    style={{
      ...cardStyle,
      background: darkMode ? "#1e293b" : "white",
      color: darkMode ? "white" : "black",
      cursor: "pointer",
      transition: "0.2s",
    }}
    onClick={onClick}
    onMouseOver={(e) =>
      (e.currentTarget.style.transform = "scale(1.05)")
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.transform = "scale(1)")
    }
  >
    <h4>{title}</h4>
    <h2>{value || 0}</h2>
  </div>
);

/* STYLES */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const darkButton = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  background: "#334155",
  color: "white",
};

const mainStyle = {
  flex: 1,
  padding: "20px",
  overflowY: "auto",
};

const sectionStyle = {
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const rowStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap",
};

const cardStyle = {
  padding: "20px",
  borderRadius: "10px",
  width: "200px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const notificationStyle = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
};

const paymentStyle = {
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
};

const dayCard = {
  padding: "15px",
  borderRadius: "10px",
  width: "150px",
};

const alertStyle = {
  background: "#22c55e",
  color: "white",
  padding: "15px",
  borderRadius: "10px",
  marginBottom: "20px",
};

export default Dashboard;
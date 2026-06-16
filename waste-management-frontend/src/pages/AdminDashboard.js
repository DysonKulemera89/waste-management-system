// src/pages/AdminDashboard.js

import React, { useEffect, useState } from "react";
import API from "../services/api";
import AdminSidebar from "../components/AdminSidebar";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    try {
      // DASHBOARD STATS
      const statsRes = await API.get("dashboard-stats/");
      setStats(statsRes.data);
    } catch (err) {
      console.log("Stats Error:", err);
    }

    try {
      const complaintsRes = await API.get("complaints/");
      setComplaints(complaintsRes.data.slice(0, 5));
    } catch (err) {
      console.log("Complaints Error:", err);
    }

    try {
      const paymentsRes = await API.get("payments/");
      setPayments(paymentsRes.data.slice(0, 5));
    } catch (err) {
      console.log("Payments Error:", err);
    }

    try {
      const notificationsRes = await API.get("notifications/");
      setNotifications(notificationsRes.data.slice(0, 5));
    } catch (err) {
      console.log("Notifications Error:", err);
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    const value = status?.toLowerCase();

    if (value === "resolved" || value === "paid")
      return "#16a34a";

    if (value === "pending")
      return "#f59e0b";

    return "#64748b";
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#f1f5f9",
      }}
    >
      <AdminSidebar />

      <div
        style={{
          flex: 1,
          padding: "25px",
        }}
      >
        <h1>Admin Dashboard</h1>

        <p>
          Welcome {localStorage.getItem("username")}
        </p>

        {/* STATS */}

        <div style={cardContainer}>
          <StatCard
            title="Complaints"
            value={stats.total_complaints || 0}
          />

          <StatCard
            title="Payments"
            value={stats.total_payments || 0}
          />

          <StatCard
            title="Notifications"
            value={stats.total_notifications || 0}
          />

          <StatCard
            title="Bins"
            value={stats.total_bins || 0}
          />
        </div>

        {loading ? (
          <h3>Loading Dashboard...</h3>
        ) : (
          <>
            {/* COMPLAINTS */}

            <section style={sectionStyle}>
              <h2>Recent Complaints</h2>

              {complaints.length === 0 ? (
                <p>No complaints found</p>
              ) : (
                complaints.map((c) => (
                  <div
                    key={c.id}
                    style={itemStyle}
                  >
                    <div>
                      <strong>{c.description}</strong>
                    </div>

                    <span
                      style={{
                        color: getStatusColor(c.status),
                        fontWeight: "bold",
                      }}
                    >
                      {c.status}
                    </span>
                  </div>
                ))
              )}
            </section>

            {/* PAYMENTS */}

            <section style={sectionStyle}>
              <h2>Recent Payments</h2>

              {payments.length === 0 ? (
                <p>No payments found</p>
              ) : (
                payments.map((p) => (
                  <div
                    key={p.id}
                    style={itemStyle}
                  >
                    <div>
                      MWK {p.amount}
                    </div>

                    <span
                      style={{
                        color: getStatusColor(p.status),
                        fontWeight: "bold",
                      }}
                    >
                      {p.status}
                    </span>
                  </div>
                ))
              )}
            </section>

            {/* NOTIFICATIONS */}

            <section style={sectionStyle}>
              <h2>Recent Notifications</h2>

              {notifications.length === 0 ? (
                <p>No notifications found</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    style={itemStyle}
                  >
                    {n.message}
                  </div>
                ))
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const sectionStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

export default AdminDashboard;
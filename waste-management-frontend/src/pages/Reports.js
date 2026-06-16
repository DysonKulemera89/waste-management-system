// src/pages/Reports.js

import React, { useEffect, useState } from "react";
import API from "../services/api";

function Reports() {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const res = await API.get("reports/");

      setReport(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return Number(amount || 0).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading Reports...</h2>
      </div>
    );
  }

  return (
    <div style={container}>
      <h1>System Reports</h1>

      <div style={grid}>
        <div style={card}>
          <h3>Total Complaints</h3>
          <h1>{report.total_complaints || 0}</h1>
        </div>

        <div style={card}>
          <h3>Total Payments</h3>
          <h1>{report.total_payments || 0}</h1>
        </div>

        <div style={card}>
          <h3>Total Notifications</h3>
          <h1>{report.total_notifications || 0}</h1>
        </div>

        <div style={revenueCard}>
          <h3>Total Revenue</h3>
          <h1>
            MWK {formatMoney(report.total_revenue)}
          </h1>
        </div>
      </div>

      <button
        onClick={fetchReport}
        style={button}
      >
        Refresh Report
      </button>
    </div>
  );
}

const container = {
  padding: "25px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const revenueCard = {
  background: "#16a34a",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const button = {
  marginTop: "20px",
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
};

export default Reports;
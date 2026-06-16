// src/pages/ManageComplaints.js

import React, { useEffect, useState } from "react";
import API from "../services/api";

function ManageComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const res = await API.get("complaints/");
      setComplaints(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await API.put(`complaints/${id}/resolve/`);

      alert("Complaint resolved successfully");

      fetchComplaints();

    } catch (err) {
      console.log(err);
      alert("Failed to resolve complaint");
    }
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "resolved")
      return "#16a34a";

    if (status?.toLowerCase() === "pending")
      return "#f59e0b";

    return "#64748b";
  };

  return (
    <div style={container}>
      <h1>Manage Complaints</h1>

      <button
        onClick={fetchComplaints}
        style={refreshButton}
      >
        Refresh
      </button>

      {loading ? (
        <h3>Loading complaints...</h3>
      ) : complaints.length === 0 ? (
        <div style={emptyCard}>
          No complaints found
        </div>
      ) : (
        complaints.map((c) => (
          <div key={c.id} style={card}>
            <h3>{c.description}</h3>

            <p>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color: getStatusColor(c.status),
                  fontWeight: "bold",
                }}
              >
                {c.status}
              </span>
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(
                c.created_at
              ).toLocaleString()}
            </p>

            {c.status !== "resolved" && (
              <button
                onClick={() =>
                  resolveComplaint(c.id)
                }
                style={resolveButton}
              >
                Mark Resolved
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const container = {
  padding: "25px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "15px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const refreshButton = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#2563eb",
  color: "white",
  cursor: "pointer",
  marginBottom: "20px",
};

const resolveButton = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "8px",
  background: "#16a34a",
  color: "white",
  cursor: "pointer",
  marginTop: "10px",
};

const emptyCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

export default ManageComplaints;
// src/pages/ComplaintsList.js

import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function ComplaintsList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const response = await API.get("complaints/");

      setComplaints(response.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const value = status?.toLowerCase();

    if (value === "pending") {
      return {
        background: "#fef3c7",
        color: "#d97706",
      };
    }

    if (value === "resolved") {
      return {
        background: "#dcfce7",
        color: "#16a34a",
      };
    }

    if (value === "in progress") {
      return {
        background: "#dbeafe",
        color: "#2563eb",
      };
    }

    return {
      background: "#e2e8f0",
      color: "#475569",
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Complaint History</h1>

        <button
          style={styles.refreshButton}
          onClick={fetchComplaints}
        >
          Refresh
        </button>
      </div>

      <div style={styles.summaryCard}>
        <h3>Total Complaints</h3>
        <h1>{complaints.length}</h1>
      </div>

      {loading ? (
        <div style={styles.loading}>
          Loading complaints...
        </div>
      ) : complaints.length === 0 ? (
        <div style={styles.emptyCard}>
          No complaints submitted yet.
        </div>
      ) : (
        complaints.map((complaint) => (
          <div
            key={complaint.id}
            style={styles.card}
          >
            <h3>
              Complaint #{complaint.id}
            </h3>

            <p>
              <strong>Description:</strong>
            </p>

            <p>{complaint.description}</p>

            <p>
              <strong>Location:</strong>{" "}
              {complaint.location || "N/A"}
            </p>

            <div style={styles.footer}>
              <span
                style={{
                  ...styles.badge,
                  ...getStatusStyle(
                    complaint.status
                  ),
                }}
              >
                {complaint.status}
              </span>

              <small>
                {complaint.created_at
                  ? new Date(
                      complaint.created_at
                    ).toLocaleString()
                  : "No date"}
              </small>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    background: "#f1f5f9",
    minHeight: "100vh",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  refreshButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  summaryCard: {
    background: "#2563eb",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },

  badge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  emptyCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    padding: "30px",
  },
};

export default ComplaintsList;
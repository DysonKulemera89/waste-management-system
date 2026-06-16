// src/pages/Complaints.js

import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Complaints() {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

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
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !location) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await API.post("complaints/create/", {
        description,
        location,
      });

      toast.success(
        "Complaint submitted successfully"
      );

      setDescription("");
      setLocation("");

      fetchComplaints();

    } catch (err) {
      console.log(err);

      toast.error(
        "Failed to submit complaint"
      );
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
      <h1 style={styles.title}>
        Complaints Management
      </h1>

      {/* SUMMARY CARD */}

      <div style={styles.summaryCard}>
        <h3>Total Complaints</h3>
        <h1>{complaints.length}</h1>
      </div>

      {/* COMPLAINT FORM */}

      <div style={styles.formCard}>
        <h3>Submit New Complaint</h3>

        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your complaint..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            style={styles.textarea}
            required
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
          >
            Submit Complaint
          </button>
        </form>
      </div>

      {/* COMPLAINT LIST */}

      <div style={styles.listHeader}>
        <h3>My Complaints</h3>

        <button
          onClick={fetchComplaints}
          style={styles.refreshButton}
        >
          Refresh
        </button>
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
            <p>
              <strong>Description:</strong>
            </p>

            <p>{complaint.description}</p>

            <p>
              <strong>Location:</strong>{" "}
              {complaint.location || "N/A"}
            </p>

            <div style={styles.row}>
              <span
                style={{
                  ...styles.statusBadge,
                  ...getStatusStyle(
                    complaint.status
                  ),
                }}
              >
                {complaint.status}
              </span>

              <small>
                {new Date(
                  complaint.created_at
                ).toLocaleString()}
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
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
  },

  title: {
    marginBottom: "20px",
  },

  summaryCard: {
    background: "#2563eb",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center",
  },

  formCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "25px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  refreshButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },

  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  emptyCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
  },

  loading: {
    textAlign: "center",
    padding: "30px",
  },
};

export default Complaints;
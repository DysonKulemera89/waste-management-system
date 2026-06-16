import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("notifications/");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`notifications/${id}/read/`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, is_read: true }
            : n
        )
      );

      toast.success("Notification marked as read");
    } catch (err) {
      console.log(err);
      toast.error("Failed to update notification");
    }
  };

  const getColor = (message) => {
    if (message?.includes("🚨")) return "#ef4444";
    if (message?.includes("⚠️")) return "#f59e0b";
    if (message?.includes("Payment")) return "#22c55e";
    return "#3b82f6";
  };

  const unreadCount = notifications.filter(
    (n) => !n.is_read
  ).length;

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading Notifications...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <div style={headerStyle}>
        <h2>Notifications</h2>

        <span style={badgeStyle}>
          {unreadCount} Unread
        </span>
      </div>

      <button
        onClick={fetchNotifications}
        style={refreshButton}
      >
        Refresh
      </button>

      {notifications.length === 0 ? (
        <div style={emptyStyle}>
          <p>No notifications yet</p>
        </div>
      ) : (
        notifications.map((note) => (
          <div
            key={note.id}
            style={{
              ...cardStyle,
              borderLeft: `6px solid ${getColor(
                note.message
              )}`,
              opacity: note.is_read ? 0.7 : 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <h4>
                {note.is_read
                  ? "Read"
                  : "New Notification"}
              </h4>

              {!note.is_read && (
                <button
                  onClick={() =>
                    markAsRead(note.id)
                  }
                  style={readButton}
                >
                  Mark Read
                </button>
              )}
            </div>

            <p>{note.message}</p>

            <small
              style={{
                color: "#64748b",
              }}
            >
              {new Date(
                note.created_at
              ).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}

/* STYLES */

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const badgeStyle = {
  background: "#dc2626",
  color: "white",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "14px",
};

const refreshButton = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginBottom: "20px",
};

const cardStyle = {
  background: "white",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  boxShadow:
    "0 4px 10px rgba(0,0,0,0.1)",
};

const readButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const emptyStyle = {
  background: "white",
  padding: "40px",
  textAlign: "center",
  borderRadius: "10px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)",
};

export default Notifications;
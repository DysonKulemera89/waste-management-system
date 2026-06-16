// src/pages/Schedule.js

import React, { useEffect, useState } from "react";
import API from "../services/api";

function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    area: "",
    day: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await API.get("schedule/");
      setSchedules(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const createSchedule = async (e) => {
    e.preventDefault();

    try {
      await API.post("schedule/create/", formData);

      alert("Schedule created successfully");

      setFormData({
        area: "",
        day: "",
        status: "Pending",
      });

      fetchSchedules();

    } catch (err) {
      console.log(err);
      alert("Failed to create schedule");
    }
  };

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === "completed")
      return "#16a34a";

    if (status?.toLowerCase() === "pending")
      return "#f59e0b";

    return "#64748b";
  };

  return (
    <div style={container}>
      <h1>Collection Schedule</h1>

      {/* CREATE FORM */}

      <div style={formCard}>
        <h3>Create Schedule</h3>

        <form onSubmit={createSchedule}>
          <input
            type="text"
            name="area"
            placeholder="Area"
            value={formData.area}
            onChange={handleChange}
            required
            style={input}
          />

          <select
            name="day"
            value={formData.day}
            onChange={handleChange}
            required
            style={input}
          >
            <option value="">Select Day</option>
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={input}
          >
            <option>Pending</option>
            <option>Completed</option>
          </select>

          <button type="submit" style={button}>
            Create Schedule
          </button>
        </form>
      </div>

      {/* LIST */}

      <div style={{ marginTop: "30px" }}>
        <h2>Existing Schedules</h2>

        {schedules.length === 0 ? (
          <div style={emptyCard}>
            No schedules found
          </div>
        ) : (
          schedules.map((s) => (
            <div
              key={s.id}
              style={card}
            >
              <h3>{s.area}</h3>

              <p>
                <strong>Day:</strong> {s.day}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: getStatusColor(
                      s.status
                    ),
                    fontWeight: "bold",
                  }}
                >
                  {s.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const container = {
  padding: "25px",
  background: "#f1f5f9",
  minHeight: "100vh",
};

const formCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "15px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const emptyCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const input = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const button = {
  padding: "10px 15px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default Schedule;
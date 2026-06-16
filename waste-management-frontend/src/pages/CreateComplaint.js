// src/pages/CreateComplaint.js

import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function CreateComplaint() {
  const [formData, setFormData] = useState({
    description: "",
    location: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description || !formData.location) {
      toast.error("Please fill all fields");
      return;
    }

    const complaintData = new FormData();

    complaintData.append(
      "description",
      formData.description
    );

    complaintData.append(
      "location",
      formData.location
    );

    if (image) {
      complaintData.append("image", image);
    }

    try {
      setLoading(true);

      await API.post(
        "complaints/create/",
        complaintData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Complaint submitted successfully"
      );

      setFormData({
        description: "",
        location: "",
      });

      setImage(null);

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Create Complaint</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            name="description"
            placeholder="Describe the issue..."
            value={formData.description}
            onChange={handleChange}
            rows="5"
            style={inputStyle}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            style={inputStyle}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0])
            }
            style={{
              marginBottom: "15px",
            }}
          />

          {image && (
            <div
              style={{
                marginBottom: "15px",
              }}
            >
              <p>Selected Image:</p>

              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                width="200"
                style={{
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading
              ? "Submitting..."
              : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

export default CreateComplaint;
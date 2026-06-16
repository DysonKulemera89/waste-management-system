import React, { useState } from "react";
import API from "../services/api";

function PredictWaste() {
  const [formData, setFormData] = useState({
    complaints: "",
    days_since_collection: "",
    population_density: "",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("predict-waste/", {
        complaints: Number(formData.complaints),
        days_since_collection: Number(formData.days_since_collection),
        population_density: Number(formData.population_density),
      });

      setResult(response.data.predicted_waste_level);
    } catch (error) {
      console.error(error);
      alert("Prediction failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>AI Waste Prediction</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="complaints"
          placeholder="Number of complaints"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="days_since_collection"
          placeholder="Days since last collection"
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="population_density"
          placeholder="Population density"
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Predict</button>
      </form>

      {result !== null && (
        <h3>Predicted Waste Level: {result}</h3>
      )}
    </div>
  );
}

export default PredictWaste;
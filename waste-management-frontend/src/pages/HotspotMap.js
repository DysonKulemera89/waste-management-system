import React, { useEffect, useState } from "react";
import API from "../services/api";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatPoints = points.map(p => [p.lat, p.lng, 0.5]);

    const heat = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
}

function HotspotMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetchHotspots();

    // AUTO REFRESH
    const interval = setInterval(fetchHotspots, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchHotspots = async () => {
    try {
      const res = await API.get("hotspots/");
      setHotspots(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <h2 style={{ padding: "10px" }}>🔥 Waste Heatmap</h2>

      <MapContainer center={[-15.78, 35.00]} zoom={13} style={{ height: "90%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <HeatmapLayer points={hotspots} />
      </MapContainer>
    </div>
  );
}

export default HotspotMap;
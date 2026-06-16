import React, { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    amount: "",
    payment_method: "airtel",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get("payments/");
      setPayments(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load payments");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!formData.amount) {
      toast.error("Enter payment amount");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "simulate-payment/",
        formData
      );

      toast.success("Payment submitted successfully");

      console.log(res.data);

      setFormData({
        amount: "",
        payment_method: "airtel",
      });

      fetchPayments();

    } catch (err) {
      console.log(err);
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return "#16a34a";

      case "pending":
        return "#f59e0b";

      case "failed":
        return "#dc2626";

      default:
        return "#64748b";
    }
  };

  const getMethodName = (method) => {
    if (method === "airtel") return "Airtel Money";
    if (method === "tnm") return "TNM Mpamba";
    return "Bank";
  };

  return (
    <div
      style={{
        padding: "20px",
        background: "#f1f5f9",
        minHeight: "100vh",
      }}
    >
      <h2>Payments</h2>

      {/* PAYMENT FORM */}

      <div style={formContainer}>
        <h3>Make Payment</h3>

        <form onSubmit={handlePayment}>
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            value={formData.amount}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="airtel">
              Airtel Money
            </option>

            <option value="tnm">
              TNM Mpamba
            </option>

            <option value="bank">
              Bank Transfer
            </option>
          </select>

          <button
            type="submit"
            style={buttonStyle}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : "Pay Now"}
          </button>
        </form>
      </div>

      {/* PAYMENT HISTORY */}

      <h3 style={{ marginTop: "30px" }}>
        Payment History
      </h3>

      {payments.length === 0 ? (
        <div style={emptyStyle}>
          <p>No payments found</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {payments.map((p, index) => (
            <div key={index} style={cardStyle}>
              <h3>
                MWK {p.amount}
              </h3>

              <p>
                <strong>Method:</strong>{" "}
                {getMethodName(
                  p.payment_method || p.method
                )}
              </p>

              <p>
                <strong>Status:</strong>

                <span
                  style={{
                    color: "white",
                    background:
                      getStatusColor(p.status),
                    padding: "3px 8px",
                    borderRadius: "5px",
                    marginLeft: "5px",
                  }}
                >
                  {p.status}
                </span>
              </p>

              {p.transaction_id && (
                <p>
                  <strong>Transaction ID:</strong>
                  <br />
                  {p.transaction_id}
                </p>
              )}

              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                {new Date(
                  p.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */

const formContainer = {
  background: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)",
};

const emptyStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "10px",
  textAlign: "center",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.1)",
};

export default Payments;
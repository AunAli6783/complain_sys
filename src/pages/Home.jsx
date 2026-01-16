import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addComplaint } from "../lib/storage.js";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = Number(localStorage.getItem("userId"));
    const userUsername = localStorage.getItem("userUsername");

    console.log("=== SUBMITTING COMPLAINT ===");
    console.log("localStorage.getItem('userId'):", localStorage.getItem("userId"));
    console.log("localStorage.getItem('userUsername'):", localStorage.getItem("userUsername"));
    console.log("Parsed userId:", userId);
    console.log("userUsername:", userUsername);
    console.log("All localStorage keys:", Object.keys(localStorage));

    const complaintData = {
      title,
      description,
      category,
      userId: userId,
      userUsername: userUsername
    };

    console.log("Sending complaint data:", complaintData);

    try {
      const response = await fetch('http://localhost:3000/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaintData)
      });

      const result = await response.json();
      console.log("Server response:", result);

      setTitle("");
      setDescription("");
      setCategory("general");
      alert("Complaint submitted successfully!");
      navigate("/complaints");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userAuthed");
    localStorage.removeItem("userId");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authId");
    navigate("/auth");
  };

  return (
    <section className="home">
      <div className="page-head">
        <div>
          <h1 className="page-title">Submit a Complaint</h1>
          <p className="subtitle">Describe your issue and we'll help resolve it</p>
        </div>
        <div className="item-actions">
          <Link to="/complaints" className="btn">
            My Complaints
          </Link>
          <Link to="/resolved" className="btn">
            Resolved
          </Link>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter complaint title"
            required
          />
        </div>
        <div className="field">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="general">General</option>
            <option value="technical">Technical</option>
            <option value="billing">Billing</option>
            <option value="service">Service</option>
            <option value="delivery">Delivery</option>
            <option value="product_quality">Product Quality</option>
            <option value="customer_support">Customer Support</option>
            <option value="refund_return">Refund / Return</option>
            <option value="account_access">Account / Access</option>
            <option value="privacy_security">Privacy / Security</option>
            <option value="harassment_misconduct">Harassment / Misconduct</option>
            <option value="facility_maintenance">Facility / Maintenance</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter complaint description"
            rows="6"
            required
          />
        </div>
        <button type="submit" className="btn primary">
          Submit Complaint
        </button>
      </form>
    </section>
  );
}
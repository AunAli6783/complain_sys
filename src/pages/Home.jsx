import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addComplaint } from "../lib/storage.js";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComplaint({ title, description, category });
      setTitle("");
      setDescription("");
      setCategory("general");
      alert("Complaint submitted successfully!");
      navigate("/complaints");
    } catch (error) {
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <section className="home">
      <div className="home-header">
        <h1 className="home-title">Welcome to the Complaint Management System</h1>
        <p className="home-subtitle">
          Submit and track your complaints easily. Admins can manage complaints efficiently.
        </p>
      </div>

      <div className="home-actions">
        <Link to="/complaints" className="btn primary">
          View My Complaints
        </Link>
        <Link to="/admin/login" className="btn">
          Admin Login
        </Link>
      </div>

      <form className="form" onSubmit={onSubmit}>
        <h2 className="form-title">Submit a Complaint</h2>
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
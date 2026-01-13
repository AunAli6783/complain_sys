import React, { useState } from "react";
import { Link } from "react-router-dom";
import { addComplaint } from "../lib/storage";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    addComplaint({ title, description });
    setTitle("");
    setDescription("");
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
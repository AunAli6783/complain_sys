
import { useEffect, useState } from "react";
import { loadComplaints, saveComplaints } from "../utils/storage.js";

const CATEGORIES = ["Electricity", "Water", "Internet"];

export default function Home() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    setComplaints(loadComplaints());
  }, []);

  function onSubmit(e) {
    e.preventDefault();

    const newComplaint = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      title: title.trim(),
      description: description.trim(),
      category,
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    if (!newComplaint.title || !newComplaint.description) return;

    const next = [newComplaint, ...complaints];
    setComplaints(next);
    saveComplaints(next);

    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);

    alert("Complaint Submitted");
  }

  return (
    <section>
      <h1 className="page-title">Submit Complaint</h1>
      <p className="page-subtitle">Fill the form below to submit a complaint.</p>

      <form className="card form" onSubmit={onSubmit}>
        <label className="field">
          <span className="label">Complaint Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Power outage in my area"
          />
        </label>

        <label className="field">
          <span className="label">Description</span>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
          />
        </label>

        <label className="field">
          <span className="label">Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button className="btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  );
}
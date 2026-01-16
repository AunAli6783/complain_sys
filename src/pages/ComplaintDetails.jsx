import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { loadComplaints } from "../lib/storage.js";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints()
      .then((allComplaints) => {
        const found = allComplaints.find((c) => c.id === Number(id));
        setComplaint(found);
      })
      .catch((error) => {
        console.error("Failed to load complaint:", error);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("userAuthed");
    localStorage.removeItem("userId");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authId");
    navigate("/auth");
  };

  if (loading) return <div className="card">Loading...</div>;
  if (!complaint) return <div className="card">Complaint not found.</div>;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Complaint Details</h1>
          <p className="subtitle">#{complaint.id}</p>
        </div>
        <div className="item-actions">
          <Link to="/home" className="btn">
            Submit Complaint
          </Link>
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

      <div className="card">
        <h2>{complaint.title}</h2>
        <div style={{ marginTop: 12 }}>
          <span className="pill">{complaint.category}</span>
          <span
            className={`badge ${
              String(complaint.status ?? "Pending")
                .toLowerCase()
                .includes("resolve")
                ? "badge--success"
                : "badge--neutral"
            }`}
            style={{ marginLeft: 8 }}
          >
            {complaint.status ?? "Pending"}
          </span>
        </div>
        <p style={{ marginTop: 16 }}>{complaint.description}</p>
        {complaint.resolutionNote && (
          <div className="resolved-note" style={{ marginTop: 16 }}>
            <div className="resolved-note__label">Resolution</div>
            <div className="resolved-note__body">{complaint.resolutionNote}</div>
          </div>
        )}
      </div>
    </section>
  );
}
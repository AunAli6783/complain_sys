import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { loadComplaints } from "../lib/storage.js";

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints()
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, []);

  const complaint = useMemo(
    () => complaints.find((c) => String(c.id) === String(id)),
    [complaints, id]
  );

  if (loading) return <div className="card">Loading...</div>;

  if (!complaint) {
    return (
      <section>
        <h1 className="page-title">Complaint Details</h1>
        <div className="card empty">
          Complaint not found. <Link to="/complaints">Go back</Link>.
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="details-header">
        <h1 className="page-title">Complaint Details</h1>
        <Link to="/complaints" className="link">
          ← Back
        </Link>
      </div>

      <div className="card details">
        <div className="row">
          <div className="k">Title</div>
          <div className="v">{complaint.title}</div>
        </div>

        <div className="row">
          <div className="k">Description</div>
          <div className="v prewrap">{complaint.description}</div>
        </div>

        <div className="row">
          <div className="k">Category</div>
          <div className="v">{complaint.category}</div>
        </div>

        <div className="row">
          <div className="k">Status</div>
          <div className="v">
            <span className="badge">{complaint.status ?? "Pending"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
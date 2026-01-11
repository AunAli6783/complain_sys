import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadComplaints } from "../utils/storage.js";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    setComplaints(loadComplaints());
  }, []);

  const total = complaints.length;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Complaints submitted</h1>
          <p className="subtitle">{total} total</p>
        </div>

        <div className="item-actions">
          <Link to="/" className="btn">
            Home
          </Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="card empty">
          No complaints found.{" "}
          <Link to="/" className="link">
            Submit one on Home
          </Link>
          .
        </div>
      ) : (
        <div className="list">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="item">
              <div className="item-grid">
                <div className="item-main">
                  <div className="item-top">
                    <h2 className="item-title">{complaint.title}</h2>
                    <span
                      className={`badge ${String(complaint.status ?? "Pending")
                        .toLowerCase()
                        .includes("resolve")
                        ? "badge--ok"
                        : String(complaint.status ?? "Pending")
                            .toLowerCase()
                            .includes("progress")
                        ? "badge--warn"
                        : "badge--neutral"}`}
                    >
                      {complaint.status ?? "Pending"}
                    </span>
                  </div>

                  <div className="item-meta">
                    <span className="pill">{complaint.category}</span>
                  </div>

                  {complaint.description ? (
                    <p className="item-desc">{complaint.description}</p>
                  ) : null}
                </div>

                <div className="item-right">
                  <Link to={`/complaints/${complaint.id}`} className="btn primary">
                    View details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadComplaints } from "../utils/storage.js";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    setComplaints(loadComplaints());
  }, []);

  const total = complaints.length;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="subtitle">All complaints you have submitted ({total}).</p>
        </div>

        <div className="item-actions">
          <Link to="/" className="btn">
            Submit new
          </Link>
        </div>
      </div>

      {total === 0 ? (
        <div className="card empty">
          No complaints yet.{" "}
          <Link to="/" className="link">
            Submit your first complaint
          </Link>
          .
        </div>
      ) : (
        <div className="list">
          {complaints.map((c) => (
            <div key={c.id} className="item">
              <div className="item-grid">
                <div className="item-main">
                  <div className="item-top">
                    <h2 className="item-title">{c.title}</h2>
                    <span
                      className={`badge ${String(c.status ?? "Pending")
                        .toLowerCase()
                        .includes("resolve")
                        ? "badge--ok"
                        : String(c.status ?? "Pending")
                            .toLowerCase()
                            .includes("progress")
                        ? "badge--warn"
                        : "badge--neutral"}`}
                    >
                      {c.status ?? "Pending"}
                    </span>
                  </div>

                  <div className="item-meta">
                    <span className="pill">Category: {c.category}</span>
                  </div>

                  {c.description ? <p className="item-desc">{c.description}</p> : null}
                </div>

                <div className="item-right">
                  <Link to={`/complaints/${c.id}`} className="btn primary">
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
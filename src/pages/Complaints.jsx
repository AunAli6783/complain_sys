import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadComplaints } from "../lib/storage";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComplaints()
      .then(setComplaints)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <section style={{ padding: 24 }}>
      <h1 className="page-title">My Complaints</h1>
      
      {complaints.length === 0 ? (
        <div className="card empty">
          No complaints yet. <Link to="/">Submit one</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {complaints.map((c) => (
            <div key={c.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ margin: 0, marginBottom: 8 }}>{c.title}</h3>
                  <p style={{ margin: 0, marginBottom: 12, color: '#666' }}>{c.description}</p>
                  <div style={{ fontSize: 14, color: '#999' }}>
                    <span className="badge">{c.status || 'Pending'}</span>
                    <span style={{ marginLeft: 12 }}>
                      Category: {c.category}
                    </span>
                    <span style={{ marginLeft: 12 }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Link to={`/complaints/${c.id}`} className="btn">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
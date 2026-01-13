import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout, getComplaints, isAdminAuthed, resolveComplaint } from "../lib/storage";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const authed = useMemo(() => isAdminAuthed(), []);
  const [complaints, setComplaints] = useState([]);
  const [noteById, setNoteById] = useState({});

  useEffect(() => {
    if (!authed) {
      navigate("/admin/login");
      return;
    }
    setComplaints(getComplaints());
  }, [authed, navigate]);

  const onResolve = (id) => {
    const note = noteById[id] || "";
    const next = resolveComplaint(id, note);
    setComplaints(next);
  };

  const open = complaints.filter((c) => c.status !== "resolved");
  const resolved = complaints.filter((c) => c.status === "resolved");

  return (
    <div style={{ padding: 24 }}>
      <div className="page-head">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="subtitle">Manage complaints efficiently</p>
        </div>
        <div className="item-actions">
          <button
            className="btn"
            onClick={() => {
              adminLogout();
              navigate("/admin/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <h3>Open complaints ({open.length})</h3>
      {open.length === 0 ? (
        <div className="card empty">No open complaints.</div>
      ) : (
        <div className="list">
          {open.map((c) => (
            <div key={c.id} className="item">
              <div className="item-grid">
                <div className="item-main">
                  <div className="item-top">
                    <h2 className="item-title">{c.title || "Complaint"}</h2>
                    <span className="badge badge--neutral">
                      #{c.id} • {new Date(c.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="item-desc">{c.description || c.message}</p>
                </div>
                <div className="item-right">
                  <input
                    value={noteById[c.id] || ""}
                    onChange={(e) =>
                      setNoteById((m) => ({
                        ...m,
                        [c.id]: e.target.value
                      }))
                    }
                    className="input"
                    placeholder="Resolution note"
                  />
                  <button className="btn primary" onClick={() => onResolve(c.id)}>
                    Mark resolved
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>Resolved complaints ({resolved.length})</h3>
      {resolved.length === 0 ? (
        <p>No resolved complaints.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {resolved.map((c) => (
            <div key={c.id} style={{ border: "1px solid #eee", padding: 12, opacity: 0.85 }}>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                #{c.id} • created {new Date(c.createdAt).toLocaleString()}
                {c.resolvedAt ? ` • resolved ${new Date(c.resolvedAt).toLocaleString()}` : ""}
              </div>

              <div style={{ marginTop: 6 }}>
                <strong>{c.title || "Complaint"}</strong>
              </div>

              <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>
                {c.description || c.message}
              </div>

              {c.resolutionNote ? (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <strong>Note:</strong> {c.resolutionNote}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
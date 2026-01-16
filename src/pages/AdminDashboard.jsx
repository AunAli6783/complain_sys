import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout, getComplaints, isAdminAuthed } from "../lib/storage.js";

const API_BASE = "http://localhost:3000";

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const authed = useMemo(() => isAdminAuthed(), []);
  const [complaints, setComplaints] = useState([]);
  const [noteById, setNoteById] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    if (!authed) {
      navigate("/auth?role=admin&mode=login");
      return;
    }
    getComplaints().then(setComplaints);
  }, [authed, navigate]);

  const onResolve = async (id) => {
    const note = noteById[id] || "";
    setSubmittingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/complaints/${id}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resolutionNote: note,
          adminUsername: localStorage.getItem("adminUsername"),
          adminId: Number(localStorage.getItem("adminId") || 0) || undefined,
        }),
      });

      const body = await readJsonSafe(res);

      if (!res.ok) {
        alert(body?.message || `Resolve failed (${res.status})`);
        return;
      }

      // accept either updated list response or just refresh
      if (Array.isArray(body)) setComplaints(body);
      else await getComplaints().then(setComplaints);

      setNoteById((m) => ({ ...m, [id]: "" }));
    } finally {
      setSubmittingId(null);
    }
  };

  const open = complaints.filter(
    (c) => !String(c.status || "").toLowerCase().includes("resolve")
  );
  const resolved = complaints.filter((c) =>
    String(c.status || "").toLowerCase().includes("resolve")
  );

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
                      #{c.id}
                      {c.createdAt ? ` • ${new Date(c.createdAt).toLocaleString()}` : ""}
                    </span>
                  </div>
                  <p className="item-desc">{c.description || c.message}</p>
                </div>

                <div className="item-right">
                  <input
                    value={noteById[c.id] || ""}
                    onChange={(e) =>
                      setNoteById((m) => ({ ...m, [c.id]: e.target.value }))
                    }
                    className="input"
                    placeholder="Resolution note"
                  />
                  <button
                    className="btn primary"
                    disabled={submittingId === c.id}
                    onClick={() => onResolve(c.id)}
                  >
                    {submittingId === c.id ? "Resolving..." : "Mark resolved"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>Resolved complaints ({resolved.length})</h3>
      {resolved.length === 0 ? (
        <div className="card empty">No resolved complaints.</div>
      ) : (
        <div className="list">
          {resolved.map((c) => (
            <div key={c.id} className="item item--resolved">
              <div className="item-grid">
                <div className="item-main">
                  <div className="item-top">
                    <h2 className="item-title">{c.title || "Complaint"}</h2>
                    <span className="badge badge--success">
                      Resolved • #{c.id}
                      {c.createdAt
                        ? ` • created ${new Date(c.createdAt).toLocaleString()}`
                        : ""}
                      {c.resolvedAt
                        ? ` • resolved ${new Date(c.resolvedAt).toLocaleString()}`
                        : ""}
                    </span>
                  </div>

                  <p className="item-desc" style={{ whiteSpace: "pre-wrap" }}>
                    {c.description || c.message}
                  </p>

                  {c.resolutionNote ? (
                    <div className="resolved-note">
                      <div className="resolved-note__label">Resolution note</div>
                      <div className="resolved-note__body">{c.resolutionNote}</div>
                    </div>
                  ) : null}
                </div>

                <div className="item-right">
                  <div className="muted-meta">
                    <div><strong>Status:</strong> Resolved</div>
                    <div>
                      <strong>Admin:</strong>{" "}
                      {c.adminUsername || c.resolvedBy || "—"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .item.item--resolved{
          border: 1px solid rgba(34,197,94,.18);
          background: linear-gradient(180deg, rgba(34,197,94,.06), rgba(34,197,94,.02));
        }
        .badge.badge--success{
          display:inline-flex;
          align-items:center;
          gap:6px;
          padding:6px 10px;
          border-radius:999px;
          font-size:12px;
          background: rgba(34,197,94,.12);
          border: 1px solid rgba(34,197,94,.25);
          color:#166534;
        }
        .resolved-note{
          margin-top:10px;
          padding:10px 12px;
          border-radius:12px;
          background: rgba(15,23,42,.03);
          border: 1px solid rgba(15,23,42,.08);
        }
        .resolved-note__label{
          font-size:12px;
          opacity:.7;
          margin-bottom:6px;
        }
        .resolved-note__body{
          font-size:14px;
          white-space:pre-wrap;
        }
        .muted-meta{
          font-size:12px;
          opacity:.75;
          line-height:1.5;
          padding:10px 12px;
          border-radius:12px;
          background: rgba(15,23,42,.025);
          border: 1px solid rgba(15,23,42,.06);
          min-width: 200px;
        }
      `}</style>
    </div>
  );
}
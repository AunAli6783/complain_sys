import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:3000";

export default function ResolvedComplaints() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/complaints`)
      .then((r) => r.json())
      .then((rows) =>
        setItems(
          (rows || [])
            .filter((c) => String(c.status || "").toLowerCase().includes("resolve"))
            .map((c) => ({
              ...c,
              resolutionNote: c.resolutionNote || "",
            }))
        )
      )
      .finally(() => setLoading(false));
  }, []);

  const pretty = useMemo(
    () =>
      items.map((c) => {
        const resolvedBy =
          c.resolvedByName ||
          c.resolved_by_name ||
          c.adminUsername ||
          c.resolvedBy ||
          null;

        const createdLabel = c.createdAt ? new Date(c.createdAt).toLocaleString() : null;
        const resolvedLabel = c.resolvedAt ? new Date(c.resolvedAt).toLocaleString() : null;

        return { ...c, resolvedBy, createdLabel, resolvedLabel };
      }),
    [items]
  );

  if (loading) return <div className="card">Loading resolved complaints...</div>;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Resolved Complaints</h1>
          <p className="subtitle">{pretty.length} resolved</p>
        </div>
      </div>

      {pretty.length === 0 ? (
        <div className="card empty">No resolved complaints yet.</div>
      ) : (
        <div className="list">
          {pretty.map((c) => (
            <div key={c.id} className="item">
              <div className="item-top">
                <h2 className="item-title">{c.title || "Complaint"}</h2>
                <span className="badge badge--ok">Resolved</span>
              </div>

              <div className="item-meta">
                <span className="pill">{c.category || "general"}</span>
                <span className="pill">
                  Resolved by: {c.resolvedBy ? c.resolvedBy : "Unknown"}
                </span>
                {c.createdLabel ? <span className="pill">Created: {c.createdLabel}</span> : null}
                {c.resolvedLabel ? <span className="pill">Resolved: {c.resolvedLabel}</span> : null}
              </div>

              <div className="card details">
                <div className="row">
                  <div className="k">Resolution Note</div>
                  <div className="v prewrap">
                    {c.resolutionNote?.trim() ? c.resolutionNote : "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
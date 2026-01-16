import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadComplaints } from "../lib/storage.js";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await loadComplaints();
        const currentUserId = Number(localStorage.getItem('userId')); // Convert to number!
        
        console.log('🔍 Current user ID:', currentUserId, typeof currentUserId);
        
        const filtered = data.filter(c => {
          const matches = c.userId === currentUserId;
          console.log(`Complaint ${c.id}: userId=${c.userId}, username=${c.username}, matches=${matches}`);
          return matches && c.status !== 'Resolved';
        });
        
        console.log("User complaints:", filtered);
        setComplaints(filtered);
      } catch (error) {
        console.error("Failed to load complaints:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userAuthed");
    localStorage.removeItem("userId");
    localStorage.removeItem("userUsername");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authUsername");
    localStorage.removeItem("authId");
    navigate("/auth");
  };

  const total = complaints.length;

  if (loading) return <div className="card">Loading complaints...</div>;
  if (error) return <div className="card" style={{color: 'red'}}>Error: {error}</div>;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">My Complaints</h1>
          <p className="subtitle">{total} total</p>
        </div>

        <div className="item-actions">
          <Link to="/home" className="btn">
            Submit Complaint
          </Link>
          <Link to="/resolved" className="btn">
            Resolved
          </Link>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </div>

      {total === 0 ? (
        <div className="card empty">
          No complaints found.{" "}
          <Link to="/home" className="link">
            Submit one
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
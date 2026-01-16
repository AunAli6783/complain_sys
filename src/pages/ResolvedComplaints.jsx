import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadComplaints } from "../lib/storage.js";

export default function ResolvedComplaints() {
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
          console.log(`Complaint ${c.id}: userId=${c.userId}, username=${c.username}, status=${c.status}, matches=${matches}`);
          return matches && c.status === 'Resolved';
        });
        
        console.log("Resolved complaints:", filtered);
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

  if (loading) return <div className="card">Loading resolved complaints...</div>;
  if (error) return <div className="card" style={{color: 'red'}}>Error: {error}</div>;

  return (
    <section>
      <div className="page-head">
        <div>
          <h1 className="page-title">Resolved Complaints</h1>
          <p className="subtitle">{complaints.length} resolved</p>
        </div>
        <div className="item-actions">
          <Link to="/home" className="btn">
            Submit Complaint
          </Link>
          <Link to="/complaints" className="btn">
            My Complaints
          </Link>
          <button onClick={handleLogout} className="btn">
            Logout
          </button>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="card empty">No resolved complaints yet.</div>
      ) : (
        <div className="list">
          {complaints.map((complaint) => (
            <div key={complaint.id} className="item item--resolved">
              <div className="item-grid">
                <div className="item-main">
                  <div className="item-top">
                    <h2 className="item-title">{complaint.title}</h2>
                    <span className="badge badge--success">Resolved</span>
                  </div>
                  <div className="item-meta">
                    <span className="pill">{complaint.category}</span>
                  </div>
                  <p className="item-desc">{complaint.description}</p>
                  {complaint.resolutionNote && (
                    <div className="resolved-note">
                      <div className="resolved-note__label">Resolution</div>
                      <div className="resolved-note__body">{complaint.resolutionNote}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
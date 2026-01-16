import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function setSession({ role, id, username }) {
  localStorage.setItem("authRole", role);
  localStorage.setItem("authUsername", username);
  if (id != null) localStorage.setItem("authId", String(id));

  if (role === "admin") {
    localStorage.setItem("adminUsername", username);
    if (id != null) localStorage.setItem("adminId", String(id));
    localStorage.setItem("adminAuthed", "1");
  } else {
    localStorage.setItem("userUsername", username);
    if (id != null) localStorage.setItem("userId", String(id));
    localStorage.setItem("userAuthed", "1");
  }
}

export default function Auth() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate registration
    if (mode === "register") {
      if (role === "admin") {
        setError("Admin registration is disabled. Contact system administrator.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
    }

    setLoading(true);

    const endpoint = `${API_BASE}/api/auth/${role}/${mode}`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const body = await readJsonSafe(res);

      if (!res.ok) {
        setError(body?.message || `${mode === "login" ? "Login" : "Registration"} failed (${res.status})`);
        return;
      }

      const id = body?.id ?? body?.adminId ?? body?.userId ?? null;
      const uname = body?.username || username;

      // Add console logging to verify data
      console.log('✅ Auth successful:', { role, id, username: uname, rawBody: body });

      setSession({ role, id, username: uname });

      // Verify localStorage after setSession
      console.log('✅ Saved to localStorage:', {
        userId: localStorage.getItem('userId'),
        userUsername: localStorage.getItem('userUsername'),
        userAuthed: localStorage.getItem('userAuthed')
      });

      // Route based on role
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/complaints");
      }
    } catch (err) {
      console.error('❌ Auth error:', err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      <div className="auth-card card">
        <div className="auth-head">
          <h1 className="page-title">Complaint Management System</h1>
          <p className="subtitle">
            {mode === "login" ? "Login to access your account" : "Create a new user account"}
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label>Login As</label>
            <select
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setError("");
                // Reset to login mode when switching to admin
                if (e.target.value === "admin" && mode === "register") {
                  setMode("login");
                }
              }}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Show mode toggle only for users */}
          {role === "user" && (
            <div className="auth-mode-toggle">
              <button
                type="button"
                className={`btn ${mode === "login" ? "primary" : ""}`}
                onClick={() => {
                  setMode("login");
                  setError("");
                  setConfirmPassword("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`btn ${mode === "register" ? "primary" : ""}`}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Register
              </button>
            </div>
          )}

          <div className="field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              placeholder="Enter username"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              placeholder="Enter password"
              required
            />
          </div>

          {/* Show confirm password only in register mode */}
          {mode === "register" && role === "user" && (
            <div className="field">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirm password"
                required
              />
            </div>
          )}

          {error ? <div className="auth-error">{error}</div> : null}

          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? (mode === "login" ? "Logging in..." : "Creating account...") : (mode === "login" ? "Login" : "Register")}
            </button>
          </div>

          {role === "admin" && (
            <div className="help" style={{ marginTop: 12, fontSize: 13, opacity: 0.7 }}>
              💡 Admin accounts must be created via CLI: <code>npm run setup-admin</code>
            </div>
          )}
        </form>
      </div>

      <style>{`
        .auth-mode-toggle {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        .auth-mode-toggle .btn {
          flex: 1;
        }
      `}</style>
    </section>
  );
}
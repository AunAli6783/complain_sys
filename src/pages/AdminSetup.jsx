
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { isAdminSetup, setAdminPasswordHash } from "../lib/storage";

export default function AdminSetup() {
  const navigate = useNavigate();
  const already = useMemo(() => isAdminSetup(), []);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  if (already) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Admin already set up</h2>
        <button onClick={() => navigate("/admin/login")}>Go to Admin Login</button>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    const hash = await bcrypt.hash(password, 10);
    setAdminPasswordHash(hash);
    navigate("/admin/login");
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Admin Setup</h2>
      <p>Create the admin password (stored locally in this browser).</p>

      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Confirm password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
        <button type="submit">Set admin password</button>
      </form>
    </div>
  );
}
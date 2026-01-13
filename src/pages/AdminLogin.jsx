
import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import { getAdminPasswordHash, isAdminSetup, setAdminAuthed } from "../lib/storage";

export default function AdminLogin() {
  const navigate = useNavigate();
  const setup = useMemo(() => isAdminSetup(), []);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!setup) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Admin not set up</h2>
        <Link to="/admin/setup">Go to Admin Setup</Link>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const hash = getAdminPasswordHash();
    const ok = await bcrypt.compare(password, hash);
    if (!ok) return setError("Invalid password.");
    setAdminAuthed(true);
    navigate("/admin");
  };

  return (
    <div style={{ padding: 24, maxWidth: 420 }}>
      <h2>Admin Login</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        {error && <div style={{ color: "crimson", marginBottom: 12 }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
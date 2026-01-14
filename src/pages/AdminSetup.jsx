import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSetup() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/admin/login");
  }, [navigate]);

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Setup</h2>
      <p>Admin setup must be done via terminal before starting the app.</p>
      <p>Run: <code>npm run setup-admin</code></p>
    </div>
  );
}
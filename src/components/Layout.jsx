import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div>
      <nav className="topbar">
        <div className="container">
          <div className="brand">
            <h1 className="title">Complaint System</h1>
          </div>
          <div className="nav">
            <Link to="/" className="btn">
              Home
            </Link>
            <Link to="/complaints" className="btn">
              My Complaints
            </Link>
            <Link to="/admin/login" className="btn">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>
      <main className="container">{children}</main>
    </div>
  );
}
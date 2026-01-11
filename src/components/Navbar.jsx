
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <div className="navbar__brand">Complaint Management</div>
        <nav className="navbar__links">
          <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink
            to="/complaints"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Complaints
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
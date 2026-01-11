
import { NavLink } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <>
      <header className="topbar">
        <div className="container brand">
          <div className="title">Complaint Management</div>

          <nav className="nav" aria-label="Primary">
            <NavLink to="/" end>
              Home
            </NavLink>
            <NavLink to="/complaints">My Complaints</NavLink>
          </nav>
        </div>
      </header>

      <main className="container">{children}</main>
    </>
  );
}
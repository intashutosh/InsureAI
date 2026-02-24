import React from "react";
import { Link } from "react-router-dom";
import "../../css/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dealership Dashboard</h2>
        <p className="subtitle">Manage your profile and damage claims</p>
      </div>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <Link to="/dealership/profile" className="dashboard-nav-link">Profile</Link>
          <Link to="/dealership/submit-damage" className="dashboard-nav-link">Submit Damage</Link>
          <Link to="/dealership/submissions" className="dashboard-nav-link">My Submissions</Link>
        </nav>

        <div style={{ marginTop: 20 }}>
          <p>Use the links above to manage your profile and damage claims.</p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import "../css/auth.css";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);

  return (
    <div className="role-selection-page">
      <div className="role-selection-card">
        <h1>Welcome to InsureAI Portal</h1>
        {!selectedRole ? (
          <>
            <p className="subtitle">Select your role to continue</p>
            <div className="role-buttons">
              <button className="role-btn dealership-btn" onClick={() => setSelectedRole("dealership")}>Dealership</button>
              <button className="role-btn insurer-btn" onClick={() => setSelectedRole("insurer")}>Insurer</button>
            </div>
          </>
        ) : (
          <>
            <p className="subtitle">Continue as <b>{selectedRole === "dealership" ? "Dealership" : "Insurer"}</b></p>
            <div className="role-buttons">
              <a
                href={`/${selectedRole}/login`}
                className={`role-btn ${selectedRole}-btn`}
              >
                Login
              </a>
              <a
                href={`/${selectedRole}/signup`}
                className={`role-btn ${selectedRole}-btn`}
              >
                Signup
              </a>
            </div>
            <button
              className="role-btn back-btn"
              onClick={() => setSelectedRole(null)}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}


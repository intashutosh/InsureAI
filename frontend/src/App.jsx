import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthProvider";
import PrivateRoute from "./components/PrivateRoute";
import "./css/nav.css";

import RoleSelection from "./pages/RoleSelection";

// ====== Dealership Pages ======
import DealershipSignup from "./pages/dealership/Signup";
import DealershipLogin from "./pages/dealership/Login";
import DealershipDashboard from "./pages/dealership/Dashboard";
import DamageSubmission from "./pages/dealership/DamageForm";
import Submissions from "./pages/dealership/Submissions";
import Profile from "./pages/dealership/Profile";

// ====== Insurer Pages ======
import InsurerSignup from "./pages/insurer/Signup";
import InsurerLogin from "./pages/insurer/Login";
import InsurerDashboard from "./pages/insurer/Dashboard";
import ClaimReview from "./pages/insurer/ClaimReview";
import AnalysisPage from "./pages/insurer/AnalysisPage";

export default function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>

      {/* ===== Navbar (only after login) ===== */}
      {user && (
        <nav className="navbar">
          <div className="navbar-left">
            <Link to={
              user.role === "DEALERSHIP" || user.role === "dealership"
                ? "/dealership/dashboard"
                : "/insurer/dashboard"
            } className="navbar-brand">
              InsureAI
            </Link>
            <div className="navbar-links">
              {/* Universal Dashboard Link */}
              <Link
                to={
                  user.role === "DEALERSHIP" || user.role === "dealership"
                    ? "/dealership/dashboard"
                    : "/insurer/dashboard"
                }
                className="navbar-link"
              >
                Dashboard
              </Link>

              {/* Dealership-only links */}
              {(user.role === "dealership" || user.role === "DEALERSHIP") && (
                <>
                  <Link to="/dealership/submissions" className="navbar-link">Submissions</Link>
                  <Link to="/dealership/submit-damage" className="navbar-link">Submit Damage</Link>
                  <Link to="/dealership/profile" className="navbar-link">Profile</Link>
                </>
              )}

              {/* Insurer-only links */}
              {(user.role === "insurer" || user.role === "INSURER") && (
                <Link to="/insurer/dashboard" className="navbar-link">Claims</Link>
              )}
            </div>
          </div>
          <div className="navbar-right">
            <button className="btn-logout" onClick={logout}>Logout</button>
          </div>
        </nav>
      )}

      {/* ===== Routes ===== */}
      <Routes>
        <Route path="/" element={<RoleSelection />} />

        {/* ==== Dealership Routes ==== */}
        <Route path="/dealership/signup" element={<DealershipSignup />} />
        <Route path="/dealership/login" element={<DealershipLogin />} />

        <Route
          path="/dealership/dashboard"
          element={
            <PrivateRoute role="dealership">
              <DealershipDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dealership/submit-damage"
          element={
            <PrivateRoute role="dealership">
              <DamageSubmission />
            </PrivateRoute>
          }
        />
        <Route
          path="/dealership/submissions"
          element={
            <PrivateRoute role="dealership">
              <Submissions />
            </PrivateRoute>
          }
        />
        <Route
          path="/dealership/profile"
          element={
            <PrivateRoute role="dealership">
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ==== Insurer Routes ==== */}
        <Route path="/insurer/signup" element={<InsurerSignup />} />
        <Route path="/insurer/login" element={<InsurerLogin />} />

        <Route
          path="/insurer/dashboard"
          element={
            <PrivateRoute role="insurer">
              <InsurerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurer/claim-analysis/:id"
          element={
            <PrivateRoute role="insurer">
              <AnalysisPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurer/review/:id"
          element={
            <PrivateRoute role="insurer">
              <ClaimReview />
            </PrivateRoute>
          }
        />

        {/* BAD URL fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

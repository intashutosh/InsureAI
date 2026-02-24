import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import "../../css/insurer-dashboard.css";

export default function InsurerDashboard() {
  const [claims, setClaims] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/insurer/claims/pending");
      setClaims(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error("Failed to fetch claims", err);
      setError("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  // simple client-side search
  useEffect(() => {
    if (!q) return setFiltered(claims);
    const lower = q.toLowerCase();
    setFiltered(
      claims.filter((c) =>
        (c.vin || "").toLowerCase().includes(lower) ||
        (c.registrationNumber || "").toLowerCase().includes(lower) ||
        (c.dealershipId || "").toLowerCase().includes(lower)
      )
    );
  }, [q, claims]);

const handleAnalyze = (id) => {
  // Navigate to the ClaimAnalysis page for this claim
  navigate(`/insurer/claim-analysis/${id}`);
};

  if (loading) return (
    <div className="insurer-dashboard-page">
      <div className="loading-state">Loading claims...</div>
    </div>
  );
  
  if (error) return (
    <div className="insurer-dashboard-page">
      <div className="error-state">{error}</div>
    </div>
  );

  return (
    <div className="insurer-dashboard-page">
      <div className="insurer-dashboard-header">
        <h2>Pending Claims</h2>
      </div>

      <div className="insurer-dashboard-controls">
        <input
          type="text"
          placeholder="Search by VIN, registration, dealership..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="insurer-search-input"
        />
        <button 
          onClick={() => { setQ(""); setFiltered(claims); }}
          className="btn-secondary"
        >
          Clear
        </button>
        <button 
          onClick={fetchClaims}
          className="btn-primary"
        >
          Refresh
        </button>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <p>No pending claims found.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <table className="insurer-claims-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Dealership</th>
              <th>Vehicle</th>
              <th>Preview</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const firstImg = c.damageImages ? c.damageImages.split(",")[0] : null;
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.dealershipId}</td>
                  <td>
                    <div className="vehicle-info-cell">
                      {c.brand} {c.model}
                      <small>VIN: {c.vin}</small>
                    </div>
                  </td>
                  <td>
                    {firstImg ? (
                      <img
                        src={`${api.defaults.baseURL || ""}/uploads/${firstImg}`}
                        alt="preview"
                        className="vehicle-preview-img"
                      />
                    ) : (
                      <small>No image</small>
                    )}
                  </td>
                  <td>
                    {c.submittedAt ? new Date(c.submittedAt).toLocaleString() : "-"}
                  </td>
                  <td>
                    <span className={`status-badge ${c.status?.toLowerCase() || "pending"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        onClick={() => navigate(`/insurer/review/${c.id}`)}
                        className="btn-view"
                      >
                        View
                      </button>
                      <button
                          onClick={() => handleAnalyze(c.id)}
                          className="btn-analyze"
                        >
                          Analyze
                        </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

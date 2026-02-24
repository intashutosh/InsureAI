import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import "../../css/analysis.css";

export default function ClaimAnalysis() {
  const { id: claimId } = useParams(); // get claimId from route params
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!claimId) {
      setError("Invalid claim ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    api
      .get(`/insurer/claims/analysis/${claimId}`)
      .then((res) => {
        // Ensure res.data is an array of results
        const data = Array.isArray(res.data) ? res.data : res.data.results || [];
        setResults(data);
      })
      .catch((err) => {
        setError("Failed to load analysis");
        console.error("AxiosError:", err);
      })
      .finally(() => setLoading(false));
  }, [claimId]);

  if (loading) return <div className="analysis-loading">Analyzing claim…</div>;
  if (error) return <div className="analysis-error">{error}</div>;

  return (
    <div className="analysis-page">
      <h2 className="analysis-page-heading">AI Damage Analysis</h2>

      {results.length === 0 ? (
        <div className="analysis-empty-state">No analysis available</div>
      ) : (
        results.map((item, index) => {
          // Ensure predictions is always an array
          const predictionsArray = Array.isArray(item.predictions) ? item.predictions : [];

          return (
            <div key={index} className="analysis-card">
              {/* IMAGE */}
              <img
                src={`http://localhost:8080${item.image}`}
                alt="damage"
                className="analysis-image"
              />

              <div className="analysis-card-body">
                <h3 className="analysis-sub-heading">Predictions</h3>

                {predictionsArray.length === 0 ? (
                  <div className="analysis-no-prediction">No damage detected</div>
                ) : (
                  <ul className="analysis-list">
                    {predictionsArray.map((p, i) => (
                      <li key={i} className="analysis-list-item">
                        <strong>Part:</strong> {p.part} <br />
                        <strong>Damage:</strong> {p.damage} <br />
                        <strong>Price:</strong> ₹{p.price}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../../api";
import "../../css/submissions.css";

export default function Submissions(){
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    api.get("/damage/my-submissions")
      .then(r => setSubs(r.data))
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="submissions-page">
      <div className="submissions-container">
        <div className="submissions-header">
          <h3>My Submissions</h3>
        </div>
        {subs.length === 0 ? (
          <div className="empty-submissions">
            <div className="empty-submissions-icon">📋</div>
            <p className="empty-submissions-message">No submissions yet</p>
          </div>
        ) : (
          <div className="submissions-list">
            {subs.map(s => (
              <div key={s.id} className="submission-card">
                <div className="submission-header">
                  <div className="submission-id">Submission #{s.id}</div>
                  <span className={`submission-status ${s.status?.toLowerCase()}`}>
                    {s.status}
                  </span>
                </div>
                <div className="submission-info">
                  <div className="submission-info-item">
                    <label>Vehicle</label>
                    <span className="value">{s.brand} {s.model} ({s.year})</span>
                  </div>
                  <div className="submission-info-item">
                    <label>VIN</label>
                    <span className="value">{s.vin}</span>
                  </div>
                  <div className="submission-info-item">
                    <label>Estimate</label>
                    <span className="value">
                      {s.estimateImageUrl ? (
                        <a 
                          href={`${API_BASE}/uploads/${s.estimateImageUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="estimate-link"
                        >
                          View Estimate
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </span>
                  </div>
                </div>
                {s.damageImages && (
                  <div className="submission-images">
                    <h4>Damage Images</h4>
                    <div className="damage-images-grid">
                      {s.damageImages.split(",").map((img, idx) => (
                        <img 
                          key={idx} 
                          src={`${API_BASE}/uploads/${img}`} 
                          alt="damage" 
                          className="damage-image"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

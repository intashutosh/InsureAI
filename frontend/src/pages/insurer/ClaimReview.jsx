import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import "../../css/claims.css";

export default function ClaimReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/insurer/claims/${id}`)
      .then((res) => setClaim(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load claim");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-claim">Loading...</div>;
  if (!claim) return <div className="error">No claim found</div>;

  const imageList = claim.damageImages
    ? claim.damageImages.split(",")
    : [];

  const approveClaim = () => {
    if (!amount) {
      setError("Please enter approved amount");
      return;
    }

    api.post(`/insurer/claims/${id}/approve`, null, {
      params: { amount, remarks }
    })
      .then(() => {
        alert("Claim Approved");
        navigate("/insurer/dashboard");
      })
      .catch(() => alert("Failed to approve claim"));
  };

  const rejectClaim = () => {
    if (!remarks) {
      setError("Please enter remarks to reject");
      return;
    }

    api.post(`/insurer/claims/${id}/reject`, null, {
      params: { remarks }
    })
      .then(() => {
        alert("Claim Rejected");
        navigate("/insurer/dashboard");
      })
      .catch(() => alert("Failed to reject claim"));
  };

  return (
    <div className="claim-review-page">
      <div className="claim-review-container">
        <div className="claim-header">
          <h2>Review Claim #{claim.id}</h2>
          <div className="vehicle-info">
            <div className="vehicle-info-item">
              <label>Status</label>
              <span className="value">{claim.status}</span>
            </div>
            <div className="vehicle-info-item">
              <label>Dealership ID</label>
              <span className="value">{claim.dealershipId}</span>
            </div>
          </div>
        </div>

        <div className="claim-section">
          <h3>Vehicle Details</h3>
          <div className="vehicle-info">
            <div className="vehicle-info-item">
              <label>Brand</label>
              <span className="value">{claim.brand}</span>
            </div>
            <div className="vehicle-info-item">
              <label>Model</label>
              <span className="value">{claim.model}</span>
            </div>
            <div className="vehicle-info-item">
              <label>Year</label>
              <span className="value">{claim.year}</span>
            </div>
            <div className="vehicle-info-item">
              <label>VIN</label>
              <span className="value">{claim.vin}</span>
            </div>
            <div className="vehicle-info-item">
              <label>Registration</label>
              <span className="value">{claim.registrationNumber}</span>
            </div>
          </div>
        </div>

        <div className="claim-section">
          <h3>Damage Images</h3>
          <div className="damage-images-container">
            {imageList.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:8080${img}`}
                alt="damage"
                className="damage-image-large"
              />
            ))}
          </div>
        </div>

        {claim.estimateImageUrl && (
          <div className="claim-section">
            <h3>Estimate Image</h3>
            <div className="estimate-image-container">
              <img
                src={`http://localhost:8080${claim.estimateImageUrl}`}
                alt="estimate"
                className="estimate-image-large"
              />
            </div>
          </div>
        )}

        <div className="approval-section">
          <h4>Insurer Decision</h4>

          {error && <div className="error">{error}</div>}

          <div className="approval-input-group">
            <label>Approved Amount:</label>
            <input
              type="number"
              placeholder="Enter approved claim amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="approval-amount-input"
            />
          </div>

          <div className="approval-input-group">
            <label>Remarks:</label>
            <textarea
              placeholder="Enter insurer remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>

          <div className="approval-actions">
            <button onClick={approveClaim} className="btn-approve">
              Approve Claim
            </button>
            <button onClick={rejectClaim} className="btn-reject">
              Reject Claim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

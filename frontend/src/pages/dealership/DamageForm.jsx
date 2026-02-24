  import React, { useState } from "react";
  import api from "../../api";
  import "../../css/forms.css";

  export default function DamageForm(){
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [vin, setVin] = useState("");
    const [registration, setRegistration] = useState("");
    const [damageFiles, setDamageFiles] = useState([]);
    const [estimateFile, setEstimateFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const submit = async (e) => {
      e.preventDefault();
      if (damageFiles.length < 3) {
        alert("Please upload at least 3 damage images");
        return;
      }
      if (!estimateFile) {
        alert("Please upload estimate image");
        return;
      }

      const fd = new FormData();
      fd.append("brand", brand);
      fd.append("model", model);
      fd.append("year", year);
      fd.append("vin", vin);
      fd.append("registrationNumber", registration);

      damageFiles.forEach(file => fd.append("damageImages", file));
      fd.append("estimateImage", estimateFile);

      try {
        setSubmitting(true);
        const res = await api.post("/damage/submit", fd);


        alert("Submitted: id " + res.data.id);
      } catch (err) {
        console.error(err);
        alert(err?.response?.data || "Submission failed");
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="form-page">
        <form onSubmit={submit} className="form-container">
          <h3>Submit Damage</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Brand</label>
              <input 
                className="form-input" 
                placeholder="Brand" 
                value={brand} 
                onChange={e=>setBrand(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Model</label>
              <input 
                className="form-input" 
                placeholder="Model" 
                value={model} 
                onChange={e=>setModel(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Year</label>
              <input 
                className="form-input" 
                placeholder="Year" 
                value={year} 
                onChange={e=>setYear(e.target.value)} 
                required 
                type="number"
              />
            </div>
            <div className="form-group">
              <label>VIN</label>
              <input 
                className="form-input" 
                placeholder="VIN" 
                value={vin} 
                onChange={e=>setVin(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Registration Number</label>
            <input 
              className="form-input" 
              placeholder="Registration Number" 
              value={registration} 
              onChange={e=>setRegistration(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Damage Images (min 3)</label>
            <input 
              className="form-input" 
              type="file" 
              multiple 
              accept="image/*" 
              onChange={e=>setDamageFiles([...e.target.files])} 
            />
            <p className="form-help-text">Upload at least 3 images of the damage</p>
            {damageFiles.length > 0 && (
              <div className="file-list">
                {Array.from(damageFiles).map((file, idx) => (
                  <span key={idx} className="file-item">{file.name}</span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Estimate Image</label>
            <input 
              className="form-input" 
              type="file" 
              accept="image/*" 
              onChange={e=>setEstimateFile(e.target.files[0])} 
            />
            <p className="form-help-text">Upload the estimate document/image</p>
            {estimateFile && (
              <div className="file-list">
                <span className="file-item">{estimateFile.name}</span>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Damage"}
            </button>
          </div>
        </form>
      </div>
    );
  }

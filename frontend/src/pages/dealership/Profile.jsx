import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import api from "../../api";
import "../../css/profile.css";

export default function Profile(){
  const { user, setUser } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user || {});

  const save = async () => {
    try {
      const res = await api.put("/dealership/me", form);
      setUser(res.data);
      alert("Profile updated");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (!user) return null;
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h2>Profile</h2>
          {!editing && (
            <button className="btn-edit" onClick={()=>{setForm(user); setEditing(true);}}>
              Edit
            </button>
          )}
        </div>
        {!editing ? (
          <div className="profile-info">
            <div className="profile-info-item">
              <label>Dealership Name</label>
              <span className="value">{user.dealershipName}</span>
            </div>
            <div className="profile-info-item">
              <label>Owner Name</label>
              <span className="value">{user.ownerName}</span>
            </div>
            <div className="profile-info-item">
              <label>Email</label>
              <span className="value">{user.email}</span>
            </div>
            <div className="profile-info-item">
              <label>Phone</label>
              <span className="value">{user.phoneNumber || user.phone || "N/A"}</span>
            </div>
            <div className="profile-info-item">
              <label>Address</label>
              <span className="value">{user.address || "N/A"}</span>
            </div>
          </div>
        ) : (
          <form className="profile-edit-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="profile-form-group">
              <label>Dealership Name</label>
              <input 
                value={form.dealershipName || ""} 
                onChange={e=>setForm({...form, dealershipName:e.target.value})} 
              />
            </div>
            <div className="profile-form-group">
              <label>Owner Name</label>
              <input 
                value={form.ownerName || ""} 
                onChange={e=>setForm({...form, ownerName:e.target.value})} 
              />
            </div>
            <div className="profile-form-group">
              <label>Phone</label>
              <input 
                value={form.phoneNumber || form.phone || ""} 
                onChange={e=>setForm({...form, phoneNumber:e.target.value})} 
              />
            </div>
            <div className="profile-form-group">
              <label>Address</label>
              <input 
                value={form.address || ""} 
                onChange={e=>setForm({...form, address:e.target.value})} 
              />
            </div>
            <div className="profile-actions">
              <button type="submit" className="btn-save">Save</button>
              <button type="button" className="btn-cancel-profile" onClick={()=>setEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

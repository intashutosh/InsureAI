import React, { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import "../../css/auth.css";

export default function Signup(){
  const [form, setForm] = useState({
    dealershipName:"", ownerName:"", email:"", phoneNumber:"", address:"", password:""
  });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const change = e => setForm({...form, [e.target.name]: e.target.value});

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/dealership/signup", form);
      alert("Signup successful. Please login.");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <h2>Dealership Signup</h2>
        <div className="auth-form-group">
          <input
            name="dealershipName"
            placeholder="Dealership name"
            className="auth-input"
            value={form.dealershipName}
            onChange={change}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            name="ownerName"
            placeholder="Owner name"
            className="auth-input"
            value={form.ownerName}
            onChange={change}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="auth-input"
            value={form.email}
            onChange={change}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            name="phoneNumber"
            placeholder="Phone number"
            className="auth-input"
            value={form.phoneNumber}
            onChange={change}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            name="address"
            placeholder="Address"
            className="auth-input"
            value={form.address}
            onChange={change}
            required
          />
        </div>
        <div className="auth-form-group">
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="auth-input"
            value={form.password}
            onChange={change}
            required
          />
        </div>
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? "Signing..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

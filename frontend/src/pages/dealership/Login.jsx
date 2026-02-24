// src/pages/dealership/Login.jsx
import { useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import "../../css/auth.css";

export default function DealershipLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/dealership/login", { email, password });
      const token =
        typeof res.data === "string" ? res.data : res.data.token;

      if (!token) throw new Error("No token received");

      await login(token); // AuthProvider handles role + fetching profile
      navigate("/dealership/dashboard");
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          error.message ||
          "Login failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-card">
        <h2>Dealership Login</h2>

        {err && <p className="auth-error">{err}</p>}

        <div className="auth-form-group">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-form-group">
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

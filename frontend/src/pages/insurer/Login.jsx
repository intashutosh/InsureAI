// src/pages/insurer/Login.jsx
import { useState, useContext } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthProvider";
import "../../css/auth.css";

export default function InsurerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/insurer/login", { email, password });

      // Backend returns ONLY token (role is inside JWT)
      const token = res.data.token;

      if (!token) throw new Error("Token missing from server");

      // Call login(token) exactly as AuthProvider expects
      await login(token);

      navigate("/insurer/dashboard");

    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleLogin} className="auth-card">
        <h2>Insurer Login</h2>

        {error && <p className="auth-error">{error}</p>}

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
